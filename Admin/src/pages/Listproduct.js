import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdAdd, MdEdit, MdDelete, MdSpa, MdSearch } from "react-icons/md";

const API = "http://localhost:2000";

function Listproduct() {
  const [products, setProducts] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState(null);

  const getdata = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/product/sel`);
      const data = await resp.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ type: "danger", text: "Failed to load services" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { getdata(); }, [getdata]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    const fd = new FormData();
    fd.append("id", id);
    try {
      await fetch(`${API}/product/del`, { method: "POST", body: fd });
      setMsg({ type: "success", text: "Service deleted" });
      getdata();
      setTimeout(() => setMsg(null), 2500);
    } catch {
      setMsg({ type: "danger", text: "Delete failed" });
    }
  };

  const filtered = products.filter(p =>
    (p.pname || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Services" />
        <div className="page-container">

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}

          <div className="page-header">
            <div>
              <div className="page-title">All Services</div>
              <div className="page-subtitle">{products.length} service{products.length !== 1 ? "s" : ""} total</div>
            </div>
            <Link to="/addproduct" className="btn-primary-ys">
              <MdAdd /> Add Service
            </Link>
          </div>

          <div className="ys-card">
            <div className="ys-card-header">
              <div className="ys-card-title"><MdSpa style={{ color: "#7C3AED" }} /> Service Catalog</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f5fa", borderRadius: 8, padding: "8px 14px", border: "1px solid #e5e7eb" }}>
                <MdSearch style={{ color: "#9ca3af" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search services..."
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 160 }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading services...</div>
              ) : (
                <table className="ys-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Service Name</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                          No services found. <Link to="/addproduct" style={{ color: "#7C3AED" }}>Add one</Link>
                        </td>
                      </tr>
                    )}
                    {filtered.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.pimg
                            ? <img
                                src={`${API}/product_img/${p.pimg}`}
                                alt={p.pname}
                                className="thumb-preview"
                                onError={e => { e.target.style.display = "none"; }}
                              />
                            : <div className="thumb-preview" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20 }}>
                                <MdSpa />
                              </div>
                          }
                        </td>
                        <td style={{ fontWeight: 600 }}>{p.pname}</td>
                        <td>
                          {p.pprice
                            ? <span style={{ color: "#10b981", fontWeight: 700 }}>₹{p.pprice}</span>
                            : <span style={{ color: "#9ca3af" }}>—</span>
                          }
                        </td>
                        <td style={{ maxWidth: 250, color: "#6b7280" }}>
                          {p.pdetails
                            ? p.pdetails.length > 80 ? p.pdetails.slice(0, 80) + "…" : p.pdetails
                            : "—"
                          }
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Link to={`/editproduct/${p._id}`} className="btn-edit-ys">
                              <MdEdit /> Edit
                            </Link>
                            <button onClick={() => handleDelete(p._id)} className="btn-danger-ys">
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

export default Listproduct;