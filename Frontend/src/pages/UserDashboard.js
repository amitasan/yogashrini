// src/pages/UserDashboard.jsx
import React from "react";
import "../App.css";
import "./UserDashboard.css";
import Yoga from "./Yogashrini.jpg";
import Navbar from "../inc/Navbar";
import Footer from "../inc/Footer";
import {
  GiLotus, GiMeditation, GiYinYang
} from "react-icons/gi";
import {
  MdSelfImprovement, MdPeople, MdStar, MdLocationOn, MdSchool
} from "react-icons/md";
import { FaLeaf, FaHeart, FaUsers } from "react-icons/fa";

/* Reusable card section */
const SectionCard = ({ title, children, icon }) => (
  <section className="ud-card">
    <div className="ud-card-header">
      <div className="ud-card-icon">{icon}</div>
      <h3>{title}</h3>
    </div>
    <div className="ud-card-body">{children}</div>
  </section>
);

function UserDashboard() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <header className="ud-hero">
        <div className="ud-hero-inner container">
          <div className="ud-hero-left">
            <img src={Yoga} alt="Yogashrini" className="ud-hero-logo" />
            <div className="ud-hero-title-wrap">
              <h1 className="ud-title">YOGASHRINI YOGA SCHOOL</h1>
              <p className="ud-subtitle">
                A sanctuary for self-discovery & transformation — traditional practice, modern heart.
              </p>

              <div className="ud-cta-group">
                <a className="btn btn-primary btn-lg" href="/training">Join a Class</a>
                <a className="btn btn-outline-secondary btn-lg" href="/contact">Contact Us</a>
              </div>
            </div>
          </div>

          <div className="ud-hero-right">
            <div className="ud-hero-card">
              <div className="ud-hero-card-top">
                <GiLotus size={40} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />
                <div>
                  <strong>Yogashirini School</strong>
                  <div className="muted">Authentic · Inclusive · Transformative</div>
                </div>
              </div>

              <div className="ud-stats">
                <div className="stat">
                  <div className="stat-num">10+</div>
                  <div className="stat-label">Years of Practice</div>
                </div>
                <div className="stat">
                  <div className="stat-num">47</div>
                  <div className="stat-label">Pose Classes</div>
                </div>
                <div className="stat">
                  <div className="stat-num">3</div>
                  <div className="stat-label">Expert Teachers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="ud-main container">
        <SectionCard
          title="About Yogashrini Yoga School"
          icon={<GiMeditation size={28} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}
        >
          <p>
            Yogashrini is more than a yoga school — it’s a sanctuary for self-discovery, healing,
            and transformation. We blend time-tested yogic wisdom with modern movement science.
          </p>
        </SectionCard>

        <SectionCard title="Core Values" icon={<GiYinYang size={26} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
          <table className="values-table">
            <thead>
              <tr>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Authenticity</td><td>Rooted in traditional yogic practices, honoring Hatha & Vinyasa.</td></tr>
              <tr><td>Inclusivity</td><td>Classes for all levels with a welcoming atmosphere.</td></tr>
              <tr><td>Community</td><td>We cultivate connection through workshops & retreats.</td></tr>
              <tr><td>Growth</td><td>Yoga is a journey — we meet students where they are.</td></tr>
            </tbody>
          </table>
        </SectionCard>

        <div className="grid-3">
          <SectionCard title="What We Offer" icon={<FaLeaf size={22} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
            <ul className="offerings-list">
              <li>Daily yoga & meditation classes</li>
              <li>Weekend retreats & workshops</li>
              <li>Yoga Teacher Training (YTT) programs</li>
              <li>Online masterclasses</li>
            </ul>
          </SectionCard>

          <SectionCard title="Teacher Training" icon={<MdSchool size={26} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
            <p>
              Our training programs blend deep study with personal transformation — preparing you
              to become a mindful teacher and leader.
            </p>
            <a className="btn btn-outline-primary" href="/training">Learn More</a>
          </SectionCard>

          <SectionCard title="Location & Facilities" icon={<MdLocationOn size={26} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
            <ul>
              <li>Clean changing rooms & showers</li>
              <li>Spacious practice hall with eco mats</li>
              <li>Outdoor garden for meditation</li>
            </ul>
          </SectionCard>
        </div>

        <SectionCard title="Meet Our Teachers" icon={<MdPeople size={26} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
          <div className="teacher-list">
            <div className="teacher">
              <div className="avatar">A</div>
              <div>
                <strong>Anjali</strong>
                <div className="muted">Hatha Master • 15+ yrs</div>
              </div>
            </div>

            <div className="teacher">
              <div className="avatar">R</div>
              <div>
                <strong>Ravi</strong>
                <div className="muted">Vinyasa • Breathwork</div>
              </div>
            </div>

            <div className="teacher">
              <div className="avatar">M</div>
              <div>
                <strong>Maya</strong>
                <div className="muted">Restorative • Mindfulness</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Student Testimonials" icon={<MdStar size={26} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />}>
          <blockquote className="testimonial">
            "Yogashrini changed my life. The teachers are kind, knowledgeable, and truly care." – <em>Priya R.</em>
          </blockquote>
          <blockquote className="testimonial">
            "Joining the YTT program was transformative." – <em>Arjun D.</em>
          </blockquote>
        </SectionCard>
      </main>

      <Footer />
    </>
  );
}

export default UserDashboard;
