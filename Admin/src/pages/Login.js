import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdLogin } from "react-icons/md";
import YogashriniLogo from "../inc/Yogashrini.jpg";

const API = "http://localhost:2000";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const r = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();

      // Success: response has a name field (the admin's name)
      if (data.name) {
        localStorage.setItem("uname", data.name);
        nav("/");
      } else {
        // Either HTTP error status or legacy {msg:"invalid login"}
        setErr(data.msg || data.error || "Invalid credentials");
      }
    } catch {
      setErr("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src={YogashriniLogo}
            alt="Yogashrini"
            style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", marginBottom: 12 }}
          />
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1e1e2e" }}>Yogashrini</div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>Admin Dashboard</div>
        </div>

        {err && (
          <div className="ys-alert ys-alert-danger" style={{ marginBottom: 20 }}>{err}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="ys-form-group">
            <label className="ys-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <MdEmail style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#9ca3af", fontSize: 16
              }} />
              <input
                id="admin-email"
                className="ys-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yogashrini.com"
                style={{ paddingLeft: 38 }}
                required
              />
            </div>
          </div>

          <div className="ys-form-group">
            <label className="ys-label">Password</label>
            <div style={{ position: "relative" }}>
              <MdLock style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#9ca3af", fontSize: 16
              }} />
              <input
                id="admin-password"
                className="ys-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: 38 }}
                required
              />
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="btn-primary-ys"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={loading}
          >
            <MdLogin /> {loading ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#9ca3af" }}>
          Yogashrini Learning Platform © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default Login;