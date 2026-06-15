import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import {
  MdAdd, MdEdit, MdDelete, MdVideoLibrary,
  MdSchool, MdPublish, MdUnpublished, MdSearch
} from "react-icons/md";
import { RiCoinsLine } from "react-icons/ri";

const API = "http://localhost:2000";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch]   = useState("");
  const [msg, setMsg]         = useState(null);

  const loadCourses = () => {
    fetch(`${API}/course?all=true`)
      .then(r => r.json())
      .then(d => setCourses(d.courses || []))
      .catch(() => setMsg({ type: "danger", text: "Failed to load courses" }));
  };

  useEffect(() => { loadCourses(); }, []);

  const togglePublish = async (course) => {
    const fd = new FormData();
    fd.append("isPublished", String(!course.isPublished));
    const r = await fetch(`${API}/course/${course._id}`, { method: "PUT", body: fd });
    if (r.ok) {
      setMsg({ type: "success", text: `Course ${!course.isPublished ? "published" : "unpublished"} successfully` });
      loadCourses();
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course and all its weeks?")) return;
    const r = await fetch(`${API}/course/${id}`, { method: "DELETE" });
    if (r.ok) {
      setMsg({ type: "success", text: "Course deleted" });
      loadCourses();
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const levelColor = { Beginner: "badge-success", Intermediate: "badge-warning", Advanced: "badge-danger" };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="All Courses" />
        <div className="page-container">

          {msg && (
            <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>
          )}

          <div className="page-header">
            <div>
              <div className="page-title">Courses</div>
              <div className="page-subtitle">{courses.length} total course{courses.length !== 1 ? "s" : ""}</div>
            </div>
            <Link to="/addcourse" className="btn-primary-ys">
              <MdAdd /> Add Course
            </Link>
          </div>

          <div className="ys-card">
            <div className="ys-card-header">
              <div className="ys-card-title"><MdSchool /> Course Catalog</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f5fa", borderRadius: 8, padding: "8px 14px", border: "1px solid #e5e7eb" }}>
                <MdSearch style={{ color: "#9ca3af" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 160 }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="ys-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Weeks</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                        No courses found. <Link to="/addcourse" style={{ color: "#7C3AED" }}>Create one</Link>
                      </td>
                    </tr>
                  )}
                  {filtered.map(c => (
                    <tr key={c._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {c.thumbnail
                            ? <img
                                src={`${API}/thumbnails/${c.thumbnail}`}
                                alt={c.title}
                                className="thumb-preview"
                              />
                            : <div className="thumb-preview" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex",alignItems:"center",justifyContent:"center", color:"white", fontSize:20 }}>
                                <MdSchool />
                              </div>
                          }
                          <div>
                            <div style={{ fontWeight: 600 }}>{c.title}</div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>{c.instructor}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-ys ${levelColor[c.level] || "badge-gray"}`}>
                          {c.level}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MdVideoLibrary style={{ color: "#7C3AED" }} />
                          {c.totalWeeks} weeks
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <RiCoinsLine style={{ color: "#f59e0b" }} />
                          {c.price === 0 ? <span className="badge-ys badge-success">Free</span> : `₹${c.price}`}
                        </div>
                      </td>
                      <td>
                        {c.isPublished
                          ? <span className="badge-ys badge-success"><MdPublish /> Published</span>
                          : <span className="badge-ys badge-gray"><MdUnpublished /> Draft</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Link to={`/managecourse/${c._id}`} className="btn-edit-ys">
                            <MdVideoLibrary /> Weeks
                          </Link>
                          <Link to={`/editcourse/${c._id}`} className="btn-edit-ys">
                            <MdEdit />
                          </Link>
                          <button
                            onClick={() => togglePublish(c)}
                            className="btn-secondary-ys btn-sm-ys"
                            title={c.isPublished ? "Unpublish" : "Publish"}
                          >
                            {c.isPublished ? <MdUnpublished /> : <MdPublish />}
                          </button>
                          <button
                            onClick={() => deleteCourse(c._id)}
                            className="btn-danger-ys"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CourseList;
