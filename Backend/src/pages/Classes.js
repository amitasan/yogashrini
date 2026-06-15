// Classes.js
import React from "react";
import "./Classes.css";
import Navbar from "../inc/Navbar";

function Classes() {
  return (
    <>
      <Navbar />
      <div className="classes-container">
        <h1>🧘‍♂️ Yoga Classes Schedule</h1>

        <table className="class-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Timing</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td>Hatha Yoga</td>
              <td>7:00 AM – 8:00 AM</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>Vinyasa Flow</td>
              <td>6:00 PM – 7:00 PM</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>Restorative Yoga</td>
              <td>8:00 AM – 9:00 AM</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>Power Yoga</td>
              <td>6:30 PM – 7:30 PM</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>Yin Yoga</td>
              <td>7:00 AM – 8:00 AM</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>Yoga Nidra & Meditation</td>
              <td>5:00 PM – 6:00 PM</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>Community Class (All Levels)</td>
              <td>9:00 AM – 10:30 AM</td>
            </tr>
          </tbody>
        </table>

        <h2>📚 Upcoming Seminars</h2>

        <table className="seminar-table">
          <thead>
            <tr>
              <th>Seminar</th>
              <th>Description</th>
              <th>Entry Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Breathwork for Stress Relief</td>
              <td>A deep dive into pranayama techniques to manage anxiety and stress.</td>
              <td>₹500</td>
            </tr>
            <tr>
              <td>Intro to Ayurveda & Yoga</td>
              <td>Explore how Ayurveda complements your yoga practice and daily lifestyle.</td>
              <td>₹600</td>
            </tr>
            <tr>
              <td>Full Moon Sound Healing</td>
              <td>An immersive evening of sound meditation with crystal bowls and gongs.</td>
              <td>₹800</td>
            </tr>
            <tr>
              <td>Yoga Philosophy 101</td>
              <td>An introduction to key yogic texts like the Bhagavad Gita and Yoga Sutras.</td>
              <td>₹400</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Classes;
