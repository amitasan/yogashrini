import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../inc/Navbar";
import {
  MdPlayCircle, MdLock, MdCheckCircle, MdStar,
  MdArrowBack, MdSchool, MdAccessTime, MdPeople
} from "react-icons/md";
import { RiAwardLine, RiCoinsLine, RiShieldCheckLine } from "react-icons/ri";

const API = "http://localhost:2000";

function CourseDetail() {
  const { id } = useParams();
  const nav    = useNavigate();

  const [course,     setCourse]     = useState(null);
  const [weeks,      setWeeks]      = useState([]);
  const [enrolled,   setEnrolled]   = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [msg,        setMsg]        = useState(null);

  const userId = localStorage.getItem("userId") || null;

  useEffect(() => {
    Promise.all([
      fetch(`${API}/course/${id}`).then(r => r.json()),
      fetch(`${API}/course/${id}/weeks`).then(r => r.json()),
    ]).then(([cd, wd]) => {
      setCourse(cd.course);
      setWeeks(wd.weeks || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (userId) {
      fetch(`${API}/payment/enrollment/check/${id}?userId=${userId}`)
        .then(r => r.json())
        .then(d => {
          setEnrolled(d.enrolled);
          setEnrollment(d.enrollment);
        });
    }
  }, [id, userId]);

  const handleEnroll = async () => {
    if (!userId) {
      return nav("/login");
    }

    setPayLoading(true);
    try {
      const r = await fetch(`${API}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id, userId }),
      });
      const data = await r.json();

      if (data.free) {
        setEnrolled(true);
        setMsg({ type: "success", text: "Enrolled for free! Enjoy the course." });
        return nav(`/course/${id}/week/1`);
      }

      // Open Razorpay checkout
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        "Yogashrini",
        description: data.courseName,
        order_id:    data.orderId,
        handler: async function (response) {
          const vr = await fetch(`${API}/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              courseId:            id,
              userId,
            }),
          });
          const vdata = await vr.json();
          if (vr.ok) {
            setEnrolled(true);
            setMsg({ type: "success", text: "Payment successful! Your course is ready." });
            setTimeout(() => nav(`/course/${id}/week/1`), 1500);
          } else {
            setMsg({ type: "danger", text: vdata.error || "Payment verification failed" });
          }
        },
        prefill: { name: localStorage.getItem("uname") || "", email: "" },
        theme: { color: "#7C3AED" },
        modal: { ondismiss: () => setPayLoading(false) },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (e) {
      setMsg({ type: "danger", text: "Failed to initiate payment. Please try again." });
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "100px 20px", color: "#9ca3af" }}>Loading course...</div>
    </>
  );

  if (!course) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "100px 20px", color: "#9ca3af" }}>Course not found</div>
    </>
  );

  const regularWeeks = weeks.filter(w => !w.isBonus).sort((a, b) => a.weekNumber - b.weekNumber);
  const bonusWeeks   = weeks.filter(w => w.isBonus);
  const completedNums = enrollment?.completedWeeks || [];
  const totalXP = regularWeeks.reduce((s, w) => s + w.bonusXP, 0) + bonusWeeks.reduce((s, w) => s + w.bonusXP, 0);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#f4f5fa", fontFamily: "'Inter', sans-serif" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          padding: "50px 20px",
          color: "white",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "center" }}>
            <div>
              <button
                onClick={() => nav("/courses")}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}
              >
                <MdArrowBack /> All Courses
              </button>
              <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>{course.title}</h1>
              <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>{course.description}</p>
              <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#94a3b8", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MdSchool style={{ color: "#7C3AED" }} /> {course.level}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MdAccessTime style={{ color: "#10b981" }} /> {course.totalWeeks} Weeks</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><RiAwardLine style={{ color: "#f59e0b" }} /> Up to {totalXP} XP</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MdStar style={{ color: "#f59e0b" }} /> {bonusWeeks.length} Bonus Week{bonusWeeks.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Enrollment Card */}
            <div style={{
              background: "white", borderRadius: 16, padding: 28,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              {course.thumbnail
                ? <img src={`${API}/thumbnails/${course.thumbnail}`} alt={course.title} style={{ width: "100%", borderRadius: 10, marginBottom: 20, height: 160, objectFit: "cover" }} />
                : <div style={{ width: "100%", height: 160, borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #a855f7)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MdSchool style={{ fontSize: 60, color: "rgba(255,255,255,0.4)" }} />
                  </div>
              }

              {msg && (
                <div style={{
                  padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13,
                  background: msg.type === "success" ? "#ecfdf5" : "#fef2f2",
                  color:      msg.type === "success" ? "#065f46" : "#991b1b",
                  border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {msg.text}
                </div>
              )}

              <div style={{ fontSize: 28, fontWeight: 800, color: "#1e1e2e", marginBottom: 4 }}>
                {course.price === 0 ? "FREE" : `₹${course.price}`}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>One-time purchase • Lifetime access</div>

              {enrolled ? (
                <button
                  onClick={() => nav(`/course/${id}/week/1`)}
                  style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <MdPlayCircle style={{ fontSize: 20 }} /> Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={payLoading}
                  style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7C3AED, #6D28D9)", color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <RiShieldCheckLine style={{ fontSize: 18 }} />
                  {payLoading ? "Processing..." : course.price === 0 ? "Enroll Free" : "Enroll Now"}
                </button>
              )}

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: MdPlayCircle, text: `${weeks.reduce((s, w) => s + w.videos.length, 0)} video lessons` },
                  { icon: RiAwardLine,  text: `Earn up to ${totalXP} XP` },
                  { icon: RiCoinsLine,  text: "Bonus points rewards" },
                  { icon: MdStar,       text: bonusWeeks.length > 0 ? "Bonus week included" : "Certificate on completion" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
                    <Icon style={{ color: "#7C3AED", fontSize: 15 }} /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "#1e1e2e" }}>
            Course Curriculum
          </h2>

          {/* Regular Weeks */}
          {regularWeeks.map(week => {
            const isDone    = completedNums.includes(week.weekNumber);
            const isLocked  = !enrolled;

            return (
              <div
                key={week._id}
                style={{
                  background: "white", borderRadius: 12, marginBottom: 12,
                  border: "1px solid #e5e7eb", overflow: "hidden",
                  cursor: enrolled ? "pointer" : "default",
                  boxShadow: isDone ? "0 0 0 2px #10b98140" : "none",
                }}
                onClick={() => enrolled && nav(`/course/${id}/week/${week.weekNumber}`)}
              >
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: isDone ? "#10b981" : isLocked ? "#f3f4f6" : "linear-gradient(135deg, #7C3AED, #a855f7)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                  }}>
                    {isDone ? <MdCheckCircle style={{ fontSize: 20, color: "white" }} />
                      : isLocked ? <MdLock style={{ fontSize: 18, color: "#9ca3af" }} />
                      : <MdPlayCircle style={{ fontSize: 20 }} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e1e2e" }}>
                      <span style={{
                        background: "linear-gradient(135deg, #7C3AED, #a855f7)",
                        color: "white", fontSize: 11, padding: "2px 8px",
                        borderRadius: 20, marginRight: 8, fontWeight: 700,
                      }}>
                        Week {week.weekNumber}
                      </span>
                      {week.title}
                    </div>
                    {week.description && (
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{week.description}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      background: "#f5f3ff", color: "#7C3AED", padding: "3px 10px",
                      borderRadius: 20, fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <RiAwardLine /> {week.bonusXP} XP
                    </span>
                    <span style={{
                      background: "#fffbeb", color: "#92400e", padding: "3px 10px",
                      borderRadius: 20, fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <RiCoinsLine /> {week.bonusPoints} pts
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 60, textAlign: "right" }}>
                      {week.videos.length} video{week.videos.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bonus Weeks */}
          {bonusWeeks.length > 0 && (
            <>
              <div style={{ margin: "28px 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <MdStar style={{ color: "#f59e0b", fontSize: 20 }} />
                <span style={{ fontWeight: 800, fontSize: 16, color: "#1e1e2e" }}>Bonus Content</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>— Unlocks after completing all weeks</span>
              </div>
              {bonusWeeks.map(week => {
                const unlocked = enrollment?.bonusUnlocked;
                return (
                  <div
                    key={week._id}
                    style={{
                      background: "white", borderRadius: 12, marginBottom: 12,
                      border: "2px solid #fbbf24", overflow: "hidden",
                      cursor: unlocked ? "pointer" : "default",
                    }}
                    onClick={() => unlocked && nav(`/course/${id}/week/${week.weekNumber}`)}
                  >
                    <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: unlocked ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : "#f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {unlocked
                          ? <MdStar style={{ fontSize: 20, color: "white" }} />
                          : <MdLock style={{ fontSize: 18, color: "#9ca3af" }} />
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e1e2e" }}>
                          <span style={{
                            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                            color: "white", fontSize: 11, padding: "2px 8px",
                            borderRadius: 20, marginRight: 8, fontWeight: 700,
                          }}>
                            BONUS
                          </span>
                          {week.title}
                        </div>
                        {!unlocked && (
                          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                            Complete all {regularWeeks.length} regular weeks to unlock
                          </div>
                        )}
                      </div>
                      <span style={{
                        background: "#fffbeb", color: "#92400e", padding: "3px 10px",
                        borderRadius: 20, fontSize: 11, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <RiAwardLine /> {week.bonusXP} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseDetail;
