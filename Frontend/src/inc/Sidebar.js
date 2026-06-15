// Sidebar.js
import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-button" onClick={toggleSidebar}>
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      {!isCollapsed && (
        <>
          <h2 className="sidebar-title">Yogashrini</h2>
          <ul className="sidebar-nav">
           <ul className="sidebar-nav">
            <ul className="sidebar-nav">
                <li><Link to="/">🏠 Home</Link></li>
                <li><Link to="/about">🧘‍♀️ About</Link></li>
                <li><Link to="/classes">📅 Classes</Link></li>
                <li><Link to="/retreat">🛫 Retreats</Link></li>
                <li><Link to="/training">📚 Training</Link></li>
                <li><Link to="/contact">📞 Contact</Link></li>
            </ul>

            </ul>
          </ul>
        </>
      )}
    </div>
  );
}

export default Sidebar;
