import { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Scale,
  Sparkles,
  MessageSquareWarning,
  X,
  User,
  FileText,
} from "lucide-react";

const priorityStyles = {
  Low: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
  Medium: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  High: "bg-red-500/15 text-red-300 border border-red-500/20",
  Critical: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
};

const statusStyles = {
  OPEN: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  INVESTIGATING: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20",
  ESCALATED: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
  RESOLVED: "bg-green-500/15 text-green-300 border border-green-500/20",
};

const statusIcons = {
  OPEN: <Clock3 size={15} />,
  INVESTIGATING: <ShieldAlert size={15} />,
  ESCALATED: <AlertTriangle size={15} />,
  RESOLVED: <CheckCircle2 size={15} />,
};

const Disputes = () => {

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDispute, setSelectedDispute] = useState(null); // Modal popup handler
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState({
  openCases: 0,
  resolvedCases: 0,
  highRiskCases: 0,
  refundAmount: 0,
});

 const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (token) {
      fetchDisputes();
      fetchStats();
    }
  }, [token]);

  const fetchDisputes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/disputes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch disputes");
      }

      const data = await response.json();
      setDisputes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchStats = async () => {
  const response = await fetch(
    "http://localhost:8080/api/reports/dispute-stats",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  setStats(data);
};

  const updateDisputeStatus = async (id, action) => {
    try {
      await fetch(
        `http://localhost:8080/api/admin/update-dispute/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Close the modal if open to refresh user view state context safely
      setSelectedDispute(null);
      fetchDisputes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.id?.toString().includes(search) ||
      dispute.artistName?.toLowerCase().includes(search.toLowerCase()) ||
      dispute.artworkTitle?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      dispute.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
  const paginatedDisputes = filteredDisputes.slice(
  startIndex,
  endIndex
);
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
              DISPUTE CENTER
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Manage complaints, copyright claims & transaction conflicts.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />
            <span className="text-sm text-gray-300">Risk Detection Enabled</span>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">Open Cases</p>
            <h2 className="text-5xl font-black text-yellow-300">{stats.openCases}</h2>
            <div className="mt-5 text-yellow-300 text-sm">Awaiting review</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">Resolved Cases</p>
            <h2 className="text-5xl font-black text-green-400">{stats.resolvedCases}</h2>
            <div className="mt-5 text-green-300 text-sm">Successfully handled</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">High Risk</p>
            <h2 className="text-5xl font-black text-red-400">{stats.highRiskCases}</h2>
            <div className="mt-5 text-red-300 text-sm">Immediate action needed</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">Refund Requests</p>
            <h2 className="text-5xl font-black text-cyan-300">₹{stats.refundAmount}</h2>
            <div className="mt-5 text-cyan-300 text-sm">Pending reimbursements</div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Active Dispute Cases</h2>
              <p className="text-gray-400 mt-2">
                Investigate platform disputes and protect marketplace trust.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-[260px]">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search disputes..."
                  className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Filter size={18} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/50"
                >
                  <option value="ALL">All</option>
                  <option value="OPEN">Open</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="REFUND">Refund</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </button>
            </div>
          </div>

          {/* Grid Header */}
          <div className="hidden xl:grid grid-cols-6 text-gray-400 text-sm border-b border-white/10 pb-5 px-2">
            <p>Case ID</p>
            <p>Artwork</p>
            <p>Artist</p>
            <p>Reason</p>
            <p>Status</p>
            <p className="text-right">Actions</p>
          </div>

          {/* Dispute Cards */}
          <div className="mt-3 space-y-5">
            {loading ? (
              <p className="text-center text-gray-400 py-10">Loading cases...</p>
            ) : filteredDisputes.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No disputes found.</p>
            ) : (
              paginatedDisputes.map((dispute, index) => (
                <div
                  key={index}
                  className="grid xl:grid-cols-6 gap-5 items-center bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Case ID */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/10 text-sm">
                      <Scale size={14} />
                      Case #{dispute.id}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Artwork info */}
                  <div>
                    <p className="text-white font-medium">{dispute.artworkTitle}</p>
                    <p className="text-gray-400 text-sm">Order #{dispute.orderId}</p>
                  </div>

                  {/* Artist */}
                  <div>
                    <p className="text-white font-medium">{dispute.artistName}</p>
                    <p className="text-gray-400 text-sm">Creator Account</p>
                  </div>

                  {/* Reason */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-300 border border-red-500/10 text-sm whitespace-normal break-words">
                      <MessageSquareWarning size={14} className="shrink-0" />
                      {dispute.reason?.replaceAll("_", " ")}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                        statusStyles[dispute.status] || "bg-white/10 text-white"
                      }`}
                    >
                      {statusIcons[dispute.status]}
                      {dispute.status}
                    </span>
                  </div>

                  {/* Context Actions */}
                  <div className="flex justify-end gap-2 flex-wrap">
                    <button
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      View
                    </button>

                    {dispute.status === "OPEN" && (
                      <button
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
                        onClick={() => updateDisputeStatus(dispute.id, "UNDER REVIEW")}
                      >
                        Investigate
                      </button>
                    )}

                    {dispute.status === "UNDER REVIEW" && (
                      <>
                        <button
                          className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
                          onClick={() => updateDisputeStatus(dispute.id, "REFUND")}
                        >
                          Refund
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                          onClick={() => updateDisputeStatus(dispute.id, "REJECT")}
                        >
                          Reject
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-semibold rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
                          onClick={() => updateDisputeStatus(dispute.id, "ESCALATE")}
                        >
                          Escalate
                        </button>
                      </>
                    )}

                    {dispute.status === "REFUND" && (
                      <button
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
                        onClick={() => updateDisputeStatus(dispute.id, "RESOLVED")}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-10 pt-6 border-t border-white/10 gap-5">
            <p className="text-gray-400 text-sm">
              Showing 1 to {filteredDisputes.length} of {disputes.length} active disputes
            </p>

            <div className="flex items-center gap-7">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
             
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW DISPUTE MODAL POPUP */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#0D111A] border border-white/10 rounded-[32px] w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Scale className="text-cyan-400" size={22} />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Dispute Case Details
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: #{selectedDispute.id} &bull; Registered on{" "}
                    {new Date(selectedDispute.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Top Row Overview Badge */}
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[selectedDispute.status]}`}>
                  {statusIcons[selectedDispute.status]}
                  {selectedDispute.status}
                </span>
                {selectedDispute.priority && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityStyles[selectedDispute.priority]}`}>
                    {selectedDispute.priority} Priority
                  </span>
                )}
                <span className="px-3 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-full text-xs">
                  {selectedDispute.reason?.replaceAll("_", " ")}
                </span>
              </div>

              {/* Data Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <User size={18} className="text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">User Info</p>
                    <p className="text-white text-sm font-medium mt-1">User ID: #{selectedDispute.userId}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <User size={18} className="text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Artist / Creator</p>
                    <p className="text-white text-sm font-medium mt-1">{selectedDispute.artistName}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <FileText size={18} className="text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Artwork Tracked</p>
                    <p className="text-white text-sm font-medium mt-1">{selectedDispute.artworkTitle}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                  <FileText size={18} className="text-green-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order ID Reference</p>
                    <p className="text-white text-sm font-medium mt-1">#{selectedDispute.orderId}</p>
                  </div>
                </div>
              </div>

              {/* Dispute Description */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Statement / Description</p>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{selectedDispute.description || "No description provided."}"
                </p>
              </div>

              {/* Evidence Upload Image Preview Box */}
              {selectedDispute.evidence && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Evidence Documentation</p>
                  <div className="relative group border border-white/10 rounded-2xl overflow-hidden bg-black/40 max-h-60 flex justify-center items-center">
                    <img
                      src={selectedDispute.evidence}
                      alt="Dispute Attachment Evidence File"
                      className="object-contain max-h-60 w-full"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                      <a
                        href={selectedDispute.evidence}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium transition"
                      >
                        <Eye size={16} /> Open Image Link
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Operational Action Tray */}
            <div className="p-6 border-t border-white/10 bg-white/[0.01] flex items-center justify-end gap-3">
              {selectedDispute.status === "OPEN" && (
                <button
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 font-semibold transition text-sm"
                  onClick={() => updateDisputeStatus(selectedDispute.id, "INVESTIGATE")}
                >
                  Start Investigation
                </button>
              )}
              {selectedDispute.status === "INVESTIGATING" && (
                <>
                  <button
                    className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold transition text-sm"
                    onClick={() => updateDisputeStatus(selectedDispute.id, "REFUND")}
                  >
                    Approve Refund
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold transition text-sm"
                    onClick={() => updateDisputeStatus(selectedDispute.id, "REJECT")}
                  >
                    Reject Claim
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedDispute(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-gray-400"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Disputes;