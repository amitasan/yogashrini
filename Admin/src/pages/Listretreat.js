import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdCalendarToday } from "react-icons/md";
import { RiMapPin2Line, RiCoinsLine } from "react-icons/ri";

const API = "http://localhost:2000";

function Listretreat() {
  const [retreats, setRetreats] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState(null);

  const getdata = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/retreat/sel`);
      const data = await resp.json();
      setRetreats(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ type: "danger", text: "Failed to load retreats" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getdata(); }, [getdata]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this retreat?")) return;
    const fd = new FormData();
    fd.append("id", id);
    try {
      await fetch(`${API}/retreat/del`, { method: "POST", body: fd });
      setMsg({ type: "success", text: "Retreat deleted" });
      getdata();
      setTimeout(() => setMsg(null), 2500);
    } catch {
      setMsg({ type: "danger", text: "Delete failed" });
    }
  };

  const filtered = retreats.filter(r =>
    (r.rname || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.rlocation || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Retreats" />
        <div className="page-container">

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <div className="page-header">
            <div>
              <div className="page-title">All Retreats</div>
              <div className="page-subtitle">{retreats.length} retreat{retreats.length !== 1 ? "s" : ""} scheduled</div>
            </div>
            <Link to="/addretreat" className="btn-primary-ys">
              <MdAdd /> Add Retreat
            </Link>
          </div>

          <div className="ys-card">
            <div className="ys-card-header">
              <div className="ys-card-title">
                <RiMapPin2Line style={{ color: "#7C3AED" }} /> Retreat Schedule
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f5fa", borderRadius: 8, padding: "8px 14px", border: "1px solid #e5e7eb" }}>
                <MdSearch style={{ color: "#9ca3af" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search retreats..."
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 160 }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading retreats...</div>
              ) : (
                <table className="ys-table">
                  <thead>
                    <tr>
                      <th>Retreat Name</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Activities</th>
                      <th>Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                          No retreats found. <Link to="/addretreat" style={{ color: "#7C3AED" }}>Add one</Link>
                        </td>
                      </tr>
                    )}
                    {filtered.map(r => (
                      <tr key={r._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "#1e1e2e" }}>{r.rname}</div>
                        </td>
                        <td>
                          {r.rdate
                            ? <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <MdCalendarToday style={{ color: "#7C3AED", fontSize: 14 }} />
                                {r.rdate}
                              </div>
                            : <span style={{ color: "#9ca3af" }}>—</span>
                          }
                        </td>
                        <td>
                          {r.rlocation
                            ? <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <RiMapPin2Line style={{ color: "#10b981", fontSize: 14 }} />
                                {r.rlocation}
                              </div>
                            : <span style={{ color: "#9ca3af" }}>—</span>
                          }
                        </td>
                        <td style={{ maxWidth: 220, color: "#6b7280", fontSize: 13 }}>
                          {r.ractivities
                            ? r.ractivities.length > 70 ? r.ractivities.slice(0, 70) + "…" : r.ractivities
                            : "—"
                          }
                        </td>
                        <td>
                          {r.rcost
                            ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <RiCoinsLine style={{ color: "#f59e0b" }} />
                                <span style={{ fontWeight: 700, color: "#10b981" }}>₹{r.rcost}</span>
                              </div>
                            : <span style={{ color: "#9ca3af" }}>—</span>
                          }
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Link to={`/editretreat/${r._id}`} className="btn-edit-ys">
                              <MdEdit /> Edit
                            </Link>
                            <button onClick={() => handleDelete(r._id)} className="btn-danger-ys">
                              <MdDelete /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Listretreat;
