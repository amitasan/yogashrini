import { useState, useEffect } from "react";
import Footer from "../inc/Footer";
import Sidebar from "../inc/Sidebar";
import Top from "../inc/Top";
import {
  MdSchool, MdPeople, MdPayment, MdVideoLibrary,
  MdTrendingUp, MdStar, MdPlayCircle, MdEmojiEvents
} from "react-icons/md";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

const API = "http://localhost:2000";

const enrollmentData = [
  { month: "Jan", enrollments: 12, revenue: 5400 },
  { month: "Feb", enrollments: 19, revenue: 8550 },
  { month: "Mar", enrollments: 15, revenue: 6750 },
  { month: "Apr", enrollments: 28, revenue: 12600 },
  { month: "May", enrollments: 34, revenue: 15300 },
  { month: "Jun", enrollments: 42, revenue: 18900 },
];

const courseProgressData = [
  { week: "Week 1", completions: 89 },
  { week: "Week 2", completions: 76 },
  { week: "Week 3", completions: 62 },
  { week: "Week 4", completions: 54 },
  { week: "Week 5", completions: 43 },
  { week: "Week 6", completions: 38 },
];

function StatCard({ icon: Icon, value, label, color, change, changeDir }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && (
          <div className={`stat-change ${changeDir}`}>
            <MdTrendingUp /> {change}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ totalEnrollments: 0, totalRevenue: 0 });
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    fetch(`${API}/payment/enrollment/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});

    fetch(`${API}/course?all=true`)
      .then(r => r.json())
      .then(d => setCourseCount(d.courses?.length || 0))
      .catch(() => {});
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Top title="Dashboard" />
        <div className="page-container">

          {/* Stats Grid */}
          <div className="stat-grid">
            <StatCard
              icon={MdSchool}
              value={courseCount}
              label="Total Courses"
              color="purple"
              change="+2 this month"
              changeDir="up"
            />
            <StatCard
              icon={MdPeople}
              value={stats.totalEnrollments}
              label="Total Enrollments"
              color="green"
              change="+12 this week"
              changeDir="up"
            />
            <StatCard
              icon={MdPayment}
              value={`₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`}
              label="Total Revenue"
              color="orange"
              change="+18% vs last month"
              changeDir="up"
            />
            <StatCard
              icon={MdVideoLibrary}
              value="—"
              label="Videos Uploaded"
              color="blue"
            />
            <StatCard
              icon={MdEmojiEvents}
              value="—"
              label="XP Distributed"
              color="red"
            />
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

            {/* Enrollment Trend */}
            <div className="ys-card">
              <div className="ys-card-header">
                <div className="ys-card-title">
                  <MdTrendingUp style={{ color: "#7C3AED" }} />
                  Enrollment Trend
                </div>
              </div>
              <div className="ys-card-body">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                      <defs>
                        <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} tick={{ fill: "#9ca3af" }} />
                      <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Area
                        type="monotone"
                        dataKey="enrollments"
                        stroke="#7C3AED"
                        strokeWidth={2.5}
                        fill="url(#enrollGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Course Completion */}
            <div className="ys-card">
              <div className="ys-card-header">
                <div className="ys-card-title">
                  <MdPlayCircle style={{ color: "#10b981" }} />
                  Week Completion Rate
                </div>
              </div>
              <div className="ys-card-body">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courseProgressData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" fontSize={12} tick={{ fill: "#9ca3af" }} />
                      <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                      <Bar dataKey="completions" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Revenue Area */}
          <div className="ys-card" style={{ marginBottom: 28 }}>
            <div className="ys-card-header">
              <div className="ys-card-title">
                <MdPayment style={{ color: "#f59e0b" }} />
                Revenue Overview (INR)
              </div>
            </div>
            <div className="ys-card-body">
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" fontSize={12} tick={{ fill: "#9ca3af" }} />
                    <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} tickFormatter={v => `₹${v}`} />
                    <Tooltip
                      formatter={v => [`₹${v}`, "Revenue"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fill="url(#revGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="ys-card">
            <div className="ys-card-header">
              <div className="ys-card-title">
                <MdStar style={{ color: "#7C3AED" }} />
                Quick Start Guide
              </div>
            </div>
            <div className="ys-card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { icon: MdSchool, title: "Create a Course", desc: "Go to Add Course, set title, price, and total weeks.", color: "purple" },
                  { icon: MdVideoLibrary, title: "Upload Videos", desc: "Open the course → Manage Weeks → upload MP4 videos per week.", color: "blue" },
                  { icon: MdPayment, title: "Enable Payment", desc: "Add your Razorpay keys to Server/.env and publish the course.", color: "green" },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} style={{ padding: "16px", background: "#fafbff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div className={`stat-icon ${color}`} style={{ marginBottom: 10 }}>
                      <Icon />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;