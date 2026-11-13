import React, { useEffect, useState ,useRef} from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
import { toast } from 'sonner';

const ReportsCenter = () => {
  const token = localStorage.getItem('token');
  
  const [selectedArtworkId, setSelectedArtworkId] = useState("");
  const [artistName, setArtistName] = useState("");
  const [reason, setReason] = useState("COPYRIGHT");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState(""); 

  // Add this with your other states at the top of the component
const searchContainerRef = useRef(null);
  
  // Interactive Live Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Saved Platform Reports History
  const [reports, setReports] = useState([]);

  // Fetch reports submitted by the client
  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/create-report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        }
    };
    fetchReports();
    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up the event listener when the component unmounts
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, []);

  // Live Auto-Suggest Search Bar Debounce logic logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchArtworksFromDB(searchQuery);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchArtworksFromDB = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/artworks/search?keyword=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setIsDropdownOpen(true);
      }
    } catch (error) {
      console.error("Error searching artworks:", error);
    }
  };

  const handleSelectArtwork = (artwork) => {
    setSearchQuery(artwork.title);
    setSelectedArtworkId(artwork.id);
    setArtistName(artwork.artistName);
    setIsDropdownOpen(false);
  };

  // Optional Media File Upload Handler
  const handleEvidenceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Evidence file must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG screenshots allowed");
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      setEvidence(imageUrl);
      toast.success("Evidence screenshot attached cleanly");
    } catch (err) {
      console.error(err);
      toast.error("Evidence upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const submitReport = async () => {
    if (!selectedArtworkId || !description) {
      toast.error("Please pick an artwork and fill in the description context.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reports/create-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artworkId: selectedArtworkId,
          artistName,
          reason,
          description,
          evidence, // Sends the Cloudinary link string (or empty if skipped)
        }),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      toast.success("Report submitted to moderation center");

      // Reset everything clean
      setSelectedArtworkId("");
      setArtistName("");
      setSearchQuery("");
      setReason("COPYRIGHT");
      setDescription("");
      setEvidence("");
      
      // Flush file input manually if elements remain
      const fileInput = document.getElementById("evidence-file-input");
      if (fileInput) fileInput.value = "";
      
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error("Could not process report submission");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white">
      <CustomerHeader />

      <div className="flex">
        <CustomerSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Main Title Metadata Section */}
          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-tight text-red-500">REPORT CENTER</h1>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl">
              Help us keep ArtVista safe by reporting artworks, artists, or content that violates platform guidelines.
            </p>
          </div>

          {/* Central Structured Reporting Card */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-8">
            <h2 className="text-3xl font-bold mb-6">Create Report</h2>

            {/* 2x2 Grid Layout for Metadata Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Field 1: Live Suggestion Search Bar */}
              <div className="relative" ref={searchContainerRef}>
                <label className="block mb-2 text-gray-300 font-medium">Artwork</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedArtworkId) {
                      setSelectedArtworkId("");
                      setArtistName("");
                    }
                  }}
                  placeholder="Type to search artwork title..."
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none transition focus:border-red-500/50"
                />

                {/* Floated Dropdown Suggestion Wrapper Box */}
                {isDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl">
                    {searchResults.map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => handleSelectArtwork(art)}
                        className="w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center justify-between border-b border-white/5 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-white">{art.title}</p>
                          <p className="text-xs text-gray-400">by {art.artistName}</p>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">ID: {art.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 2: Auto-Populated Artist Name Context Box */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Artist</label>
                <input
                  type="text"
                  value={artistName}
                  disabled
                  placeholder="Auto-filled via artwork selection"
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] text-gray-400 border border-white/5 cursor-not-allowed outline-none"
                />
              </div>

              {/* Field 3: Reasons Dropdown Selection Menus */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none transition focus:border-red-500/50"
                >
                  <option value="COPYRIGHT">Copyright Infringement</option>
                  <option value="NSFW_CONTENT">NSFW Content</option>
                  <option value="HARASSMENT">Harassment</option>
                  <option value="SPAM">Spam</option>
                  <option value="FAKE_ARTWORK">Fake Artwork</option>
                  <option value="MISLEADING_CONTENT">Misleading Content</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Field 4: Optional Screenshot Attachment Box */}
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Evidence <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="evidence-file-input"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleEvidenceUpload}
                  className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                />
                {isUploading && <p className="text-xs text-red-400 mt-1 animate-pulse">Uploading file to servers...</p>}
              </div>

            </div>

            {/* Comprehensive Detail Textarea Block */}
            <div className="mt-6">
              <label className="block mb-2 text-gray-300 font-medium">Description</label>
              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue in detail..."
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none transition focus:border-red-500/50"
              />
            </div>

            {/* Submission Triggers */}
            <button
              onClick={submitReport}
              disabled={isUploading}
              className={`mt-6 px-8 py-4 rounded-2xl font-semibold shadow-lg transition ${
                isUploading 
                  ? "bg-red-800/40 text-gray-500 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
              }`}
            >
              Submit Report
            </button>
          </div>

          {/* Platform Performance Metrics Display Block */}
          {reports.length > 0 && (
            <>
              {/* Numerical Metrics Row */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400 font-medium">Total Reports</p>
                  <h2 className="text-4xl font-black text-red-400 mt-2">{reports.length}</h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400 font-medium">Under Review</p>
                  <h2 className="text-4xl font-black text-orange-400 mt-2">
                    {reports.filter(r => r.status === "UNDER_REVIEW").length}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400 font-medium">Resolved</p>
                  <h2 className="text-4xl font-black text-emerald-400 mt-2">
                    {reports.filter(r => r.status === "ACTION_TAKEN" || r.status === "RESOLVED").length}
                  </h2>
                </div>
              </div>

              {/* Personal Client Submission History List */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <h2 className="text-3xl font-bold mb-6">My Reports</h2>

                <div className="space-y-5">
                  {reports.map((report) => (
                    <div
                      key={report.id || report.reportId}
                      className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-red-500/30 transition"
                    >
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">
                        <div className="space-y-1">
                          <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-gray-300">
                            {report.reportId || `RPT-${report.id}`}
                          </span>
                          <h3 className="text-xl font-semibold mt-2">
                            Artwork: <span className="text-gray-300 font-normal">{report.artworkTitle || "Unknown Artwork"}</span>
                          </h3>
                          <p className="text-sm text-gray-400">
                            Reason: <span className="text-red-400 font-medium">{report.reason}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 self-start lg:self-auto">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${
                            report.status === "UNDER_REVIEW" 
                              ? "bg-orange-500/15 text-orange-400" 
                              : "bg-emerald-500/15 text-emerald-400"
                          }`}>
                            {report.status.replace("_", " ")}
                          </span>

                          <button className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm font-medium border border-white/10">
                            View
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
    </div>
  );
};

export default ReportsCenter;