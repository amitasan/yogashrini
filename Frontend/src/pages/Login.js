import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../inc/Navbar";
import Footer from "../inc/Footer";
import { useAuth } from "../AuthContext";
import { GiLotus } from "react-icons/gi";
import {
  MdEmail, MdLock, MdPerson, MdLogin, MdPersonAdd,
  MdVisibility, MdVisibilityOff, MdCheckCircle, MdError
} from "react-icons/md";
import "./Login.css";

const API = "http://localhost:2000";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [mode, setMode]         = useState("login");   // "login" | "register"
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [toast, setToast]       = useState(null);       // { type: "ok"|"err", msg }

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  // ── helpers ────────────────────────────────────────────────────────────────
  const field = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function validate() {
    const e = {};
    if (mode === "register" && !form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim())            e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)                e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Min 6 characters.";
    if (mode === "register" && form.password !== form.confirm)
      e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const endpoint = mode === "login" ? "/user/login" : "/user/register";
    const body     = mode === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res  = await fetch(`${API}${endpoint}`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast("err", data.msg || "Something went wrong.");
        return;
      }

      // Success
      login(data.token, data.user);
      showToast("ok", data.msg || (mode === "login" ? "Welcome back!" : "Account created!"));
      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      showToast("err", "Cannot connect to server. Make sure the backend is running on port 2000.");
    } finally {
      setLoading(false);
    }
  }

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setErrors({});
    setForm({ name: "", email: "", password: "", confirm: "" });
    setToast(null);
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main className="login-page">
        {/* Toast notification */}
        {toast && (
          <div className={`login-toast ${toast.type === "ok" ? "toast-ok" : "toast-err"}`}>
            {toast.type === "ok"
              ? <MdCheckCircle size={18} />
              : <MdError size={18} />
            }
            <span>{toast.msg}</span>
          </div>
        )}

        <div className="login-card">
          {/* Card header */}
          <div className="login-card-header">
            <GiLotus size={44} className="login-lotus" />
            <h1 className="login-title">
              {mode === "login" ? "Welcome Back" : "Join Yogashirini"}
            </h1>
            <p className="login-subtitle">
              {mode === "login"
                ? "Sign in to continue your yoga journey."
                : "Create an account to begin your practice."}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="login-tabs" role="tablist">
            <button
              role="tab"
              className={`login-tab${mode === "login" ? " active" : ""}`}
              onClick={() => mode !== "login" && switchMode()}
            >
              <MdLogin size={16} /> Sign In
            </button>
            <button
              role="tab"
              className={`login-tab${mode === "register" ? " active" : ""}`}
              onClick={() => mode !== "register" && switchMode()}
            >
              <MdPersonAdd size={16} /> Register
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* Name — register only */}
            {mode === "register" && (
              <div className="lf-group">
                <label htmlFor="lf-name">
                  <MdPerson size={15} /> Full Name
                </label>
                <input
                  id="lf-name" name="name" type="text"
                  placeholder="Your full name"
                  value={form.name} onChange={field}
                  className={errors.name ? "lf-input err" : "lf-input"}
                  autoComplete="name"
                />
                {errors.name && <span className="lf-error">{errors.name}</span>}
              </div>
            )}

            {/* Email */}
            <div className="lf-group">
              <label htmlFor="lf-email">
                <MdEmail size={15} /> Email Address
              </label>
              <input
                id="lf-email" name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={field}
                className={errors.email ? "lf-input err" : "lf-input"}
                autoComplete="email"
              />
              {errors.email && <span className="lf-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="lf-group">
              <label htmlFor="lf-password">
                <MdLock size={15} /> Password
              </label>
              <div className="lf-pwd-wrap">
                <input
                  id="lf-password" name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password} onChange={field}
                  className={errors.password ? "lf-input err" : "lf-input"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button type="button" className="lf-eye" onClick={() => setShowPwd(s => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}>
                  {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <span className="lf-error">{errors.password}</span>}
            </div>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <div className="lf-group">
                <label htmlFor="lf-confirm">
                  <MdLock size={15} /> Confirm Password
                </label>
                <input
                  id="lf-confirm" name="confirm" type="password"
                  placeholder="Re-enter password"
                  value={form.confirm} onChange={field}
                  className={errors.confirm ? "lf-input err" : "lf-input"}
                  autoComplete="new-password"
                />
                {errors.confirm && <span className="lf-error">{errors.confirm}</span>}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="lf-submit" disabled={loading}>
              {loading ? (
                <span className="lf-spinner" />
              ) : mode === "login" ? (
                <><MdLogin size={18} /> Sign In</>
              ) : (
                <><MdPersonAdd size={18} /> Create Account</>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="login-switch">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button className="login-switch-btn" onClick={switchMode}>Register here</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button className="login-switch-btn" onClick={switchMode}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
