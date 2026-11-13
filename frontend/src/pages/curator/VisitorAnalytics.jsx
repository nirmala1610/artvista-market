import { useState, useEffect } from "react";
import SideBar from "./CuratorSideBar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const VisitorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch("http://localhost:8080/api/exhibitions/visitor", {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center font-['Jost'] text-white">
        <div className="text-xl animate-pulse text-cyan-400">Loading Analytics...</div>
      </div>
    );
  }

const handleExportPDF = () => {
  if (!analyticsData) return;

  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();

  // --- 1. TITLE & HEADER BRANDING ---
  doc.setFillColor(9, 13, 22); 
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(34, 211, 238); 
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("AUDIENCE INTELLIGENCE REPORT", 14, 20);
  
  doc.setTextColor(156, 163, 175); 
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${timestamp}`, 14, 30);

  // --- 2. OVERVIEW METRICS GRID ---
  doc.setTextColor(0, 0, 0);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Core Exhibition Metrics", 14, 55);

  // CHANGED: Called autoTable(doc, ...) directly here
  autoTable(doc, {
    startY: 60,
    theme: "striped",
    headStyles: { fillColor: [6, 182, 212], textColor: [255, 255, 255], fontStyle: "bold" },
    head: [["Metric Parameter", "Current Performance Stature"]],
    body: [
      ["Total Unique Visitors", `${totalVisitors} (${visitorGrowth || 'Stable'})`],
      ["Average Session Retention", avgSessionTime],
      ["Most Viewed Content Category", `${mostViewedCategory} (${categoryGrowth || 'N/A'})`],
      ["Exhibition Conversion Rate", conversionRate]
    ],
    styles: { font: "Helvetica", fontSize: 10, cellPadding: 4 }
  });

  // --- 3. HOURLY TRAFFIC SNAPSHOT TABLE ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Peak Traffic Densities (Hourly Breakdown)", 14, doc.lastAutoTable.finalY + 15);

  const trafficBody = hourlyTraffic.map(item => {
    let displayHour = "12 AM";
    if (item.hour === 12) displayHour = "12 PM";
    else if (item.hour > 12) displayHour = `${item.hour - 12} PM`;
    else if (item.hour > 0) displayHour = `${item.hour} AM`;
    return [displayHour, `${item.count} Active Collectors`];
  });

  // CHANGED: Called autoTable(doc, ...) directly here
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, 
    head: [["Time Window", "Collector Volume Count"]],
    body: trafficBody.length ? trafficBody : [["No data available", "0"]],
    styles: { fontSize: 9 }
  });

  // --- 4. TOP ARTWORKS CATALOG MATRIX ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Top Performing Creative Assets", 14, doc.lastAutoTable.finalY + 15);

  const artworkBody = topArtworks.map(art => [
    art.title,
    art.category,
    art.year || "N/A",
    art.orientation || "Standard"
  ]);

  // CHANGED: Called autoTable(doc, ...) directly here
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    theme: "striped",
    headStyles: { fillColor: [147, 51, 234], textColor: [255, 255, 255] }, 
    head: [["Artwork Title", "Category Classification", "Year", "Display Layout/Orientation"]],
    body: artworkBody.length ? artworkBody : [["No artwork interactions recorded", "-", "-", "-"]],
    styles: { fontSize: 9 }
  });

  doc.save(`Exhibition_Audience_Report_${Date.now()}.pdf`);
};

  const {
    totalVisitors = "0",
    visitorGrowth = "",
    avgSessionTime = "0m",
    mostViewedCategory = "N/A",
    categoryGrowth = "",
    conversionRate = "0%",
    topArtworks = [],
    hourlyTraffic = [],
    heatmapZones = []
  } = analyticsData || {};

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">

      {/* BACKGROUND GLOWS */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      {/* SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 relative z-10 overflow-y-auto h-screen">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-3">
              Audience Intelligence
            </p>
            <h1 className="text-5xl font-black leading-tight">
              Visitor Analytics
            </h1>
            <p className="text-gray-400 mt-4 text-lg max-w-3xl">
              Monitor collector behavior, discover trending artworks, and understand how visitors interact with exhibitions.
            </p>
          </div>
          <button 
          onClick={handleExportPDF}
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition font-semibold shadow-lg shadow-cyan-500/20">
            Export Report
          </button>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-2xl hover:border-cyan-400/20 transition">
            <p className="text-gray-400 mb-3">Total Visitors</p>
            <h2 className="text-5xl font-black text-white">{totalVisitors}</h2>
            <p className="text-cyan-300 mt-3 text-sm">{visitorGrowth}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-2xl hover:border-cyan-400/20 transition">
            <p className="text-gray-400 mb-3">Avg Session Time</p>
            <h2 className="text-5xl font-black text-cyan-300">{avgSessionTime}</h2>
            <p className="text-gray-500 mt-3 text-sm">Per collector visit</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-2xl hover:border-cyan-400/20 transition">
            <p className="text-gray-400 mb-3">Most Viewed Category</p>
            <h2 className="text-4xl font-black text-purple-300">{mostViewedCategory}</h2>
            <p className="text-gray-500 mt-3 text-sm">{categoryGrowth}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-2xl hover:border-cyan-400/20 transition">
            <p className="text-gray-400 mb-3">Conversion Rate</p>
            <h2 className="text-5xl font-black text-green-400">{conversionRate}</h2>
            <p className="text-green-300 mt-3 text-sm">Artwork purchase success</p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
          
          {/* TRAFFIC GRAPH */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Peak Visit Time</h2>
                <p className="text-gray-400 mt-2">Most active collector hours.</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/20">Live</span>
            </div>

            <div className="h-[300px] w-full rounded-3xl bg-white/5 border border-white/10 p-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(hour) => {
                      if (hour === 0) return "12 AM";
                      if (hour === 12) return "12 PM";
                      return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                    }} 
                  />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "16px", color: "#fff", fontFamily: "Jost" }} 
                    itemStyle={{ color: "#22d3ee" }}
                    labelFormatter={(hour) => {
                      if (hour === 0) return "Time: 12:00 AM";
                      if (hour === 12) return "Time: 12:00 PM";
                      return hour > 12 ? `Time: ${hour - 12}:00 PM` : `Time: ${hour}:00 AM`;
                    }}
                  />
                  <Area type="monotone" dataKey="count" name="Logs" stroke="#06b6d4" strokeWidth={3} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TRAFFIC SOURCES */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Traffic Sources</h2>
              <p className="text-gray-400 mt-2">Discover where visitors come from.</p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between mb-2">
                  <p>Instagram</p>
                  <p className="text-cyan-300">48%</p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[48%] h-full bg-cyan-400 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p>Google Search</p>
                  <p className="text-blue-300">29%</p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[29%] h-full bg-blue-400 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p>Direct Traffic</p>
                  <p className="text-purple-300">15%</p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-purple-400 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p>Art Blogs</p>
                  <p className="text-pink-300">8%</p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[8%] h-full bg-pink-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HEATMAP + TOP ARTWORKS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
          
          {/* INTERACTION HEATMAP */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Feature Engagement Heatmap</h2>
              <p className="text-gray-400 mt-2">Track user focal zones based on database actions.</p>
            </div>

            <div className="h-[350px] rounded-3xl border border-white/10 bg-slate-950/80 relative overflow-hidden">
              {heatmapZones.map((zone, idx) => {
                const glowColor = zone.intensity > 40 ? 'bg-red-500' : zone.intensity > 20 ? 'bg-yellow-400' : 'bg-cyan-400';
                
                return (
                  <div
                    key={idx}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                    style={{ left: zone.leftOffset, top: zone.topOffset }}
                  >
                    <div 
                      className={`absolute rounded-full blur-2xl opacity-40 animate-pulse ${glowColor}`}
                      style={{ 
                        width: `${Math.max(zone.intensity * 2, 40)}px`, 
                        height: `${Math.max(zone.intensity * 2, 40)}px` 
                      }}
                    ></div>
                    
                    <div className={`w-3 h-3 rounded-full relative z-10 ${glowColor}`}></div>
                    <span className="text-[10px] text-gray-400 mt-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm relative z-10">
                      {zone.zoneName} ({zone.intensity}%)
                    </span>
                  </div>
                );
              })}

              <p className="absolute bottom-4 left-4 text-xs text-gray-500">
                * Highlights indicate density of user saves, logs, bookings, and cart additions.
              </p>
            </div>
          </div>

          {/* TOP ARTWORKS */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Top Performing Artworks</h2>
              <p className="text-gray-400 mt-2">Most clicked and saved creations.</p>
            </div>
            <div className="space-y-5">
              {topArtworks.map((art, idx) => (
                <div key={art.id || idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/20 transition">
                  <div className="flex items-center gap-4">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-16 h-16 rounded-2xl object-cover" // FIXED: w-18/h-18 swapped for standard w-16/h-16 layout boundary
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{art.title}</h3>
                      <p className="text-gray-400 text-sm">{art.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{art.year}</p> {/* FIXED: Removed non-Tailwind reference art.edition style mapping */}
                    <p className="text-gray-500 text-sm">{art.orientation}</p>
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

export default VisitorAnalytics;