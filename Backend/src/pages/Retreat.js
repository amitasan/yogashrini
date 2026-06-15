// src/pages/Retreat.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../inc/Navbar";
import "./Retreat.css";
import { GiLotus } from "react-icons/gi";

/* ControlledDetails: keeps aria-expanded in sync using onToggle */
function ControlledDetails({ id, summary = "More details", children }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      id={id}
      className="retreat-details"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      {/* summary gets aria-expanded to aid screen readers & CSS */}
      <summary
        className="details-summary"
        aria-expanded={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // toggle by manually changing open state on the element
            const detailsEl = e.currentTarget.parentElement;
            if (detailsEl) detailsEl.open = !detailsEl.open;
            setOpen(detailsEl.open);
          }
        }}
      >
        <span>{summary}</span>
      </summary>

      <div className="details-content" aria-hidden={!open}>
        {children}
      </div>
    </details>
  );
}

/* Single retreat card component */
function RetreatCard({ retreat }) {
  const key = retreat._id ?? (retreat.rname ? retreat.rname.replace(/\s+/g, "-").toLowerCase() : Math.random().toString(36).slice(2, 9));
  const short = retreat.rshort ?? (retreat.ractivities ? retreat.ractivities.split(",").slice(0, 2).join(", ") : "A restorative retreat in nature.");

  return (
    <article
      key={key}
      className="retreat-card"
      role="region"
      aria-labelledby={`retreat-title-${key}`}
      tabIndex={0}
      onKeyDown={(e) => {
        // press Enter to toggle the details
        if (e.key === "Enter") {
          const dlg = document.getElementById(`details-${key}`);
          if (dlg) dlg.open = !dlg.open;
        }
      }}
    >
      <div className="retreat-card-top">
        <h3 id={`retreat-title-${key}`}>{retreat.rname || "Untitled Retreat"}</h3>
        <div className="retreat-meta">
          <span className="pill">{retreat.rdate || "TBA"}</span>
          <span className="pill muted">{retreat.rlocation || "Location TBA"}</span>
        </div>
      </div>

      <div className="retreat-card-body">
        <p className="short-desc">{short}</p>

        <ControlledDetails id={`details-${key}`} summary="More details">
          {/* accessible label/value table */}
          <table className="retreat-table" aria-label={`Details for ${retreat.rname || "this retreat"}`}>
            <caption style={{ display: "none" }}>{`Details for ${retreat.rname || "retreat"}`}</caption>
            <tbody>
              <tr>
                <th scope="row" className="label">Dates</th>
                <td className="value">{retreat.rdate || "TBA"}</td>
              </tr>

              <tr>
                <th scope="row" className="label">Location</th>
                <td className="value">{retreat.rlocation || "TBA"}</td>
              </tr>

              <tr>
                <th scope="row" className="label">Activities</th>
                <td className="value">{retreat.ractivities || "Yoga, meditation, nature walks"}</td>
              </tr>

              <tr>
                <th scope="row" className="label">Cost</th>
                <td className="value">{retreat.rcost ?? "Contact for pricing"}</td>
              </tr>

              {retreat.rother && (
                <tr>
                  <th scope="row" className="label">Note</th>
                  <td className="value">{retreat.rother}</td>
                </tr>
              )}
            </tbody>
          </table>
        </ControlledDetails>
      </div>

      <div className="retreat-card-footer">
        <NavLink to="/contact" className="btn btn-primary">Contact to Book</NavLink>
        <button className="btn btn-outline" onClick={(e) => {
          e.preventDefault();
          // optional hook for gallery - placeholder behavior
          alert("Gallery coming soon for " + (retreat.rname ?? "this retreat"));
        }}>
          View Gallery
        </button>
      </div>
    </article>
  );
}

export default function Retreat() {
  const [retreats, setRetreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getRetreats() {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch("http://localhost:2000/retreat/sel");
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
      const data = await resp.json();
      setRetreats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching retreats:", err);
      setError("Unable to load retreats. Please try again later.");
      setRetreats([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRetreats();
  }, []);

  return (
    <>
      <Navbar />

      <main className="retreat-page" role="main">
        <header className="retreat-hero">
          <div className="container retreat-hero-inner">
            <div>
              <h1>Upcoming Yoga Retreats</h1>
              <p className="lead">
                Soulful excursions combining yoga, nature, and community. Choose a retreat to view details and contact us to book your spot.
              </p>
            </div>

            <div className="retreat-hero-badge" aria-hidden="true">
              <GiLotus size={56} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />
              <div className="muted">Retreat Experiences</div>
            </div>
          </div>
        </header>

        <section className="container retreat-listing" aria-labelledby="retreat-list-title">
          <div className="section-head">
            <h2 id="retreat-list-title">Available Retreats</h2>
            <div className="muted">{retreats.length} retreats</div>
          </div>

          {loading ? (
            <div className="center-message" role="status" aria-live="polite">
              <div className="spinner-border" aria-hidden="true" />
              <div className="mt-2">Loading retreats…</div>
            </div>
          ) : error ? (
            <div className="center-message error" role="alert">{error}</div>
          ) : retreats.length === 0 ? (
            <div className="center-message">
              <p>No retreats available right now. Check back soon 🙏</p>
              <NavLink className="btn btn-primary" to="/contact">Contact Us</NavLink>
            </div>
          ) : (
            <div className="retreat-grid">
              {retreats.map((r) => <RetreatCard key={r._id ?? r.rname} retreat={r} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
