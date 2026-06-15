import React, { useRef, useState } from "react";
import Navbar from "../inc/Navbar";
import Footer from "../inc/Footer";
import "./Posture.css";
import { GiLotus, GiMeditation } from "react-icons/gi";
import { MdCloudUpload, MdAutoAwesome, MdTipsAndUpdates, MdBarChart, MdRefresh } from "react-icons/md";

const API_URL = "http://localhost:5000/predict";

export default function Posture() {
  const [filePreview, setFilePreview]       = useState(null);
  const [status, setStatus]                 = useState("idle");
  const [sending, setSending]               = useState(false);
  const [prediction, setPrediction]         = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [dragOver, setDragOver]             = useState(false);
  const inputRef = useRef(null);

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  function fileToDataURL(file, maxW = 900, q = 0.85) {
    return new Promise((res, rej) => {
      const img = new Image(), rd = new FileReader();
      rd.onload = e => {
        img.onload = () => {
          const s = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * s), h = Math.round(img.height * s);
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          res({ dataUrl: c.toDataURL("image/jpeg", q), width: w, height: h });
        };
        img.onerror = rej; img.src = e.target.result;
      };
      rd.onerror = rej; rd.readAsDataURL(file);
    });
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("Please select a valid image file."); return;
    }
    setStatus("Preparing image…");
    setPrediction(null); setAnnotatedImage(null);
    try {
      const { dataUrl } = await fileToDataURL(file);
      setFilePreview(dataUrl);
      await sendToServer(dataUrl);
    } catch (err) { setStatus("Error: " + (err.message || err)); }
  }

  async function sendToServer(dataUrl) {
    setSending(true); setStatus("Analysing pose…");
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!resp.ok) throw new Error(await resp.text() || `HTTP ${resp.status}`);
      const json = await resp.json();
      setPrediction({ label: json.label, score: json.score, top5: json.top5 || [] });
      if (json.annotated_image) {
        setAnnotatedImage(
          json.annotated_image.startsWith("data:")
            ? json.annotated_image
            : `data:image/jpeg;base64,${json.annotated_image}`
        );
      }
      setStatus("Done");
    } catch (err) {
      setStatus("Error: " + (err.message || err));
    } finally { setSending(false); }
  }

  const confColor = s => s >= 0.70 ? "#2ecc71" : s >= 0.45 ? "#f39c12" : "#e74c3c";
  const confLabel = s => s >= 0.70 ? "High" : s >= 0.45 ? "Medium" : "Low";

  const reset = () => {
    setFilePreview(null); setPrediction(null);
    setAnnotatedImage(null); setStatus("idle");
  };

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <header className="ud-hero posture-hero">
        <div className="ud-hero-inner container">
          <div className="ud-hero-left">
            <GiMeditation size={72} className="posture-hero-icon" style={{ color: "var(--yoga-primary, #FF2D6F)" }} />
            <div className="ud-hero-title-wrap">
              <h1 className="ud-title">AI Yoga Pose Detector</h1>
              <p className="ud-subtitle">
                Upload a photo and let our AI identify your yoga pose
                from 47 classical asanas — instantly and accurately.
              </p>
              <div className="posture-hero-badges">
                <span className="posture-badge">47 Poses Recognised</span>
                <span className="posture-badge">Top-5 Predictions</span>
                <span className="posture-badge">Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="ud-main container">

        {/* ── UPLOAD CARD ── */}
        <section className="ud-card">
          <div className="ud-card-header">
            <div className="ud-card-icon"><MdCloudUpload size={24} style={{ color: "var(--yoga-primary, #FF2D6F)" }} /></div>
            <h3>Upload Your Yoga Image</h3>
          </div>
          <div className="ud-card-body">
            <div
              className={`posture-dropzone${dragOver ? " dz-over" : ""}${sending ? " dz-loading" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
              onClick={() => !sending && inputRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
              aria-label="Upload yoga image"
            >
              <input ref={inputRef} type="file" accept="image/*"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ display: "none" }} />

              {filePreview ? (
                <div className="dz-preview-wrap">
                  <img src={filePreview} alt="Your upload" className="dz-preview-img" />
                  {sending && (
                    <div className="dz-sending-overlay">
                      <div className="posture-spinner" />
                      <span>Analysing…</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="dz-placeholder">
                  <div className="dz-icon">📸</div>
                  <div className="dz-text">Drop your yoga image here or <span className="dz-link">browse files</span></div>
                  <div className="muted" style={{ fontSize: "0.85rem", marginTop: 6 }}>JPG · PNG · WEBP — max 10 MB</div>
                </div>
              )}
            </div>

            {/* Status bar */}
            {status !== "idle" && (
              <div className={`posture-status${status === "Done" ? " ps-ok" : status.startsWith("Error") ? " ps-err" : " ps-loading"}`}>
                {(status !== "Done" && !status.startsWith("Error")) && <span className="posture-spinner-sm" />}
                {status}
              </div>
            )}
          </div>
        </section>

        {/* ── RESULTS ── */}
        {prediction && (
          <>
            {/* Main prediction card */}
            <section className="ud-card">
              <div className="ud-card-header">
                <div className="ud-card-icon"><MdAutoAwesome size={24} style={{ color: "var(--yoga-primary, #FF2D6F)" }} /></div>
                <h3>Prediction Result</h3>
              </div>
              <div className="ud-card-body posture-result-body">

                {/* Annotated image */}
                {annotatedImage && (
                  <div className="posture-annotated-wrap">
                    <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Annotated Output</div>
                    <img src={annotatedImage} alt="Annotated pose" className="posture-annotated-img" />
                  </div>
                )}

                {/* Prediction detail */}
                <div className="posture-pred-detail">
                  <div className="posture-pred-label">{prediction.label}</div>
                  <div className="posture-pred-score" style={{ color: confColor(prediction.score) }}>
                    {(prediction.score * 100).toFixed(1)}% confidence
                    <span className="posture-conf-badge" style={{ background: confColor(prediction.score) }}>
                      {confLabel(prediction.score)}
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="posture-conf-track">
                    <div className="posture-conf-fill"
                      style={{ width: `${prediction.score * 100}%`, background: confColor(prediction.score) }} />
                  </div>

                  {/* Top-5 */}
                  {prediction.top5.length > 0 && (
                    <div className="posture-top5">
                      <div className="posture-top5-title">Top 5 Predictions</div>
                      {prediction.top5.map((item, i) => (
                        <div key={i} className={`posture-top5-row${i === 0 ? " pt5-winner" : ""}`}>
                          <span className="pt5-rank">{i + 1}</span>
                          <span className="pt5-name">{item.label}</span>
                          <div className="pt5-bar-wrap">
                            <div className="pt5-bar" style={{
                              width: `${item.score * 100}%`,
                              background: confColor(item.score),
                              opacity: i === 0 ? 1 : 0.55,
                            }} />
                          </div>
                          <span className="pt5-pct" style={{ color: confColor(item.score) }}>
                            {(item.score * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Tips + retry row */}
            <div className="grid-3">
              <section className="ud-card">
                <div className="ud-card-header">
                  <div className="ud-card-icon"><MdTipsAndUpdates size={24} style={{ color: "var(--yoga-primary, #FF2D6F)" }} /></div>
                  <h3>Tips for Better Results</h3>
                </div>
                <div className="ud-card-body">
                  <ul className="offerings-list">
                    <li>Keep your full body visible in the frame.</li>
                    <li>Use a plain, uncluttered background.</li>
                    <li>Ensure good, even lighting — avoid harsh shadows.</li>
                    <li>Hold the pose clearly without motion blur.</li>
                    <li>Portrait orientation works best for standing poses.</li>
                  </ul>
                </div>
              </section>

              <section className="ud-card">
                <div className="ud-card-header">
                  <div className="ud-card-icon"><MdBarChart size={24} style={{ color: "var(--yoga-primary, #FF2D6F)" }} /></div>
                  <h3>About This Pose Detector</h3>
                </div>
                <div className="ud-card-body">
                  <table className="values-table" style={{ fontSize: "0.88rem" }}>
                    <tbody>
                      <tr><td><strong>Pose Classes</strong></td><td>47 Classical Asanas</td></tr>
                      <tr><td><strong>Training Images</strong></td><td>2,756 Samples</td></tr>
                      <tr><td><strong>Input Size</strong></td><td>224 × 224 px</td></tr>
                      <tr><td><strong>Output</strong></td><td>Top-5 ranked predictions</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="ud-card">
                <div className="ud-card-header">
                  <div className="ud-card-icon"><MdRefresh size={24} style={{ color: "var(--yoga-primary, #FF2D6F)" }} /></div>
                  <h3>Try Another</h3>
                </div>
                <div className="ud-card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p className="muted">Upload a different yoga photo to test more poses.</p>
                  <button className="btn btn-primary" onClick={reset}>↺ Upload New Image</button>
                  <a className="btn btn-outline-secondary" href="/types">Browse All 47 Poses →</a>
                </div>
              </section>
            </div>
          </>
        )}

        {/* ── HOW IT WORKS ── (shown before first prediction) */}
        {!prediction && (
          <div className="grid-3">
            {[
              { icon: <MdCloudUpload size={36} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />, title: "1. Upload", desc: "Drop or browse any clear yoga photo — JPG, PNG, or WEBP." },
              { icon: <GiMeditation size={36} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />, title: "2. Analyse", desc: "Our AI model processes your image through 47 pose classifiers." },
              { icon: <MdAutoAwesome size={36} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />, title: "3. Result", desc: "Get the predicted pose name, confidence score, and top-5 alternatives." },
            ].map(({ icon, title, desc }) => (
              <section key={title} className="ud-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{icon}</div>
                <h3 style={{ color: "var(--accent)" }}>{title}</h3>
                <p className="muted">{desc}</p>
              </section>
            ))}
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}