import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdCloudUpload, MdSchool, MdSave, MdArrowBack } from "react-icons/md";

const API = "http://localhost:2000";

function EditCourse() {
  const { id } = useParams();
  const nav    = useNavigate();
  const thumbRef = useRef();

  const [form, setForm] = useState(null);
  const [thumbFile, setThumbFile]     = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState(null);

  useEffect(() => {
    fetch(`${API}/course/${id}`)
      .then(r => r.json())
      .then(d => {
        const c = d.course;
        setForm({
          title:       c.title || "",
          description: c.description || "",
          price:       c.price ?? "",
          totalWeeks:  c.totalWeeks ?? "",
          level:       c.level || "Beginner",
          instructor:  c.instructor || "",
          isPublished: c.isPublished || false,
        });
        if (c.thumbnail) setThumbPreview(`${API}/thumbnails/${c.thumbnail}`);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleThumb = e => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (thumbFile) fd.append("thumbnail", thumbFile);

    try {
      const r = await fetch(`${API}/course/${id}`, { method: "PUT", body: fd });
      const data = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Course updated!" });
        setTimeout(() => nav("/courses"), 1500);
      } else {
        setMsg({ type: "danger", text: data.error || "Failed to update" });
      }
    } catch {
      setMsg({ type: "danger", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  if (!form) return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Edit Course" />
        <div className="page-container">
          <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>Loading...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Edit Course" />
        <div className="page-container">

          <div className="page-header">
            <div>
              <div className="page-title">Edit Course</div>
              <div className="page-subtitle">Update course details</div>
            </div>
            <button onClick={() => nav("/courses")} className="btn-secondary-ys">
              <MdArrowBack /> Back
            </button>
          </div>

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              <div>
                <div className="ys-card">
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdSchool /> Course Details</div>
                  </div>
                  <div className="ys-card-body">
                    <div className="ys-form-group">
                      <label className="ys-label">Title</label>
                      <input className="ys-input" name="title" value={form.title} onChange={handleChange} />
                    </div>
                    <div className="ys-form-group">
                      <label className="ys-label">Description</label>
                      <textarea className="ys-input ys-textarea" name="description" value={form.description} onChange={handleChange} />
                    </div>
                    <div className="ys-form-grid">
                      <div className="ys-form-group">
                        <label className="ys-label">Instructor</label>
                        <input className="ys-input" name="instructor" value={form.instructor} onChange={handleChange} />
                      </div>
                      <div className="ys-form-group">
                        <label className="ys-label">Level</label>
                        <select className="ys-input ys-select" name="level" value={form.level} onChange={handleChange}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="ys-form-grid">
                      <div className="ys-form-group">
                        <label className="ys-label">Price (INR)</label>
                        <input className="ys-input" name="price" type="number" min="0" value={form.price} onChange={handleChange} />
                      </div>
                      <div className="ys-form-group">
                        <label className="ys-label">Total Weeks</label>
                        <input className="ys-input" name="totalWeeks" type="number" min="1" value={form.totalWeeks} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="ys-form-group">
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} style={{ width: 16, height: 16, accentColor: "#7C3AED" }} />
                        <span className="ys-label" style={{ margin: 0 }}>Published</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="ys-card">
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdCloudUpload /> Thumbnail</div>
                  </div>
                  <div className="ys-card-body">
                    <div className="file-drop-zone" onClick={() => thumbRef.current.click()}>
                      <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumb} />
                      {thumbPreview
                        ? <img src={thumbPreview} alt="preview" style={{ width:"100%", borderRadius:8, maxHeight:180, objectFit:"cover" }} />
                        : <>
                            <div className="file-drop-icon"><MdCloudUpload /></div>
                            <div className="file-drop-text">Click to change thumbnail</div>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" onClick={() => nav("/courses")} className="btn-secondary-ys">Cancel</button>
              <button type="submit" className="btn-primary-ys" disabled={loading}>
                <MdSave /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default EditCourse;
