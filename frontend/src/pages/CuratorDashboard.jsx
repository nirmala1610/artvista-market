import { useEffect, useState } from "react";
import SideBar from "./curator/CuratorSideBar";
import {
  FaUsers,
  FaImages,
  FaFire,
  FaChartLine
} from "react-icons/fa";

const CuratorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/curator/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch exhibitions");
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format timestamps into "X mins ago" or clean times cleanly
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center text-white font-['Jost']">
        <div className="text-xl font-medium tracking-wider animate-pulse">Loading Artvista Universe...</div>
      </div>
    );
  }

  // Find the highest revenue configuration for dynamic chart-bar scaling limits safely 
  const maxRevenue = data.analytics.length > 0 
    ? Math.max(...data.analytics.map(o => o.revenue)) 
    : 100;

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <div className="flex-1 relative z-10 p-10 overflow-y-auto">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black leading-tight">ARTVISTA CURATOR</h1>
            <p className="text-gray-400 mt-3 text-lg">
              Monitor exhibitions, audience engagement, and featured collections.
            </p>
          </div>

          {/* LIVE STATUS */}
          <div className="bg-white/5 border border-cyan-400/20 rounded-3xl px-6 py-4 backdrop-blur-2xl flex items-center gap-4 shadow-lg shadow-cyan-500/10">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm text-gray-400">Live Channels Connected</p>
              <h2 className="text-2xl font-bold">Active Database</h2>
            </div>
          </div>
        </div>

        {/* STATS GRID - Configured into 3 columns dynamically */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* CARD 1 */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-7 backdrop-blur-3xl hover:border-cyan-400/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Total Sold Tickets / Visitors</p>
                <h1 className="text-5xl font-black">{data.totalVisitors.toLocaleString()}</h1>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <FaUsers className="text-cyan-300 text-3xl" />
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-7 backdrop-blur-3xl hover:border-blue-400/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Active Exhibitions</p>
                <h1 className="text-5xl font-black text-cyan-300">{data.activeExhibitions}</h1>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <FaImages className="text-blue-300 text-3xl" />
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-7 backdrop-blur-3xl hover:border-orange-400/20 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Trending Exhibition</p>
                <h1 className="text-2xl font-black text-orange-300 truncate max-w-[180px]">
                  {data.trendingCollection}
                </h1>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <FaFire className="text-orange-300 text-3xl" />
              </div>
            </div>
          </div>

        </div>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">

          {/* ANALYTICS (EXHIBITION CHARTS) */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">Exhibition Performance</h2>
                <p className="text-gray-400 mt-2">Revenue distribution scale mapped across data indices.</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <FaChartLine className="text-cyan-300 text-2xl" />
              </div>
            </div>

            {/* BAR CHART CONFIGURATIONS */}
            <div className="h-[320px] rounded-[28px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-end justify-around px-4 pb-8 pt-4">
              {data.analytics.map((item, index) => {
                // Determine layout height dynamically using percentages
                const computedHeight = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 20;
                return (
                  <div key={index} className="flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-slate-900 border border-white/20 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                      <div>Tickets: {item.ticketsSold}</div>
                      <div className="text-cyan-300">₹{item.revenue}</div>
                    </div>
                    
                    <div 
                      className="w-10 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-xl transition-all duration-500 shadow-lg shadow-cyan-500/20 hover:brightness-125"
                      style={{ height: `${Math.max(computedHeight, 15)}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-2 max-w-[65px] truncate text-center">
                      {item.exhibitionTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LIVE ACTIVITY ACTION FEED */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Live Updates</h2>
                <p className="text-gray-400 mt-2 text-sm">Real-time repository changes.</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="flex flex-col gap-6">
              {data.liveActivities.length > 0 ? (
                data.liveActivities.map((activity, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition">
                    <p className="text-sm text-gray-300">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTime(activity.createdAt)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-8">No recent lifecycle shifts recorded.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CuratorDashboard;