import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdCloudUpload, MdSchool, MdSave, MdArrowBack } from "react-icons/md";

const API = "http://localhost:2000";

function AddCourse() {
  const nav = useNavigate();
  const thumbRef = useRef();

  const [form, setForm] = useState({
    title: "", description: "", price: "", totalWeeks: "",
    level: "Beginner", instructor: "Yogashrini Team", isPublished: false,
  });
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

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
    if (!form.title.trim())      return setMsg({ type: "danger", text: "Title is required" });
    if (!form.totalWeeks)        return setMsg({ type: "danger", text: "Total weeks is required" });
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (thumbFile) fd.append("thumbnail", thumbFile);

    try {
      const r = await fetch(`${API}/course`, { method: "POST", body: fd });
      const data = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Course created! Now add weeks." });
        setTimeout(() => nav(`/managecourse/${data.course._id}`), 1500);
      } else {
        setMsg({ type: "danger", text: data.error || "Failed to create course" });
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
        <Top title="Add Course" />
        <div className="page-container">

          <div className="page-header">
            <div>
              <div className="page-title">Create New Course</div>
              <div className="page-subtitle">Set up your course details and then add weekly content</div>
            </div>
            <button onClick={() => nav("/courses")} className="btn-secondary-ys">
              <MdArrowBack /> Back to Courses
            </button>
          </div>

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

              {/* Left – Main details */}
              <div>
                <div className="ys-card" style={{ marginBottom: 20 }}>
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdSchool /> Course Information</div>
                  </div>
                  <div className="ys-card-body">
                    <div className="ys-form-group">
                      <label className="ys-label">Course Title *</label>
                      <input
                        className="ys-input"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Complete Yoga for Beginners"
                      />
                    </div>

                    <div className="ys-form-group">
                      <label className="ys-label">Description *</label>
                      <textarea
                        className="ys-input ys-textarea"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe what students will learn..."
                      />
                    </div>

                    <div className="ys-form-grid">
                      <div className="ys-form-group">
                        <label className="ys-label">Instructor Name</label>
                        <input
                          className="ys-input"
                          name="instructor"
                          value={form.instructor}
                          onChange={handleChange}
                        />
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
                        <label className="ys-label">Price (INR) — 0 for Free</label>
                        <input
                          className="ys-input"
                          name="price"
                          type="number"
                          min="0"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="e.g. 999"
                        />
                      </div>
                      <div className="ys-form-group">
                        <label className="ys-label">Total Weeks *</label>
                        <input
                          className="ys-input"
                          name="totalWeeks"
                          type="number"
                          min="1"
                          value={form.totalWeeks}
                          onChange={handleChange}
                          placeholder="e.g. 8"
                        />
                      </div>
                    </div>

                    <div className="ys-form-group">
                      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          name="isPublished"
                          checked={form.isPublished}
                          onChange={handleChange}
                          style={{ width: 16, height: 16, accentColor: "#7C3AED" }}
                        />
                        <span className="ys-label" style={{ margin: 0 }}>Publish immediately (visible to users)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right – Thumbnail */}
              <div>
                <div className="ys-card">
                  <div className="ys-card-header">
                    <div className="ys-card-title"><MdCloudUpload /> Course Thumbnail</div>
                  </div>
                  <div className="ys-card-body">
                    <div
                      className="file-drop-zone"
                      onClick={() => thumbRef.current.click()}
                    >
                      <input
                        ref={thumbRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumb}
                      />
                      {thumbPreview
                        ? <img src={thumbPreview} alt="preview" style={{ width:"100%", borderRadius:8, maxHeight:180, objectFit:"cover" }} />
                        : <>
                            <div className="file-drop-icon"><MdCloudUpload /></div>
                            <div className="file-drop-text">Click to upload thumbnail</div>
                            <div className="file-drop-hint">JPG, PNG (recommended 16:9)</div>
                          </>
                      }
                    </div>
                    {thumbPreview && (
                      <button
                        type="button"
                        className="btn-secondary-ys btn-sm-ys"
                        style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
                        onClick={() => { setThumbFile(null); setThumbPreview(null); }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" onClick={() => nav("/courses")} className="btn-secondary-ys">
                Cancel
              </button>
              <button type="submit" className="btn-primary-ys" disabled={loading}>
                <MdSave /> {loading ? "Creating..." : "Create Course & Add Weeks"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AddCourse;
