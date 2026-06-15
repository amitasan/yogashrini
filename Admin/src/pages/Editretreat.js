import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import Footer from "../inc/Footer";
import { MdSave, MdArrowBack } from "react-icons/md";
import { RiMapPin2Line } from "react-icons/ri";

const API = "http://localhost:2000";

function Editretreat() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [form, setForm] = useState({
    rname: "", rdate: "", rlocation: "", ractivities: "", rcost: "",
  });
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg,      setMsg]      = useState(null);

  useEffect(() => {
    if (!id) return;
    const fd = new FormData();
    fd.append("id", id);
    fetch(`${API}/retreat/edit`, { method: "POST", body: fd })
      .then(r => r.json())
      .then(data => {
        // Server returns rname, rdate, rlocation, ractivities, rcost
        setForm({
          rname:       data.rname       || "",
          rdate:       data.rdate       || "",
          rlocation:   data.rlocation   || "",
          ractivities: data.ractivities || "",
          rcost:       data.rcost       || "",
        });
        setFetching(false);
      })
      .catch(() => { setFetching(false); setMsg({ type: "danger", text: "Failed to load retreat" }); });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("id",          id);
    fd.append("rname",       form.rname);
    fd.append("rdate",       form.rdate);
    fd.append("rlocation",   form.rlocation);
    fd.append("ractivities", form.ractivities);
    fd.append("rcost",       form.rcost);

    try {
      const r = await fetch(`${API}/retreat/upd`, { method: "POST", body: fd });
      const data = await r.json();
      if (r.ok) {
        setMsg({ type: "success", text: "Retreat updated successfully!" });
        setTimeout(() => nav("/listretreat"), 1200);
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
        <Top title="Edit Retreat" />
        <div className="page-container">

          <div className="page-header">
            <div>
              <div className="page-title">Edit Retreat</div>
              <div className="page-subtitle">Update retreat information</div>
            </div>
            <button onClick={() => nav("/listretreat")} className="btn-secondary-ys">
              <MdArrowBack /> Back to Retreats
            </button>
          </div>

          {msg && <div className={`ys-alert ys-alert-${msg.type}`}>{msg.text}</div>}
          {fetching && <div style={{ color: "#9ca3af", padding: "20px 0" }}>Loading retreat data...</div>}

          {!fetching && (
            <div className="ys-card" style={{ maxWidth: 700 }}>
              <div className="ys-card-header">
                <div className="ys-card-title">
                  <RiMapPin2Line style={{ color: "#7C3AED" }} /> Retreat Details
                </div>
              </div>
              <div className="ys-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="ys-form-grid">
                    <div className="ys-form-group">
                      <label className="ys-label">Retreat Name</label>
                      <input
                        className="ys-input"
                        name="rname"
                        value={form.rname}
                        onChange={handleChange}
                        placeholder="e.g. Himalayan Yoga Retreat"
                        required
                      />
                    </div>
                    <div className="ys-form-group">
                      <label className="ys-label">Date</label>
                      <input
                        className="ys-input"
                        type="date"
                        name="rdate"
                        value={form.rdate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="ys-form-grid">
                    <div className="ys-form-group">
                      <label className="ys-label">Location</label>
                      <input
                        className="ys-input"
                        name="rlocation"
                        value={form.rlocation}
                        onChange={handleChange}
                        placeholder="e.g. Rishikesh, Uttarakhand"
                      />
                    </div>
                    <div className="ys-form-group">
                      <label className="ys-label">Cost (INR)</label>
                      <input
                        className="ys-input"
                        type="number"
                        name="rcost"
                        value={form.rcost}
                        onChange={handleChange}
                        placeholder="e.g. 15000"
                      />
                    </div>
                  </div>

                  <div className="ys-form-group">
                    <label className="ys-label">Activities</label>
                    <textarea
                      className="ys-input ys-textarea"
                      name="ractivities"
                      value={form.ractivities}
                      onChange={handleChange}
                      placeholder="Describe retreat activities..."
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="button" onClick={() => nav("/listretreat")} className="btn-secondary-ys">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-ys" disabled={loading}>
                      <MdSave /> {loading ? "Saving..." : "Update Retreat"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Editretreat;
