import React, { useEffect, useState, useRef } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
import { toast } from 'sonner';
import { X, Scale, User, FileText, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

const DisputeCenter = () => {
  const token = localStorage.getItem('token');

  // Database State Reference Tracking
  const orderDropdownRef = useRef(null);

  // Form Processing States
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [disputeType, setDisputeType] = useState("REFUND_REQUEST"); // Maps onto your backend 'reason'
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState(""); // Optional Cloudinary string asset url
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null); // Controls the view pop-up modal

  // Real Database Core Arrays
  const [dbOrders, setDbOrders] = useState([]); // Dynamic items loaded straight from your Orders table
  const [disputes, setDisputes] = useState([]); // Saved records loaded straight from your Disputes table

  // 1. Fetch user's real purchases from your core database order records
  const fetchCustomerOrdersFromDB = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDbOrders(data); // Expecting array with structure: [{ id, orderNumber, artistName, artworkTitle }]
      }
    } catch (error) {
      console.error("Error reading platform database order items:", error);
    }
  };

  // 2. Fetch all historical cases tracking back to this client user
  const fetchDisputes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/get-disputes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDisputes(data); // Maps straight to your fields
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  };

  useEffect(() => {
    fetchCustomerOrdersFromDB();
    fetchDisputes();
  }, []);

  // Sync Artist name automatically when an order is picked
  const handleOrderChange = (e) => {
    const orderIdValue = e.target.value;
    setSelectedOrderId(orderIdValue);

    // Scan real orders list array to grab corresponding information data
    const match = dbOrders.find(o => String(o.orderId) === String(orderIdValue) || String(o.orderNumber) === String(orderIdValue));
    if (match) {
      setArtistName(match.artistName);
    } else {
      setArtistName("");
    }
  };

  const handleEvidenceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Evidence screenshot must be under 5MB");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG images are accepted");
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setEvidence(imageUrl);
      toast.success("Dispute evidence attached successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload evidence asset");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDispute = async () => {
    if (!selectedOrderId || !description) {
      toast.error("Please fill out all required configuration fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reports/add-dispute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: selectedOrderId,
          artistName: artistName,
          reason: disputeType,
          priority: priority, 
          description: description,
          evidence: evidence
        }),
      });

      if (!response.ok) throw new Error("Server error handling request");

      toast.success("Dispute file registered cleanly");
      
      // Clear states cleanly
      setSelectedOrderId("");
      setArtistName("");
      setDisputeType("REFUND_REQUEST");
      setPriority("MEDIUM");
      setDescription("");
      setEvidence("");

      const fileInputElement = document.getElementById("dispute-file-input");
      if (fileInputElement) fileInputElement.value = "";

      fetchDisputes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit dispute file");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-['Jost'] relative overflow-x-hidden">
      {/* Visual Ambient Glows */}
      <div className="absolute top-24 -left-40 w-[450px] h-[450px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[450px] h-[450px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <CustomerHeader />

      <div className="flex relative z-10">
        <CustomerSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header Layout */}
          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-tight text-purple-500">DISPUTE CENTER</h1>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl">
              Raise a dispute regarding purchases, refunds, commissions, or artwork ownership issues safely.
            </p>
          </div>

          {/* Form Processing Box */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Create New Dispute</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Purchase Order Dropdown */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Purchase Order</label>
                <select
                  value={selectedOrderId}
                  onChange={handleOrderChange}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none transition focus:border-purple-500/50"
                >
                  <option value="">-- Select Order --</option>
                  {dbOrders.map((order) => (
                    <option key={order.orderId || order.orderNumber} value={order.orderId || order.orderNumber}>
                      {order.orderNumber || `ORD-#${order.orderId}`} - {order.artworks?.[0]?.title || "Artwork Item"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dispute Reason */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Dispute Reason</label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none transition focus:border-purple-500/50"
                >
                  <option value="REFUND_REQUEST">Refund Request</option>
                  <option value="ARTWORK_NOT_RECEIVED">Artwork Not Received</option>
                  <option value="COPYRIGHT_CLAIM">Copyright Claim</option>
                  <option value="COMMISSION_NOT_DELIVERED">Commission Not Delivered</option>
                  <option value="PAYMENT_ISSUE">Payment Issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Priority Select */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none transition focus:border-purple-500/50"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Evidence Optional Upload */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Evidence <span className="text-gray-500 font-normal">(Optional File Upload)</span>
                </label>
                <input
                  id="dispute-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleEvidenceUpload}
                  className="w-full px-5 py-3.5 rounded-2xl bg-black/40 border border-white/10 text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition"
                />
                {isUploading && <p className="text-xs text-purple-400 mt-1 animate-pulse">Processing media file streaming upload...</p>}
              </div>
            </div>

            {/* Description Text area */}
            <div className="mt-6">
              <label className="block mb-2 text-gray-300 font-medium">Description Details</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your issue comprehensively..."
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none transition focus:border-purple-500/50"
              />
            </div>

            <button
              onClick={handleOpenDispute}
              disabled={isUploading}
              className={`mt-6 px-8 py-4 rounded-2xl font-semibold shadow-lg transition ${
                isUploading
                  ? "bg-purple-900/40 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20"
              }`}
            >
              Open Dispute
            </button>
          </div>

          {/* Core Analytics Metrics and Dynamic Client History Blocks */}
          {disputes.length > 0 && (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-md">
                  <p className="text-gray-400 font-medium">Active Cases</p>
                  <h2 className="text-4xl font-black text-purple-400 mt-2">
                    {disputes.filter(d => d.status === "OPEN" || d.status === "INVESTIGATING" || d.status === "UNDER_REVIEW").length}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-md">
                  <p className="text-gray-400 font-medium">Pending Approvals</p>
                  <h2 className="text-4xl font-black text-amber-400 mt-2">
                    {disputes.filter(d => d.status === "REFUND_APPROVED" || d.status === "ESCALATED").length}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-md">
                  <p className="text-gray-400 font-medium">Resolved Cases</p>
                  <h2 className="text-4xl font-black text-emerald-400 mt-2">
                    {disputes.filter(d => d.status === "RESOLVED" || d.status === "RESOLVE").length}
                  </h2>
                </div>
              </div>

              {/* Personal Client Dispute History Section */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
                <h2 className="text-3xl font-bold mb-6">My Dispute Tickets</h2>

                <div className="space-y-5">
                  {disputes.map((dispute, index) => (
                    <div
                      key={dispute.id || dispute.caseId || index}
                      className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
                        
                        <div className="space-y-1">
                          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                            Case #{dispute.id || dispute.caseId || "N/A"}
                          </span>
                          <h3 className="text-xl font-semibold mt-2">
                            Assigned Artist : <span className="text-gray-300 font-normal">{dispute.artistName || "Platform Artist"}</span>
                          </h3>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-sm text-gray-400">
                            <p>Reason: <span className="text-purple-400 font-medium">{dispute.reason ? dispute.reason.replace(/_/g, " ") : "N/A"}</span></p>
                            {(dispute.priority || dispute.priorityLevel) && (
                              <p>Urgency: <span className="text-red-400 font-medium">{dispute.priority || dispute.priorityLevel}</span></p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end lg:self-auto">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            dispute.status === "RESOLVED" || dispute.status === "RESOLVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {dispute.status ? dispute.status.replace(/_/g, " ") : "PENDING"}
                          </span>

                          <button 
                            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm font-medium hover:text-purple-400"
                            onClick={() => setSelectedDispute(dispute)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* POPUP MODAL: DETAILS VIEW */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="bg-[#0B0E14] border border-white/10 rounded-[28px] w-full max-w-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Top Ribbon Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Scale className="text-purple-500" size={22} />
                <div>
                  <h3 className="text-xl font-bold text-white">Dispute Analysis</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Ticket Database ID Refer: #{selectedDispute.id || "Unknown"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Primary Body Container */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Dynamic Badges Row */}
              <div className="flex flex-wrap gap-2.5">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  selectedDispute.status === "RESOLVED" || selectedDispute.status === "RESOLVE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                }`}>
                  <ShieldCheck size={12} /> {selectedDispute.status?.replace(/_/g, " ")}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-300 border border-red-500/20 rounded-full text-xs font-medium">
                  <AlertCircle size={12} /> {selectedDispute.reason?.replace(/_/g, " ")}
                </span>
              </div>

              {/* Core Information Properties Fields Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-2.5">
                  <User size={16} className="text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Artist Account</p>
                    <p className="text-white text-sm font-medium mt-0.5">{selectedDispute.artistName || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-2.5">
                  <FileText size={16} className="text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Artwork Title</p>
                    <p className="text-white text-sm font-medium mt-0.5">{selectedDispute.artworkTitle || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-2.5">
                  <FileText size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Order ID Link</p>
                    <p className="text-white text-sm font-medium mt-0.5">#{selectedDispute.orderId || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start gap-2.5">
                  <User size={16} className="text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Buyer / User ID</p>
                    <p className="text-white text-sm font-medium mt-0.5">ID: #{selectedDispute.userId || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Timestamp Row if existing */}
              {selectedDispute.createdAt && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 w-max">
                  <Calendar size={14} className="text-purple-400" />
                  <span>Submitted: {new Date(selectedDispute.createdAt).toLocaleString()}</span>
                </div>
              )}

              {/* Client Statement Block Description */}
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Claimant Statement</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic bg-black/20 p-3 rounded-lg border border-white/5">
                  "{selectedDispute.description || "No descriptions available for this ticket."}"
                </p>
              </div>

              {/* Asset Evidence Snapshot Attachment View */}
              {selectedDispute.evidence && (
                <div className="space-y-2">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Attached Evidence Media</p>
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2 group relative">
                    <img
                      src={selectedDispute.evidence}
                      alt="Dispute Media Reference File Asset"
                      className="max-h-52 w-auto object-contain rounded-lg transition group-hover:opacity-75"
                    />
                    <a
                      href={selectedDispute.evidence}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute opacity-0 group-hover:opacity-100 transition bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Open Original Image
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Lower Action Button Bar */}
            <div className="p-4 border-t border-white/10 bg-white/[0.01] flex justify-end">
              <button
                onClick={() => setSelectedDispute(null)}
                className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeCenter;