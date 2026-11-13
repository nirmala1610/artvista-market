import { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";
import {
  Search,
  Filter,
  FileBarChart2,
  Users,
  Download,
  Eye,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  ShieldAlert
} from "lucide-react";

// Updated styles reflecting live moderation ticket statuses
const statusStyles = {
  Pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  Investigating: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
  Resolved: "bg-green-500/15 text-green-300 border border-green-500/20",
  Dismissed: "bg-gray-500/15 text-gray-400 border border-white/10",
};

const Reports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null); // For handling the view/action modal
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
    fetchReports();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/get-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Trigger an updated status action back to the database
  const handleAction = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Optimistically update state locally
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
        );
        setSelectedReport(null); // Close modal on success
        fetchAnalytics(); // Refresh upper metrics
      }
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const downloadReport = (id) => {
    window.open(`http://localhost:8080/api/admin/reports/download/${id}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">
      {/* Background Glows */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 p-8 relative z-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black font-['Poller_One'] tracking-wide">
              REPORT MODERATION HUB
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Review platform violations, manage user reports, and resolve active disputes.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />
            <span className="text-sm text-gray-300">Live Ticket Queue</span>
          </div>
        </div>

        {/* Actionable Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Total Issues Filed</p>
                <h2 className="text-5xl font-black text-white">{reports.length}</h2>
              </div>
              <ShieldAlert className="text-cyan-400" size={32} />
            </div>
            <div className="mt-5 text-gray-400 text-sm">Lifetime incoming queue</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Pending Action</p>
                <h2 className="text-5xl font-black text-yellow-400">
                  {reports.filter((r) => r.status === "Pending").length}
                </h2>
              </div>
              <Clock className="text-yellow-400" size={32} />
            </div>
            <div className="mt-5 text-yellow-300 text-sm">Requires initial review</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Active Disputes</p>
                <h2 className="text-5xl font-black text-red-400">{analytics?.activeDisputes || 0}</h2>
              </div>
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            <div className="mt-5 text-red-300 text-sm">Critical financial disputes</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-3">Resolved Tickets</p>
                <h2 className="text-5xl font-black text-green-400">
                  {reports.filter((r) => r.status === "Resolved").length}
                </h2>
              </div>
              <CheckCircle2 className="text-green-400" size={32} />
            </div>
            <div className="mt-5 text-green-300 text-sm">Successfully mitigated</div>
          </div>
        </div>

        {/* Main Work Desk View / Reports Table */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Incoming Abuse & Violation Reports</h2>
              <p className="text-gray-400 mt-2">Investigate dynamic complaints sent directly from system users.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-[260px]">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID or Author..."
                  className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
              </div>

              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* Table Header Structure */}
          <div className="hidden xl:grid grid-cols-6 text-gray-400 text-sm border-b border-white/10 pb-5 px-2">
            <p>Ticket ID</p>
            <p>Issue Title</p>
            <p>Infraction Category</p>
            <p>Reported By</p>
            <p>Status</p>
            <p className="text-right">Manage Case</p>
          </div>

          {/* Dynamic Reports Queue */}
          <div className="mt-3 space-y-5">
            {reports.map((report, index) => (
              <div
                key={index}
                className="grid xl:grid-cols-6 gap-5 items-center bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* ID */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/10 text-sm">
                    <FileBarChart2 size={14} />
                    #{report.id}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">{report.date || "Just now"}</p>
                </div>

                {/* Title */}
                <div>
                  <p className="text-white font-medium truncate max-w-[180px]">{report.title}</p>
                  <p className="text-gray-400 text-sm">User Submission</p>
                </div>

                {/* Category */}
                <div>
                  <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/10 text-xs font-semibold">
                    {report.category || "General"}
                  </span>
                </div>

                {/* Sender Context */}
                <div>
                  <p className="text-white font-medium">{report.generatedBy}</p>
                  <p className="text-gray-500 text-xs">Platform Member</p>
                </div>

                {/* Ticket Status Badge */}
                <div>
                  <span className={`px-4 py-2 rounded-full text-xs font-medium ${statusStyles[report.status || "Pending"]}`}>
                    {report.status || "Pending"}
                  </span>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                  >
                    <Eye size={16} />
                    Review
                  </button>

                  <button
                    onClick={() => downloadReport(report.id)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 transition"
                    title="Download Metadata Details"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION & VIEW MODAL CONTAINER */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full text-xs font-semibold">
                Ticket #{selectedReport.id}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${statusStyles[selectedReport.status || "Pending"]}`}>
                {selectedReport.status || "Pending"}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white">{selectedReport.title}</h3>
            <p className="text-sm text-purple-300 mb-6 font-medium">Category: {selectedReport.category || "General Issue"}</p>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6 max-h-[160px] overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Complainant Statement</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedReport.description || "No supplemental details provided by the reporting user. Please review attachments or reach out to user accounts directly for further verification criteria."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-8 border-t border-b border-white/5 py-4">
              <div>
                <span className="block font-medium text-gray-500">FILED BY</span>
                <span className="text-white text-sm">{selectedReport.generatedBy}</span>
              </div>
              <div>
                <span className="block font-medium text-gray-500">SUBMITTED ON</span>
                <span className="text-white text-sm">{selectedReport.date || "N/A"}</span>
              </div>
            </div>

            {/* Moderation Administrative Actions Grid */}
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3">Execute Resolution Action</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleAction(selectedReport.id, "Investigating")}
                  className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-xl font-medium text-xs text-purple-300 transition"
                >
                  Investigate
                </button>
                <button
                  onClick={() => handleAction(selectedReport.id, "Resolved")}
                  className="px-4 py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 rounded-xl font-medium text-xs text-green-300 transition"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleAction(selectedReport.id, "Dismissed")}
                  className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-medium text-xs text-gray-300 transition"
                >
                  Dismiss Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;