import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../inc/Navbar";
import { MdStar, MdPlayCircle, MdSchool, MdAccessTime, MdLock } from "react-icons/md";
import { RiAwardLine, RiCoinsLine, RiSearchLine } from "react-icons/ri";

const API = "http://localhost:2000";

const levelColor = {
  Beginner:     { bg: "#ecfdf5", color: "#065f46" },
  Intermediate: { bg: "#fffbeb", color: "#92400e" },
  Advanced:     { bg: "#fef2f2", color: "#991b1b" },
};

function Courses() {
  const [courses,  setCourses]  = useState([]);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [loading,  setLoading]  = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${API}/course`)
      .then(r => r.json())
      .then(d => { setCourses(d.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#f4f5fa", fontFamily: "'Inter', sans-serif" }}>

        {/* Hero Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "60px 20px",
          textAlign: "center",
        }}>
          <h1 style={{ color: "white", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Yoga Learning Courses
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Master yoga from home. Week-by-week structured courses with video lessons, bonus content, and XP rewards.
          </p>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.1)", borderRadius: 12,
            padding: "12px 20px", maxWidth: 480, margin: "0 auto",
            border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
          }}>
            <RiSearchLine style={{ color: "#94a3b8", fontSize: 20, flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "white", fontSize: 15, flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["All", "Beginner", "Intermediate", "Advanced"].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                style={{
                  padding: "8px 20px", borderRadius: 20, border: "1px solid",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  background: filter === level ? "#7C3AED" : "white",
                  color:      filter === level ? "white"   : "#374151",
                  borderColor: filter === level ? "#7C3AED" : "#e5e7eb",
                  transition: "all 0.2s",
                }}
              >
                {level}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", alignSelf: "center" }}>
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading courses...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
              <MdSchool style={{ fontSize: 48, marginBottom: 12 }} />
              <div style={{ fontSize: 18, fontWeight: 600 }}>No courses found</div>
            </div>
          )}

          {/* Course Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 24 }}>
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} onEnroll={() => nav(`/course/${course._id}`)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function CourseCard({ course, onEnroll }) {
  const lc = levelColor[course.level] || levelColor.Beginner;

  return (
    <div
      style={{
        background: "white", borderRadius: 16, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "all 0.25s",
        cursor: "pointer", border: "1px solid #e5e7eb",
      }}
      onClick={onEnroll}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        {course.thumbnail
          ? <img src={`http://localhost:2000/thumbnails/${course.thumbnail}`} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a1a2e, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdSchool style={{ fontSize: 60, color: "rgba(255,255,255,0.3)" }} />
            </div>
        }
        {/* Play overlay */}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0, transition: "opacity 0.2s",
        }}
          className="card-play-overlay"
        >
          <MdPlayCircle style={{ fontSize: 56, color: "white" }} />
        </div>
        {/* Price badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: course.price === 0 ? "#10b981" : "#7C3AED",
          color: "white", padding: "4px 12px", borderRadius: 20,
          fontWeight: 700, fontSize: 13,
        }}>
          {course.price === 0 ? "FREE" : `₹${course.price}`}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "18px 20px" }}>
        {/* Level */}
        <span style={{ ...lc, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
          {course.level}
        </span>

        <h3 style={{ fontWeight: 700, fontSize: 16, margin: "10px 0 8px", color: "#1e1e2e", lineHeight: 1.3 }}>
          {course.title}
        </h3>

        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {course.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 12, color: "#9ca3af" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MdAccessTime /> {course.totalWeeks} weeks
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <RiAwardLine style={{ color: "#7C3AED" }} /> XP Rewards
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MdStar style={{ color: "#f59e0b" }} /> Bonus content
          </span>
        </div>

        <button
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)", color: "white",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
        >
          {course.price === 0 ? "Enroll Free" : "View Course"}
        </button>
      </div>
    </div>
  );
}

export default Courses;
