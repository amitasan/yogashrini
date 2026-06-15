import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdSave, MdArrowBack, MdSpa, MdCloudUpload } from "react-icons/md";
import { useRef } from "react";

const API = "http://localhost:2000";

function Addproduct() {
  const nav      = useNavigate();
  const imgRef   = useRef();

  const [form, setForm] = useState({ pname: "", pprice: "", pdetails: "" });
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [msg,        setMsg]        = useState(null);

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
    if (!form.pname.trim()) return setMsg({ type: "danger", text: "Service name is required" });

    setLoading(true);
    const fd = new FormData();
    fd.append("pname",    form.pname);
    fd.append("pprice",   form.pprice);
    fd.append("pdetails", form.pdetails);
    fd.append("pimg",     imgFile);

    try {
      const r    = await fetch(`${API}/product/add`, { method: "POST", body: fd });
      const data = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Service added successfully!" });
        setForm({ pname: "", pprice: "", pdetails: "" });
        setImgFile(null); setImgPreview(null);
      } else {
        setMsg({ type: "danger", text: data.msg || data.error || "Failed to add service" });
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
        <Top title="Add Service" />
        <div className="page-container">

          <div className="page-header">
            <div>
              <div className="page-title">Add New Service</div>
              <div className="page-subtitle">Create a new yoga service offering</div>
            </div>
            <button onClick={() => nav("/listproduct")} className="btn-secondary-ys">
              <MdArrowBack /> View All Services
            </button>
          </div>

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

              {/* Main form */}
              <div className="ys-card">
                <div className="ys-card-header">
                  <div className="ys-card-title"><MdSpa style={{ color: "#7C3AED" }} /> Service Information</div>
                </div>
                <div className="ys-card-body">
                  <div className="ys-form-group">
                    <label className="ys-label">Service Name *</label>
                    <input
                      className="ys-input"
                      name="pname"
                      value={form.pname}
                      onChange={handleChange}
                      placeholder="e.g. Morning Hatha Yoga Class"
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
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div className="ys-form-group">
                    <label className="ys-label">Description</label>
                    <textarea
                      className="ys-input ys-textarea"
                      name="pdetails"
                      value={form.pdetails}
                      onChange={handleChange}
                      placeholder="Describe this service..."
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="ys-card">
                <div className="ys-card-header">
                  <div className="ys-card-title"><MdCloudUpload style={{ color: "#7C3AED" }} /> Service Image</div>
                </div>
                <div className="ys-card-body">
                  <div
                    className="file-drop-zone"
                    onClick={() => imgRef.current.click()}
                  >
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} />
                    {imgPreview
                      ? <img src={imgPreview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }} />
                      : <>
                          <div className="file-drop-icon"><MdCloudUpload /></div>
                          <div className="file-drop-text">Click to upload image</div>
                          <div className="file-drop-hint">JPG, PNG recommended</div>
                        </>
                    }
                  </div>
                  {imgPreview && (
                    <button
                      type="button"
                      className="btn-secondary-ys btn-sm-ys"
                      style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                      onClick={() => { setImgFile(null); setImgPreview(null); }}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" onClick={() => nav("/listproduct")} className="btn-secondary-ys">Cancel</button>
              <button type="submit" className="btn-primary-ys" disabled={loading}>
                <MdSave /> {loading ? "Adding..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Addproduct;