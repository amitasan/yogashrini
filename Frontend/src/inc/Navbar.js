import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import YogashriniLogo from "../pages/Yogashrini.jpg";
import "./Navbar.css";
import { MdDarkMode, MdLightMode, MdLogout, MdPerson } from "react-icons/md";
import { useAuth } from "../AuthContext";

function Navbar() {
  const [theme, setTheme] = useState("light");
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`yoga-navbar ${theme}`}>
      <div className="container d-flex align-items-center justify-content-between">

        {/* Logo & Branding */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={YogashriniLogo}
            alt="Yogashrini Logo"
            className="brand-logo"
          />
          <span className="brand-title">Yogashrini</span>
        </NavLink>

        <ul className="nav-links">
          <li><NavLink className="nav-item-link" to="/">Home</NavLink></li>
          <li><NavLink className="nav-item-link" to="/about">About Us</NavLink></li>
          <li><NavLink className="nav-item-link" to="/classes">Classes</NavLink></li>
          <li>
            <NavLink
              className="nav-item-link"
              to="/courses"
              style={({ isActive }) => isActive ? { color: "#7C3AED", fontWeight: 700 } : {}}
            >
              Courses
            </NavLink>
          </li>
          <li><NavLink className="nav-item-link" to="/retreat">Retreat</NavLink></li>
          <li><NavLink className="nav-item-link" to="/training">Training</NavLink></li>
          <li><NavLink className="nav-item-link" to="/contact">Contact Us</NavLink></li>
          <li><NavLink className="nav-item-link" to="/posture">Posture</NavLink></li>
          <li><NavLink className="nav-item-link" to="/types">Types</NavLink></li>
          {!isLoggedIn && (
            <li><NavLink className="nav-item-link" to="/login">Login</NavLink></li>
          )}
        </ul>

        {/* Right side: user info + controls */}
        <div className="navbar-right">
          {isLoggedIn && user && (
            <div className="navbar-user">
              <MdPerson size={18} />
              <span className="navbar-username">{user.name}</span>
              <button
                className="navbar-logout-btn"
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
              >
                <MdLogout size={18} />
              </button>
            </div>
          )}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <MdDarkMode size={22} /> : <MdLightMode size={22} />}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
