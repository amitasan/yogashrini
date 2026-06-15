import { useState, useEffect } from "react";
import { MdNotifications, MdSearch } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

function Top({ title = "Dashboard" }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("uname");
    if (u) setUsername(u);
  }, []);

  const initials = username
    ? username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <header className="ys-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="page-title">{title}</div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f4f5fa", borderRadius: 8, padding: "8px 14px",
          border: "1px solid #e5e7eb"
        }}>
          <MdSearch style={{ color: "#9ca3af", fontSize: 16 }} />
          <input
            placeholder="Search..."
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 13, color: "#374151", width: 140
            }}
          />
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn">
          <MdNotifications />
          <span className="topbar-badge">3</span>
        </button>

        {/* User */}
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div>
            <div className="topbar-username">{username || "Admin"}</div>
            <div className="topbar-role">
              <RiAdminLine style={{ fontSize: 10 }} /> Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Top;