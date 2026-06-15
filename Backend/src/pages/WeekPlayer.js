import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../inc/Navbar";
import {
  MdPlayCircle, MdPause, MdArrowBack, MdArrowForward,
  MdCheckCircle, MdStar, MdList, MdVolumeUp, MdFullscreen
} from "react-icons/md";
import { RiAwardLine, RiCoinsLine, RiTrophyLine } from "react-icons/ri";

const API = "http://localhost:2000";

function WeekPlayer() {
  const { id, weekNum } = useParams();
  const nav             = useNavigate();

  const [course,      setCourse]      = useState(null);
  const [allWeeks,    setAllWeeks]    = useState([]);
  const [week,        setWeek]        = useState(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [completed,   setCompleted]   = useState(false);
  const [showReward,  setShowReward]  = useState(false);
  const [enrollment,  setEnrollment]  = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const videoRef = useRef();

  const userId = localStorage.getItem("userId") || null;

  useEffect(() => {
    Promise.all([
      fetch(`${API}/course/${id}`).then(r => r.json()),
      fetch(`${API}/course/${id}/weeks`).then(r => r.json()),
    ]).then(([cd, wd]) => {
      setCourse(cd.course);
      const ws = wd.weeks || [];
      setAllWeeks(ws);
      const current = ws.find(w => w.weekNumber === Number(weekNum));
      setWeek(current || null);
    });

    if (userId) {
      fetch(`${API}/payment/enrollment/check/${id}?userId=${userId}`)
        .then(r => r.json())
        .then(d => {
          if (!d.enrolled) nav(`/course/${id}`);   // bounce if not enrolled
          setEnrollment(d.enrollment);
          if (d.enrollment?.completedWeeks?.includes(Number(weekNum))) {
            setCompleted(true);
          }
        });
    } else {
      nav(`/course/${id}`);
    }
  }, [id, weekNum]);

  const handleComplete = async () => {
    if (completed) return;
    const r = await fetch(`${API}/payment/enrollment/complete-week`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId: id, weekNumber: Number(weekNum) }),
    });
    const data = await r.json();
    if (r.ok) {
      setCompleted(true);
      setEnrollment(data.enrollment);
      setShowReward(true);
    }
  };

  const regularWeeks = allWeeks.filter(w => !w.isBonus).sort((a, b) => a.weekNumber - b.weekNumber);
  const prevWeek = regularWeeks.find(w => w.weekNumber === Number(weekNum) - 1);
  const nextWeek = regularWeeks.find(w => w.weekNumber === Number(weekNum) + 1);
  const bonusWeeks = allWeeks.filter(w => w.isBonus);

  if (!week) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "100px 20px", color: "#9ca3af" }}>Loading...</div>
    </>
  );

  const currentVideo = week.videos[activeVideo];
  const isAlreadyCompleted = enrollment?.completedWeeks?.includes(Number(weekNum));
  const completedWeeks = enrollment?.completedWeeks || [];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#0f0f1a", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>

        {/* Reward Popup */}
        {showReward && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "white", borderRadius: 20, padding: "48px 40px", textAlign: "center",
              maxWidth: 400, width: "90%", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                <RiTrophyLine style={{ color: "#f59e0b" }} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#1e1e2e" }}>
                Week Completed!
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
                {week.title}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ background: "#f5f3ff", padding: "10px 20px", borderRadius: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#7C3AED" }}>+{week.bonusXP}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>XP Earned</div>
                </div>
                <div style={{ background: "#fffbeb", padding: "10px 20px", borderRadius: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>+{week.bonusPoints}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Points</div>
                </div>
                <div style={{ background: "#f0fdf4", padding: "10px 20px", borderRadius: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{enrollment?.totalXP || 0}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Total XP</div>
                </div>
              </div>
              {enrollment?.bonusUnlocked && (
                <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, border: "1px solid #fde68a" }}>
                  <MdStar style={{ color: "#f59e0b", fontSize: 20, marginRight: 6 }} />
                  <strong>Bonus Week Unlocked!</strong> You've completed all weeks.
                </div>
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {nextWeek && (
                  <button
                    onClick={() => { setShowReward(false); nav(`/course/${id}/week/${nextWeek.weekNumber}`); }}
                    style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #7C3AED, #6D28D9)", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Next Week <MdArrowForward />
                  </button>
                )}
                <button
                  onClick={() => setShowReward(false)}
                  style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontWeight: 600, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div style={{ background: "#1a1a2e", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #2d2d45" }}>
          <button
            onClick={() => nav(`/course/${id}`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
          >
            <MdArrowBack /> Back to Course
          </button>
          <div style={{ color: "#94a3b8", fontSize: 13, flex: 1 }}>
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #a855f7)", color: "white", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginRight: 8 }}>
              Week {week.weekNumber}
            </span>
            {week.isBonus && <span style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginRight: 8 }}>BONUS</span>}
            {week.title}
          </div>
          {/* XP Display */}
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <RiAwardLine /> {enrollment?.totalXP || 0} XP
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(s => !s)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#94a3b8", padding: "8px", borderRadius: 8, cursor: "pointer" }}
          >
            <MdList style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Main Body */}
        <div style={{ display: "flex", flex: 1 }}>

          {/* Video Player Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* Video */}
            <div style={{ background: "#000", position: "relative" }}>
              {currentVideo ? (
                <video
                  ref={videoRef}
                  src={`${API}/videos/${currentVideo.filename}`}
                  controls
                  style={{ width: "100%", maxHeight: "60vh", display: "block" }}
                  onEnded={() => {
                    // Auto-advance to next video
                    if (activeVideo < week.videos.length - 1) {
                      setActiveVideo(v => v + 1);
                    }
                  }}
                />
              ) : (
                <div style={{ width: "100%", height: 380, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e" }}>
                  <div style={{ textAlign: "center", color: "#9ca3af" }}>
                    <MdPlayCircle style={{ fontSize: 64, marginBottom: 12 }} />
                    <div>No videos in this week yet</div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div style={{ padding: "24px 28px", background: "#1a1a2e" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <h2 style={{ color: "white", fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
                    {currentVideo?.title || week.title}
                  </h2>
                  {currentVideo?.description && (
                    <p style={{ color: "#94a3b8", fontSize: 13 }}>{currentVideo.description}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  {!isAlreadyCompleted && !completed && (
                    <button
                      onClick={handleComplete}
                      style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <MdCheckCircle /> Mark Complete (+{week.bonusXP} XP)
                    </button>
                  )}
                  {(isAlreadyCompleted || completed) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 700, fontSize: 14 }}>
                      <MdCheckCircle style={{ fontSize: 20 }} /> Completed
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {prevWeek && (
                  <button
                    onClick={() => nav(`/course/${id}/week/${prevWeek.weekNumber}`)}
                    style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <MdArrowBack /> Week {prevWeek.weekNumber}
                  </button>
                )}
                {nextWeek && (
                  <button
                    onClick={() => nav(`/course/${id}/week/${nextWeek.weekNumber}`)}
                    style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #7C3AED, #6D28D9)", color: "white", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    Week {nextWeek.weekNumber} <MdArrowForward />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — Course Outline */}
          {sidebarOpen && (
            <div style={{ width: 320, background: "#16213e", borderLeft: "1px solid #2d2d45", overflowY: "auto" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d2d45" }}>
                <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Course Content</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                  {completedWeeks.length}/{regularWeeks.length} weeks completed
                </div>
                <div style={{ marginTop: 8, background: "#0f0f1a", borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "linear-gradient(90deg, #7C3AED, #a855f7)",
                    width: `${Math.round((completedWeeks.length / (regularWeeks.length || 1)) * 100)}%`,
                    transition: "width 0.4s",
                  }} />
                </div>
              </div>

              {/* Regular weeks */}
              <div style={{ padding: "8px 0" }}>
                {regularWeeks.map(w => {
                  const isCurrent = w.weekNumber === Number(weekNum);
                  const isDone    = completedWeeks.includes(w.weekNumber);
                  return (
                    <div
                      key={w._id}
                      onClick={() => nav(`/course/${id}/week/${w.weekNumber}`)}
                      style={{
                        padding: "12px 20px", cursor: "pointer",
                        background: isCurrent ? "rgba(124,58,237,0.15)" : "transparent",
                        borderLeft: isCurrent ? "3px solid #7C3AED" : "3px solid transparent",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                          background: isDone ? "#10b981" : isCurrent ? "#7C3AED" : "#2d2d45",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isDone ? <MdCheckCircle style={{ color: "white", fontSize: 14 }} />
                            : <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{w.weekNumber}</span>
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: isCurrent ? "#c4b5fd" : "#e2e8f0" }}>
                            {w.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            {w.videos.length} video{w.videos.length !== 1 ? "s" : ""} · {w.bonusXP} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bonus */}
              {bonusWeeks.length > 0 && (
                <>
                  <div style={{ padding: "8px 20px", borderTop: "1px solid #2d2d45", color: "#f59e0b", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <MdStar /> BONUS CONTENT
                  </div>
                  {bonusWeeks.map(w => {
                    const unlocked = enrollment?.bonusUnlocked;
                    const isCurrent = w.weekNumber === Number(weekNum);
                    return (
                      <div
                        key={w._id}
                        onClick={() => unlocked && nav(`/course/${id}/week/${w.weekNumber}`)}
                        style={{
                          padding: "12px 20px", cursor: unlocked ? "pointer" : "not-allowed", opacity: unlocked ? 1 : 0.5,
                          borderLeft: isCurrent ? "3px solid #f59e0b" : "3px solid transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: unlocked ? "#f59e0b" : "#2d2d45", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MdStar style={{ color: "white", fontSize: 14 }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{w.title}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>Bonus · {w.bonusXP} XP</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Video list for current week */}
              {week.videos.length > 1 && (
                <>
                  <div style={{ padding: "8px 20px", borderTop: "1px solid #2d2d45", color: "#94a3b8", fontSize: 11, fontWeight: 700 }}>
                    THIS WEEK'S VIDEOS
                  </div>
                  {week.videos.map((v, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveVideo(idx)}
                      style={{
                        padding: "10px 20px", cursor: "pointer",
                        background: idx === activeVideo ? "rgba(124,58,237,0.12)" : "transparent",
                        borderLeft: idx === activeVideo ? "3px solid #a855f7" : "3px solid transparent",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MdPlayCircle style={{ color: idx === activeVideo ? "#a855f7" : "#64748b", fontSize: 16, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: idx === activeVideo ? "#c4b5fd" : "#94a3b8" }}>
                          {v.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WeekPlayer;
