import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdSave, MdArrowBack, MdSpa, MdCloudUpload } from "react-icons/md";

const API = "http://localhost:2000";

function Editproduct() {
  const { id } = useParams();
  const nav    = useNavigate();
  const imgRef = useRef();

  const [form, setForm] = useState({ pname: "", pprice: "", pdetails: "" });
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [msg,        setMsg]        = useState(null);

  useEffect(() => {
    if (!id) return;
    const fd = new FormData();
    fd.append("id", id);
    fetch(`${API}/product/edit`, { method: "POST", body: fd })
      .then(r => r.json())
      .then(data => {
        setForm({
          pname:    data.pname    || "",
          pprice:   data.pprice   || "",
          pdetails: data.pdetails || "",
        });
        setCurrentImg(data.pimg || "");
        setFetching(false);
      })
      .catch(() => { setFetching(false); setMsg({ type: "danger", text: "Failed to load service" }); });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImg = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("id",       id);
    fd.append("pname",    form.pname);
    fd.append("pprice",   form.pprice);
    fd.append("pdetails", form.pdetails);
    if (imgFile) fd.append("pimg", imgFile);

    try {
      const r    = await fetch(`${API}/product/upd`, { method: "POST", body: fd });
      const data = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Service updated!" });
        setTimeout(() => nav("/listproduct"), 1200);
      } else {
        setMsg({ type: "danger", text: data.error || "Update failed" });
      }
    } catch {
      setMsg({ type: "danger", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Edit Service" />
        <div className="page-container">

          <div className="page-header">
            <div>
              <div className="page-title">Edit Service</div>
              <div className="page-subtitle">Update service information</div>
            </div>
            <button onClick={() => nav("/listproduct")} className="btn-secondary-ys">
              <MdArrowBack /> Back to Services
            </button>
          </div>

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}
          {fetching && <div style={{ color: "#9ca3af", padding: "20px 0" }}>Loading service data...</div>}

          {!fetching && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

                <div className="ys-card">
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdSpa style={{ color: "#7C3AED" }} /> Service Details</div>
                  </div>
                  <div className="ys-card-body">
                    <div className="ys-form-group">
                      <label className="ys-label">Service Name *</label>
                      <input
                        className="ys-input"
                        name="pname"
                        value={form.pname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="ys-form-group">
                      <label className="ys-label">Price (INR)</label>
                      <input
                        className="ys-input"
                        name="pprice"
                        type="number"
                        min="0"
                        value={form.pprice}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ys-form-group">
                      <label className="ys-label">Description</label>
                      <textarea
                        className="ys-input ys-textarea"
                        name="pdetails"
                        value={form.pdetails}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="ys-card">
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdCloudUpload style={{ color: "#7C3AED" }} /> Image</div>
                  </div>
                  <div className="ys-card-body">
                    {/* Current image */}
                    {currentImg && !imgPreview && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>Current Image</div>
                        <img
                          src={`${API}/product_img/${currentImg}`}
                          alt="current"
                          style={{ width: "100%", borderRadius: 8, maxHeight: 160, objectFit: "cover" }}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div
                      className="file-drop-zone"
                      onClick={() => imgRef.current.click()}
                    >
                      <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} />
                      {imgPreview
                        ? <img src={imgPreview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 160, objectFit: "cover" }} />
                        : <>
                            <div className="file-drop-icon"><MdCloudUpload /></div>
                            <div className="file-drop-text">Click to replace image</div>
                            <div className="file-drop-hint">Leave empty to keep current</div>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
                <button type="button" onClick={() => nav("/listproduct")} className="btn-secondary-ys">Cancel</button>
                <button type="submit" className="btn-primary-ys" disabled={loading}>
                  <MdSave /> {loading ? "Saving..." : "Update Service"}
                </button>
              </div>
            </form>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Editproduct;