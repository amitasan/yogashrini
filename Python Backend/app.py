# app.py  –  Yogashirini Python Backend
# Model: EfficientNetB0  (weights-only save, TF 2.10)
import os, sys, io, json, base64, tempfile
from pathlib import Path

os.environ["MPLCONFIGDIR"] = str(Path(tempfile.gettempdir()) / "matplotlib")

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import tensorflow as tf

# ── GPU ───────────────────────────────────────────────────────────────────────
gpus = tf.config.list_physical_devices("GPU")
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
    print(f"GPU ready ({len(gpus)} device(s))")
else:
    print("No GPU – CPU mode")

from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import (
    Dense, GlobalAveragePooling2D, Dropout, BatchNormalization, Input
)
from tensorflow.keras.models import Model

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR     = Path(__file__).resolve().parent
ROOT_DIR     = BASE_DIR.parent                         # d:\Yoga Website\
WEIGHTS_FILE = ROOT_DIR / "saved_models" / "efficientnetb0_yoga.weights.h5"
CLASS_JSON   = ROOT_DIR / "saved_models" / "class_names.json"
IMG_SIZE     = (224, 224)
NUM_CLASSES  = 47

print("Weights file  :", WEIGHTS_FILE, "exists:", WEIGHTS_FILE.exists())
print("Class JSON    :", CLASS_JSON,   "exists:", CLASS_JSON.exists())

# ── Load class names ──────────────────────────────────────────────────────────
if not CLASS_JSON.exists():
    print("ERROR: class_names.json not found"); sys.exit(1)

class_names = json.loads(CLASS_JSON.read_text(encoding="utf-8"))
print(f"Classes: {len(class_names)}")

# ── Build EfficientNetB0 model (same architecture as training) ────────────────
print("Building EfficientNetB0 model…")
inputs     = Input(shape=(*IMG_SIZE, 3))
base_model = EfficientNetB0(weights="imagenet", include_top=False,
                             input_tensor=inputs)

# Phase-2 state: unfreeze top layers (matches saved weights)
base_model.trainable = True
for layer in base_model.layers[:150]:
    layer.trainable = False

x = base_model(inputs, training=False)
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
outputs = Dense(NUM_CLASSES, activation="softmax")(x)
keras_model = Model(inputs=inputs, outputs=outputs)

# ── Load saved weights ────────────────────────────────────────────────────────
if not WEIGHTS_FILE.exists():
    print("ERROR: weights file not found"); sys.exit(1)

keras_model.load_weights(str(WEIGHTS_FILE))
keras_model.make_predict_function()
print("EfficientNetB0 weights loaded successfully.")

# ── Flask app ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ── Helpers ───────────────────────────────────────────────────────────────────
def dataurl_to_pil(dataurl: str) -> Image.Image:
    _, encoded = dataurl.split(",", 1)
    return Image.open(io.BytesIO(base64.b64decode(encoded))).convert("RGB")

def pil_to_dataurl(img: Image.Image, quality: int = 85) -> str:
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"

def preprocess(pil_img: Image.Image) -> np.ndarray:
    """Resize and add batch dim. EfficientNet handles its own normalisation."""
    img = pil_img.resize(IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    return np.expand_dims(arr, 0)            # (1, 224, 224, 3)

def annotate_image(pil_img: Image.Image, label: str, score: float,
                   top5: list) -> Image.Image:
    """Draw prediction overlay on a copy of the image."""
    img   = pil_img.copy().convert("RGB")
    draw  = ImageDraw.Draw(img)
    W, H  = img.size

    # Semi-transparent header bar
    bar_h = max(36, H // 12)
    draw.rectangle([(0, 0), (W, bar_h)], fill=(0, 0, 0, 180))
    draw.text((8, 6), f"{label}  {score*100:.1f}%", fill=(0, 255, 120))

    # Top-5 list in bottom strip
    strip_h = max(10, H // 18)
    y0 = H - strip_h * len(top5) - 4
    draw.rectangle([(0, y0 - 4), (W, H)], fill=(0, 0, 0, 160))
    for i, (cls, prob) in enumerate(top5):
        col = (0, 255, 120) if i == 0 else (200, 200, 200)
        draw.text((8, y0 + i * strip_h), f"{i+1}. {cls}: {prob*100:.1f}%", fill=col)

    return img

# ── Prediction ────────────────────────────────────────────────────────────────
def run_predict(pil_img: Image.Image):
    x     = preprocess(pil_img)
    probs = keras_model.predict(x, verbose=0)[0]       # shape (47,)
    top5_idx  = np.argsort(probs)[-5:][::-1]
    top5 = [(class_names[i], float(probs[i])) for i in top5_idx]
    label, score = top5[0]
    return label, score, top5, probs

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": "EfficientNetB0",
        "classes": NUM_CLASSES,
        "accuracy": "84.96%"
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not data or "image" not in data:
        return jsonify({"error": "no image provided"}), 400

    # ── decode image ──────────────────────────────────────────────────────────
    try:
        pil = dataurl_to_pil(data["image"])
    except Exception as e:
        return jsonify({"error": "invalid image data", "detail": str(e)}), 400

    # ── inference ─────────────────────────────────────────────────────────────
    try:
        label, score, top5, _probs = run_predict(pil)
    except Exception as e:
        print("Inference error:", repr(e))
        return jsonify({"error": "inference_failed", "detail": str(e)}), 500

    # ── annotated image ───────────────────────────────────────────────────────
    try:
        annotated_pil  = annotate_image(pil, label, score, top5)
        annotated_url  = pil_to_dataurl(annotated_pil, quality=82)
    except Exception:
        annotated_url  = None

    return jsonify({
        "label"           : label,
        "score"           : score,
        "confidence_pct"  : round(score * 100, 2),
        "top5"            : [{"label": c, "score": round(p, 4)} for c, p in top5],
        "keypoints"       : [],          # placeholder for future pose-landmark integration
        "annotated_image" : annotated_url,
    })

@app.route("/classes", methods=["GET"])
def get_classes():
    """Return all 47 class names (useful for admin panel)."""
    return jsonify({"classes": class_names, "count": len(class_names)})

if __name__ == "__main__":
    print(f"\nYogashirini Python Backend — EfficientNetB0 ({NUM_CLASSES} classes)")
    print("Starting on http://0.0.0.0:5000\n")
    app.run(host="0.0.0.0", port=5000, debug=False)