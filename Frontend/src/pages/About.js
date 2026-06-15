// About.jsx
import React from "react";
import "./About.css";
import Navbar from "../inc/Navbar";
import { GiLotus } from "react-icons/gi";
import { MdPlace } from "react-icons/md";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="about-container" role="main">
        <header className="about-hero">
          <div className="about-hero-inner container">
            <div className="about-hero-left">
              <h1>About Yogashrini Yoga School</h1>
              <p className="lead">
                A sanctuary for self-discovery — blending classical yogic wisdom with modern insight,
                accessible to everyone.
              </p>

              <div className="about-cta">
                <a className="btn btn-primary" href="/training">View Training</a>
                <a className="btn btn-outline-secondary" href="/contact">Contact Us</a>
              </div>
            </div>

            <div className="about-hero-right" aria-hidden="true">
              <div className="react-badge">
                <GiLotus size={56} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />
                <div className="react-text">Yogashirini School</div>
                <div style={{ fontSize: "0.82rem", opacity: 0.7 }}>Est. 2013 · Kolkata</div>
              </div>
            </div>
          </div>
        </header>

        <section className="about-grid container">
          <article className="about-card" aria-labelledby="about-mission">
            <h2 id="about-mission">Our Mission</h2>
            <p>
              At Yogashrini Yoga School, we embrace yoga not just as a physical discipline but as a
              sacred way of life. Our journey began over a decade ago with a simple mission: to bring
              authentic, heart-centered yoga to people from all walks of life.
            </p>
            <p>
              Nestled in peaceful surroundings, our school offers a calm space for inner exploration,
              healing, and transformation.
            </p>
          </article>

          <article className="about-card" aria-labelledby="about-inclusive">
            <h2 id="about-inclusive">Inclusivity & Community</h2>
            <p>
              Yoga at Yogashrini is for everyone — regardless of age, gender, or ability. We cultivate
              a safe, welcoming space and offer classes for beginners, intermediate practitioners, and
              advanced students.
            </p>
            <p>
              Beyond daily classes we host workshops, retreats, and community events that deepen connection.
            </p>
          </article>

          <article className="about-card" aria-labelledby="about-teachers">
            <h2 id="about-teachers">Our Teachers</h2>
            <p>
              Our instructors are lifelong learners with expertise in yoga philosophy, anatomy, breathwork,
              Ayurveda, and meditation. They guide with empathy, depth, and practical knowledge.
            </p>
            <ul>
              <li><strong>Anjali</strong> — Hatha Master (15+ yrs)</li>
              <li><strong>Ravi</strong> — Vinyasa & Breathwork Specialist</li>
              <li><strong>Maya</strong> — Restorative & Mindfulness Expert</li>
            </ul>
          </article>

          <article className="about-card" aria-labelledby="about-programs">
            <h2 id="about-programs">Programs & Philosophy</h2>
            <p>
              We blend ancient wisdom with modern science to craft classes that honor body, breath, and mind.
              Our teacher trainings (YTT), workshops and retreats are designed to cultivate growth and lasting change.
            </p>
            <p>
              Progress here is measured by presence — not by perfection.
            </p>
          </article>

          <article className="about-card" aria-labelledby="about-outreach">
            <h2 id="about-outreach">Community Outreach</h2>
            <p>
              We partner with local organizations for wellness outreach and trauma-informed practices. Our curriculum
              evolves to reflect both ancient traditions and contemporary needs.
            </p>
          </article>

          <article className="about-card" aria-labelledby="about-contact">
            <h2 id="about-contact">Get Involved</h2>
            <p>
              Join a class, sign up for a retreat, or enroll in our teacher training. We welcome students from
              all over the world—come practice with us.
            </p>
            <a className="btn btn-primary" href="/contact">Join Now</a>
          </article>
        </section>
      </main>
    </>
  );
}
