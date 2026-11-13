import SideBar from "./admin/AdminSideBar";
import { useState,useEffect } from "react";
import {
  Users,
  Palette,
  Image,
  IndianRupee,
  TrendingUp,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
         
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setDashboardData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  
  const stats = dashboardData
  ? [
      {
        title: "Total Users",
        value: dashboardData.totalUsers,
        icon: Users,
        color: "text-cyan-300",
      },
      {
        title: "Artists",
        value: dashboardData.totalArtists,
        icon: Palette,
        color: "text-pink-300",
      },
      {
        title: "Artworks",
        value: dashboardData.totalArtworks,
        icon: Image,
        color: "text-yellow-300",
      },
      {
        title: "Revenue",
        value: `₹${dashboardData.totalRevenue}`,
        icon: IndianRupee,
        color: "text-green-400",
      },
    ]
  : [];
      const revenueData = dashboardData?.revenueAnalytics?.map(item => ({
      month: item.month,
      revenue: item.revenue,
    })) || [];
    const artworkData = dashboardData?.artworkCategories?.map(item => ({
      name: item.category,
      value: item.count,
    })) || [];
    const recentActivities = dashboardData?.recentActivities || [];

    if (loading) {
      return (
       <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-cyan-400"></div>
      </div>
      );
    }    

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
              ARTVISTA ADMIN
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Monitor platform growth, creators, artworks & analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-xl">
            <Activity className="text-cyan-300" />
            <span className="text-sm text-gray-300">
              System Active
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-2xl hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 mb-3">
                      {item.title}
                    </p>

                    <h2 className={`text-5xl font-black ${item.color}`}>
                      {item.value}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-green-400">
                  <TrendingUp size={16} />
                  +12.5% this month
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-[30px] p-6 backdrop-blur-2xl">
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Revenue Analytics
              </h2>

              <p className="text-gray-400 mt-1">
                Monthly platform revenue growth
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00eeff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#77d8ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                    stroke="#aaa4a4"
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#262900"
                    fillOpacity={1}
                    fill="url(#da2222)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

<div className="bg-white/5 border border-white/10 rounded-[30px] p-6 backdrop-blur-2xl">
  <div className="mb-6">
    <h2 className="text-2xl font-bold">Artwork Categories</h2>
    <p className="text-gray-400 mt-1">Distribution overview</p>
  </div>

  <div className="h-[320px] flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        <Pie
          data={artworkData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {artworkData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#grad${(index % 2) + 1})`}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            borderRadius: "12px",
            border: "1px solid #374151",
            color: "#fff",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Recent Activity
            </h2>

            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl my-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 my-3"></div>

                  <p className="text-gray-300">
                    {activity.message}
                  </p>
                </div>

                <span className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Panel */}
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 backdrop-blur-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Platform Progress
            </h2>

            <div className="space-y-6">

              {[
                { label: "Artist Verification", value: 80 },
                { label: "Artwork Uploads", value: 65 },
                { label: "Premium Users", value: 45 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-300">
                      {item.label}
                    </p>

                    <p className="text-cyan-300 font-semibold">
                      {item.value}%
                    </p>
                  </div>

                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;