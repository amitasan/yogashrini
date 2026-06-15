import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import {
  MdAdd, MdDelete, MdVideoLibrary, MdCloudUpload,
  MdArrowBack, MdSave, MdEdit, MdPlayCircle, MdStar
} from "react-icons/md";
import { RiAwardLine, RiCoinsLine } from "react-icons/ri";

const API = "http://localhost:2000";

/* ── Small sub-component: Add/Edit Week Form ──────────────────────── */
function WeekForm({ courseId, onSaved, editData = null, onCancel }) {
  const videoInputRef = useRef();
  const [form, setForm] = useState({
    weekNumber: editData?.weekNumber || "",
    title:      editData?.title      || "",
    description:editData?.description|| "",
    bonusXP:    editData?.bonusXP    || 50,
    bonusPoints:editData?.bonusPoints|| 10,
    isBonus:    editData?.isBonus    || false,
  });
  const [videoFiles, setVideoFiles]   = useState([]);        // File[]
  const [videoMetas, setVideoMetas]   = useState([]);        // [{title, description}]
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleVideoFiles = e => {
    const files = Array.from(e.target.files);
    setVideoFiles(prev => [...prev, ...files]);
    setVideoMetas(prev => [
      ...prev,
      ...files.map(f => ({ title: f.name.replace(/\.[^.]+$/, ""), description: "" }))
    ]);
  };

  const removeVideo = idx => {
    setVideoFiles(f => f.filter((_, i) => i !== idx));
    setVideoMetas(m => m.filter((_, i) => i !== idx));
  };

  const updateMeta = (idx, field, val) => {
    setVideoMetas(m => m.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const handleSubmit = async () => {
    if (!form.weekNumber) return setErr("Week number is required");
    if (!form.title.trim()) return setErr("Week title is required");
    if (!editData && videoFiles.length === 0) return setErr("Please upload at least one video");
    setLoading(true); setErr("");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    videoFiles.forEach((file, idx) => {
      fd.append(`video${idx}`, file);
      fd.append(`videoMeta_${idx}`, JSON.stringify(videoMetas[idx]));
    });

    try {
      const url = editData
        ? `${API}/course/${courseId}/week/${editData._id}`
        : `${API}/course/${courseId}/week`;
      const method = editData ? "PUT" : "POST";
      const r = await fetch(url, { method, body: fd });
      const data = await r.json();
      if (r.ok) {
        onSaved();
      } else {
        setErr(data.error || "Failed to save week");
      }
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ys-card" style={{ marginBottom: 20 }}>
      <div className="ys-card-header">
        <div className="ys-card-title">
          {editData ? <><MdEdit /> Edit Week</> : <><MdAdd /> Add New Week</>}
        </div>
        {onCancel && (
          <button onClick={onCancel} className="btn-secondary-ys btn-sm-ys">Cancel</button>
        )}
      </div>
      <div className="ys-card-body">
        {err && <div className="ys-alert ys-alert-danger">{err}</div>}

        <div className="ys-form-grid-3">
          <div className="ys-form-group">
            <label className="ys-label">Week Number *</label>
            <input
              className="ys-input"
              name="weekNumber"
              type="number"
              min="1"
              value={form.weekNumber}
              onChange={handleChange}
              placeholder="1"
            />
          </div>
          <div className="ys-form-group">
            <label className="ys-label">
              <RiAwardLine style={{ marginRight: 4 }} />
              Bonus XP on Completion
            </label>
            <input
              className="ys-input"
              name="bonusXP"
              type="number"
              min="0"
              value={form.bonusXP}
              onChange={handleChange}
            />
          </div>
          <div className="ys-form-group">
            <label className="ys-label">
              <RiCoinsLine style={{ marginRight: 4 }} />
              Bonus Points
            </label>
            <input
              className="ys-input"
              name="bonusPoints"
              type="number"
              min="0"
              value={form.bonusPoints}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="ys-form-group">
          <label className="ys-label">Week Title *</label>
          <input
            className="ys-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={`e.g. Week ${form.weekNumber || "1"} – Foundations of Yoga`}
          />
        </div>

        <div className="ys-form-group">
          <label className="ys-label">Week Description</label>
          <textarea
            className="ys-input ys-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What will students learn this week?"
            style={{ minHeight: 80 }}
          />
        </div>

        <div className="ys-form-group">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              name="isBonus"
              checked={form.isBonus}
              onChange={handleChange}
              style={{ width: 16, height: 16, accentColor: "#f59e0b" }}
            />
            <span className="ys-label" style={{ margin: 0 }}>
              <MdStar style={{ color: "#f59e0b" }} /> Mark as Bonus Week
              <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>
                (unlocked after all regular weeks are completed)
              </span>
            </span>
          </label>
        </div>

        {/* Video Uploads */}
        {!editData && (
          <>
            <div className="ys-label" style={{ marginBottom: 8 }}>
              <MdVideoLibrary style={{ marginRight: 4, color: "#7C3AED" }} />
              Upload Videos for This Week
            </div>

            <div
              className="file-drop-zone"
              onClick={() => videoInputRef.current.click()}
              style={{ marginBottom: 16 }}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoFiles}
              />
              <div className="file-drop-icon"><MdCloudUpload /></div>
              <div className="file-drop-text">Click to upload videos (MP4, MOV, etc.)</div>
              <div className="file-drop-hint">You can select multiple videos at once</div>
            </div>

            {videoFiles.map((file, idx) => (
              <div key={idx} style={{
                border: "1px solid #e5e7eb", borderRadius: 10, padding: 14,
                marginBottom: 10, background: "#fafbff"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div className="video-item-icon"><MdPlayCircle /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                  <button onClick={() => removeVideo(idx)} className="btn-danger-ys">
                    <MdDelete />
                  </button>
                </div>
                <div className="ys-form-grid">
                  <div className="ys-form-group" style={{ marginBottom: 0 }}>
                    <label className="ys-label" style={{ fontSize: 12 }}>Video Title</label>
                    <input
                      className="ys-input"
                      value={videoMetas[idx]?.title || ""}
                      onChange={e => updateMeta(idx, "title", e.target.value)}
                      placeholder="e.g. Introduction to Surya Namaskar"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <div className="ys-form-group" style={{ marginBottom: 0 }}>
                    <label className="ys-label" style={{ fontSize: 12 }}>Description</label>
                    <input
                      className="ys-input"
                      value={videoMetas[idx]?.description || ""}
                      onChange={e => updateMeta(idx, "description", e.target.value)}
                      placeholder="Brief description"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={handleSubmit} className="btn-primary-ys" disabled={loading}>
            <MdSave /> {loading ? "Saving..." : editData ? "Update Week" : "Save Week"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ManageCourse page ───────────────────────────────────────── */
function ManageCourse() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [course,   setCourse]   = useState(null);
  const [weeks,    setWeeks]    = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editWeek, setEditWeek] = useState(null);
  const [msg,      setMsg]      = useState(null);

  const loadData = async () => {
    const [cr, wr] = await Promise.all([
      fetch(`${API}/course/${id}`),
      fetch(`${API}/course/${id}/weeks`),
    ]);
    const cd = await cr.json();
    const wd = await wr.json();
    setCourse(cd.course);
    setWeeks(wd.weeks || []);
  };

  useEffect(() => { loadData(); }, [id]);

  const deleteWeek = async (weekId) => {
    if (!window.confirm("Delete this week?")) return;
    const r = await fetch(`${API}/course/${id}/week/${weekId}`, { method: "DELETE" });
    if (r.ok) {
      setMsg({ type: "success", text: "Week deleted" });
      loadData();
      setTimeout(() => setMsg(null), 2500);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditWeek(null);
    setMsg({ type: "success", text: "Week saved successfully!" });
    loadData();
    setTimeout(() => setMsg(null), 2500);
  };

  const regularWeeks = weeks.filter(w => !w.isBonus).sort((a, b) => a.weekNumber - b.weekNumber);
  const bonusWeeks   = weeks.filter(w => w.isBonus);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title={course ? `Manage: ${course.title}` : "Manage Course"} />
        <div className="page-container">

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <div className="page-header">
            <div>
              <div className="page-title">{course?.title}</div>
              <div className="page-subtitle">
                {weeks.length} week{weeks.length !== 1 ? "s" : ""} — {weeks.reduce((s, w) => s + w.videos.length, 0)} videos total
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => nav("/courses")} className="btn-secondary-ys">
                <MdArrowBack /> All Courses
              </button>
              <button onClick={() => { setShowForm(true); setEditWeek(null); }} className="btn-primary-ys">
                <MdAdd /> Add Week
              </button>
            </div>
          </div>

          {/* Progress overview */}
          {course && (
            <div className="ys-card" style={{ marginBottom: 20 }}>
              <div className="ys-card-body" style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    Course Progress: {regularWeeks.length} / {course.totalWeeks} weeks added
                  </div>
                  <div style={{ fontSize: 13, color: "#9ca3af" }}>
                    {Math.round((regularWeeks.length / (course.totalWeeks || 1)) * 100)}%
                  </div>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (regularWeeks.length / (course.totalWeeks || 1)) * 100)}%` }}
                  />
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    Price: {course.price === 0 ? "Free" : `₹${course.price}`}
                  </span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Level: {course.level}</span>
                  <span className={`badge-ys ${course.isPublished ? "badge-success" : "badge-gray"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && !editWeek && (
            <WeekForm
              courseId={id}
              onSaved={handleSaved}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editWeek && (
            <WeekForm
              courseId={id}
              editData={editWeek}
              onSaved={handleSaved}
              onCancel={() => setEditWeek(null)}
            />
          )}

          {/* Regular Weeks */}
          {regularWeeks.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#374151" }}>
                <MdVideoLibrary style={{ color: "#7C3AED", marginRight: 6 }} />
                Course Weeks ({regularWeeks.length})
              </div>
              {regularWeeks.map(week => (
                <div key={week._id} className="week-card">
                  <div className="week-card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="week-number-badge">Week {week.weekNumber}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{week.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="xp-chip"><RiAwardLine /> {week.bonusXP} XP</span>
                      <span className="points-chip"><RiCoinsLine /> {week.bonusPoints} pts</span>
                      <button
                        onClick={() => { setEditWeek(week); setShowForm(false); }}
                        className="btn-edit-ys"
                      >
                        <MdEdit />
                      </button>
                      <button onClick={() => deleteWeek(week._id)} className="btn-danger-ys">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                  <div className="week-card-body">
                    {week.description && (
                      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{week.description}</p>
                    )}
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                      <MdPlayCircle style={{ marginRight: 4 }} />
                      {week.videos.length} video{week.videos.length !== 1 ? "s" : ""}
                    </div>
                    {week.videos.map((v, idx) => (
                      <div key={idx} className="video-item">
                        <div className="video-item-icon"><MdPlayCircle /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{v.title}</div>
                          {v.description && (
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{v.description}</div>
                          )}
                        </div>
                        <a
                          href={`${API}/videos/${v.filename}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-edit-ys btn-sm-ys"
                        >
                          Preview
                        </a>
                      </div>
                    ))}
                    {week.videos.length === 0 && (
                      <div style={{ color: "#f59e0b", fontSize: 12, padding: "8px 0" }}>
                        No videos yet — delete and re-add this week with videos.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bonus Weeks */}
          {bonusWeeks.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#374151" }}>
                <MdStar style={{ color: "#f59e0b", marginRight: 6 }} />
                Bonus Weeks ({bonusWeeks.length})
              </div>
              {bonusWeeks.map(week => (
                <div key={week._id} className="week-card">
                  <div className="week-card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="bonus-week-badge"><MdStar /> BONUS</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{week.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="xp-chip"><RiAwardLine /> {week.bonusXP} XP</span>
                      <span className="points-chip"><RiCoinsLine /> {week.bonusPoints} pts</span>
                      <button
                        onClick={() => { setEditWeek(week); setShowForm(false); }}
                        className="btn-edit-ys"
                      >
                        <MdEdit />
                      </button>
                      <button onClick={() => deleteWeek(week._id)} className="btn-danger-ys">
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                  <div className="week-card-body">
                    {week.videos.map((v, idx) => (
                      <div key={idx} className="video-item">
                        <div className="video-item-icon" style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)" }}>
                          <MdPlayCircle />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{v.title}</div>
                        </div>
                        <a
                          href={`${API}/videos/${v.filename}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-edit-ys btn-sm-ys"
                        >
                          Preview
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {weeks.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}><MdVideoLibrary /></div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No weeks yet</div>
              <div style={{ fontSize: 13, marginBottom: 20 }}>Start by adding your first week with videos</div>
              <button onClick={() => setShowForm(true)} className="btn-primary-ys">
                <MdAdd /> Add First Week
              </button>
            </div>
          )}

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ManageCourse;
