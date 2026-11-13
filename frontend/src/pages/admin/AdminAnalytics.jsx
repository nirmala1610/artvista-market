import { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  FileBarChart2,
  TrendingUp,
  Users,
  Palette,
  IndianRupee,
  Download,
  Eye,
  CalendarDays,
  AlertTriangle,
  Sparkles,
  PieChart,
} from "lucide-react";

const statusStyles = {
  Generated:
    "bg-green-500/15 text-green-300 border border-green-500/20",
  Processing:
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  Failed:
    "bg-red-500/15 text-red-300 border border-red-500/20",
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {

      const response = await fetch(
        "http://localhost:8080/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setAnalytics(data);
      setWeeklyStats(data.weekly);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const downloadAnalyticsPdf = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/admin/download/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "artvista_analytics_report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">

      {/* Background Glow */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>

      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 p-8 relative z-10 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-5xl font-black font-['Poller_One'] tracking-wide">
              REPORTS & ANALYTICS
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Platform insights, financial summaries & moderation analytics.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />

            <span className="text-sm text-gray-300">
              Real-Time Analytics Enabled
            </span>
          </div>
        <button
            onClick={downloadAnalyticsPdf}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:scale-105 transition"
            >
            Download Analytics PDF
            </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">
                  Revenue
                </p>

                <h2 className="text-5xl font-black text-green-400">
                  ₹{analytics?.totalRevenue?.toLocaleString()}
                </h2>
              </div>

              <IndianRupee className="text-green-400" size={32} />
            </div>

            <div className="mt-5 text-green-300 text-sm">
              +18% this month
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">
                  Active Users
                </p>

                <h2 className="text-5xl font-black text-cyan-300">
                  {analytics?.totalUsers}
                </h2>
              </div>

              <Users className="text-cyan-300" size={32} />
            </div>

            <div className="mt-5 text-cyan-300 text-sm">
              Community growing
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">
                  Artworks
                </p>

                <h2 className="text-5xl font-black text-yellow-300">
                  {analytics?.totalArtworks}
                </h2>
              </div>

              <Palette className="text-yellow-300" size={32} />
            </div>

            <div className="mt-5 text-yellow-300 text-sm">
              Uploaded globally
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">
                  Flagged Reports
                </p>

                <h2 className="text-5xl font-black text-red-400">
                  {analytics?.activeDisputes}
                </h2>
              </div>

              <AlertTriangle className="text-red-400" size={32} />
            </div>

            <div className="mt-5 text-red-300 text-sm">
              Requires attention
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* Performance Card */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">

            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-3xl font-bold">
                  Platform Performance
                </h2>

                <p className="text-gray-400 mt-2">
                  Weekly analytics & engagement overview.
                </p>
              </div>

              <TrendingUp className="text-cyan-300" size={30} />
            </div>

            {/* Fake Graph */}
            <div className="relative h-[300px] rounded-[28px] overflow-hidden bg-gradient-to-b from-cyan-500/10 to-transparent border border-white/5">

          <div className="absolute inset-0 flex items-end justify-evenly px-8 pb-8">

            {weeklyStats.map((item, index) => (

              <div
                key={index}
                className="w-10 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-400 hover:scale-105 transition relative group"
                style={{
                  height: `${(item.value / 1000) * 100}%`,
                }}
              >

                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-black px-2 py-1 rounded">
                  {item.value}
                </div>

              </div>

            ))}

          </div>

            <div className="absolute bottom-3 left-0 w-full flex justify-evenly text-gray-500 text-sm">

              {weeklyStats.map((item, index) => (
                <span key={index}>
                  {item.day}
                </span>
              ))}

            </div>
            </div>
          </div>

{/* Quick Summary */}
<div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">

  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-2xl font-bold">
        Quick Summary
      </h2>

      <p className="text-gray-400 mt-2 text-sm">
        Current platform performance overview
      </p>
    </div>

    <CalendarDays className="text-cyan-300" size={28} />
  </div>

  <div className="space-y-5">

    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-cyan-300 font-semibold">
        Highest Revenue Day
      </p>

      <p className="text-gray-300 text-sm mt-2">
        Saturday recorded the highest sales this week.
      </p>
    </div>

    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-yellow-300 font-semibold">
        Most Active Category
      </p>

      <p className="text-gray-300 text-sm mt-2">
        Digital Art had the most uploads and purchases.
      </p>
    </div>

    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-green-300 font-semibold">
        User Engagement
      </p>

      <p className="text-gray-300 text-sm mt-2">
        Daily active users increased compared to last week.
      </p>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;