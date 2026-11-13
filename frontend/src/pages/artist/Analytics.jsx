import React, { useEffect, useState } from 'react'
import ArtistHeader from './ArtistHeader'
import ArtistSidebar from './ArtistSidebar'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const StatCard = ({ title, value, icon, delay = 0 }) => (
  <div
    className="relative overflow-hidden bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-lg hover:scale-105 hover:bg-white/30 transition-all duration-300 cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -top-4 -right-4 text-6xl opacity-10 select-none">{icon}</div>
    <p className="text-sm font-semibold tracking-widest uppercase text-[#2d4a5a]/70">{title}</p>
    <p className="text-4xl font-bold mt-2 text-[#1a3040]">{value ?? "—"}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur border border-white/40 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-[#1a3040] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: ₹{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const token = localStorage.getItem('token');
  const [dashboard, setDashboard] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Monthly");
  const [animateIn, setAnimateIn] = useState(false);
  const salesData = dashboard.monthlySales || [];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/artists/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setDashboard(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchDashboard();
    }

    setTimeout(() => setAnimateIn(true), 100);
  }, [token]);

  const stats = [
    { title: "Total Sales", value: `₹${dashboard.totalSales?.toLocaleString() ?? "0"}`, icon: "💰" },
    { title: "Total Orders", value: dashboard.orders?.length || 0, icon: "🛍️" },
    { title: "Artworks", value: dashboard.totalArtworks ?? 0, icon: "🎨" },
    { title: "Pending", value: dashboard.pendingOrders ?? 0, icon: "⏳" },
  ];

  return (
    <div className="min-h-screen">
      <ArtistHeader />

      <div className="flex">
        <ArtistSidebar />

        <div className="flex-1 px-8 py-10 font-['Figtree'] bg-[#B5C4D2] rounded-4xl my-20 mx-5">

          {/* Page Title */}
          <div className={`mb-8 transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl font-bold text-[#1a3040]">Analytics Dashboard</h1>
            <p className="text-[#2d4a5a]/70 mt-1 text-sm">Track your sales, orders, and artwork performance</p>
          </div>

          {/* Stat Cards */}
          <div className={`grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8 transition-all duration-700 delay-100 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {stats.map((item, i) => (
              <StatCard key={i} {...item} delay={i * 80} />
            ))}
          </div>

          {/* Chart Header */}
          <div className={`flex flex-wrap justify-between items-center mb-4 transition-all duration-700 delay-200 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h2 className="text-xl font-bold text-[#1a3040]">Sales Performance</h2>
            <div className="flex gap-2 mt-2 sm:mt-0">
              {["Weekly", "Monthly", "Yearly"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-[#1a3040] text-white border-[#1a3040] shadow-md"
                      : "bg-white/20 border-white/30 text-[#1a3040] hover:bg-white/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chart */}
          <div className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 shadow-lg transition-all duration-700 delay-300 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3040" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1a3040" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d4a5a20" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#2d4a5a", fontSize: 12 }}
                  axisLine={{ stroke: "#2d4a5a30" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#2d4a5a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#1a3040"
                  strokeWidth={3}
                  fill="url(#salesGrad)"
                  dot={{ r: 4, fill: "#1a3040", strokeWidth: 2, stroke: "#B5C4D2" }}
                  activeDot={{ r: 6, fill: "#1a3040" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insight Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 transition-all duration-700 delay-[400ms] ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {[
              {
                emoji: "🔥",
                label: "Best Month",
                value: dashboard.bestMonth || "No Data",
                sub: "Based on completed sales",
                color: "from-orange-100/40 to-orange-50/20",
                textColor: "text-orange-900"
              },
              {
                emoji: "📈",
                label: "Growth",
                value: `${dashboard.growthPercentage ?? 0}%`,
                sub: "Compared to last month",
                color: "from-emerald-100/40 to-emerald-50/20",
                textColor: "text-emerald-900"
              },
              {
                emoji: "⚠️",
                label: "Attention",
                value: `${dashboard.pendingOrders ?? 0} Orders`,
                sub: "Pending delivery",
                color: "from-amber-100/40 to-amber-50/20",
                textColor: "text-amber-900"
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/30 p-5 rounded-2xl shadow-md hover:scale-105 transition-all duration-300`}
              >
                <div className="text-2xl mb-2">{card.emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2d4a5a]/60 mb-1">{card.label}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                <p className="text-xs text-[#2d4a5a]/60 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Top Artworks + Top Buyers */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 transition-all duration-700 delay-500 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

            {/* Top Selling */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-[#1a3040] mb-4 flex items-center gap-2">
                🎨 <span>Top Selling Artworks</span>
              </h2>
              <div className="space-y-1">
                {dashboard.orders?.length === 0 && (
                  <p className="text-sm text-[#2d4a5a]/50">No sales yet</p>
                )}
                {dashboard.orders?.map((art, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-white/20 hover:bg-white/20 px-2 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2d4a5a]/40 w-5">#{i + 1}</span>
                      <span className="text-sm font-medium text-[#1a3040]">{art.artworkTitle}</span>
                    </div>
                    <span className="text-sm font-bold text-[#1a3040] bg-white/30 px-3 py-0.5 rounded-full">
                      ₹{art.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Buyers */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-[#1a3040] mb-4 flex items-center gap-2">
                👤 <span>Top Buyers</span>
              </h2>
              <div className="space-y-1">
                {dashboard.orders?.length === 0 && (
                  <p className="text-sm text-[#2d4a5a]/50">No buyers yet</p>
                )}
                {dashboard.orders?.map((user, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 border-b border-white/20 hover:bg-white/20 px-2 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1a3040]/20 flex items-center justify-center text-xs font-bold text-[#1a3040]">
                        {user.buyerName?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#1a3040]">{user.buyerName}</span>
                    </div>
                    <span className="text-sm font-bold text-[#185FA5]">₹{user.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-10 shadow-lg transition-all duration-700 delay-[600ms] ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h2 className="text-lg font-bold text-[#1a3040] mb-4">📦 Recent Activity</h2>
            <ul className="space-y-2">
              {dashboard.orders?.length === 0 && (
                <li className="text-sm text-[#2d4a5a]/50">No recent activity</li>
              )}
              {dashboard.orders?.map((order, i) => (
                <li
                  key={order.orderId}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#2d4a5a]/50">#{order.orderId}</span>
                    <span className="text-sm text-[#1a3040]">{order.artworkTitle}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-emerald-100/60 text-emerald-800"
                      : order.status === "Pending"
                      ? "bg-amber-100/60 text-amber-800"
                      : "bg-blue-100/60 text-blue-800"
                  }`}>
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;