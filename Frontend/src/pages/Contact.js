// src/pages/Contact.jsx
import React from "react";
import "./Contact.css";
import Navbar from "../inc/Navbar";
import Footer from "../inc/Footer";

/* React decorative logo */
const ReactLogo = ({ size = 40, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 841.9 595.3"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" stroke="currentColor" strokeWidth="24">
      <ellipse cx="420.9" cy="296.5" rx="225" ry="75" />
      <ellipse cx="420.9" cy="296.5" rx="225" ry="75" transform="rotate(60 420.9 296.5)" />
      <ellipse cx="420.9" cy="296.5" rx="225" ry="75" transform="rotate(120 420.9 296.5)" />
    </g>
    <circle cx="420.9" cy="296.5" r="45" fill="currentColor" />
  </svg>
);

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="contact-container" role="main">
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <ReactLogo size={52} />
            <h1 style={{ margin: 0 }}>Contact Yogashrini</h1>
          </div>
          <p className="small-muted" style={{ marginTop: 10 }}>
            We're happy to help — reach out for classes, retreats, or teacher training.
          </p>
        </header>

        <section className="contact-cards container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="contact-card" role="region" aria-labelledby="contact-details-title" tabIndex="0">
                <h2 id="contact-details-title">Contact Details</h2>
                <table className="contact-table" aria-label="Contact information">
                  <tbody>
                    <tr>
                      <th>Email</th>
                      <td><a href="mailto:hello@yogashrini.com">hello@yogashrini.com</a></td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td><a href="tel:+919876543210">+91 98765 43210</a></td>
                    </tr>
                    <tr>
                      <th>Instagram</th>
                      <td><a href="https://instagram.com/yogashrini" target="_blank" rel="noreferrer">@yogashrini</a></td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: 12 }}>
                  <a className="btn btn-primary" href="/contact">Send Message</a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="contact-card" role="region" aria-labelledby="centers-title" tabIndex="0">
                <h2 id="centers-title">Current & Upcoming Centers</h2>

                <h3 className="small-muted" style={{ marginTop: 6 }}>Current Centers</h3>
                <table className="center-table" aria-label="Current yoga centers">
                  <thead>
                    <tr><th>City</th><th>State</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Kolkata</td><td>West Bengal</td></tr>
                    <tr><td>Bangalore</td><td>Karnataka</td></tr>
                    <tr><td>Rishikesh</td><td>Uttarakhand</td></tr>
                    <tr><td>Pune</td><td>Maharashtra</td></tr>
                    <tr><td>Chennai</td><td>Tamil Nadu</td></tr>
                  </tbody>
                </table>

                <h3 className="small-muted" style={{ marginTop: 12 }}>Upcoming Centers</h3>
                <table className="center-table upcoming" aria-label="Upcoming centers">
                  <thead><tr><th>City</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>Delhi NCR</td><td>Opening Soon</td></tr>
                    <tr><td>Goa</td><td>Finalizing Location</td></tr>
                    <tr><td>Ahmedabad</td><td>In Planning</td></tr>
                    <tr><td>Jaipur</td><td>Construction Ongoing</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="map-section container" aria-labelledby="map-title" style={{ marginTop: 28 }}>
          <h2 id="map-title">Main Center Location (Kolkata)</h2>
          <div className="map-frame" style={{ marginTop: 10 }}>
            <iframe
              title="Yogashrini Main Center"
              src="https://www.google.com/maps?q=22.575645379498365,88.3214823953106&z=15&output=embed"
              width="100%"
              height="420"
              allowFullScreen
              loading="lazy"
              aria-label="Map showing Yogashrini main center location in Kolkata"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
