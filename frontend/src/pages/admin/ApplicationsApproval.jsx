import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  Eye,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { useState,useEffect } from "react";

const statusStyles = {
  PENDING:
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  APPROVED:
    "bg-green-500/15 text-green-300 border border-green-500/20",
  REJECTED:
    "bg-red-500/15 text-red-300 border border-red-500/20",
};

const statusIcons = {
  PENDING: <Clock3 size={15} />,
  APPROVED: <CheckCircle2 size={15} />,
  REJECTED: <XCircle size={15} />,
};

const ApplicationsApproval = () => {

  const [stats, setStats] = useState({ pending: 0, total: 0, rejected: 0 });
  const [applications, setApplications] = useState([]);
  const [artistDetails, setArtistDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

useEffect(() => {

const fetchStats = async () => {

  try {
    const res = await fetch("http://localhost:8080/api/admin/application-stats", {
      method: "GET",
      headers: {
             "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error(err);
  }
};

const fetchApplications = async () => {

  try {

    const res = await fetch(
      `http://localhost:8080/api/admin/artist-application?search=${search}&status=${filterStatus}&page=${page}&size=6`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();

    setApplications(data.content);

    setTotalPages(data.totalPages);

  } catch (err) {
    console.error(err);
  }
};
  fetchStats();
  fetchApplications();
},[search, filterStatus, page]);


const handleView = async (id) => {
  try {

   const response = await fetch(
      `http://localhost:8080/api/admin/applications/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      }
    );


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    setArtistDetails(data);
    setShowModal(true);

  } catch (error) {
    console.error("Error fetching application:", error);
  }
};

const updateStatus = async (id, status) => {
  try {
    const response = await fetch(`http://localhost:8080/api/admin/applications-status/${id}?status=${status}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const result = await response.text(); 
    console.log(result);
    setApplications((prev) =>
    prev.map((artist) =>
      artist.id === id
        ? { ...artist, status }
        : artist
    )
  );
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
              CREATOR APPROVALS
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Review artist applications and manage creator verification.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />
            <span className="text-sm text-gray-300">
              AI Moderation Active
            </span>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Pending Reviews
            </p>

            <h2 className="text-5xl font-black text-yellow-300">
              {stats.pending}
            </h2>

            <div className="mt-5 w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Approved Artists
            </p>

            <h2 className="text-5xl font-black text-green-400">
              {stats.total}
            </h2>

            <div className="mt-5 w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-green-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Rejected Requests
            </p>

            <h2 className="text-5xl font-black text-red-400">
              {stats.rejected}
            </h2>

            <div className="mt-5 w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[35%] h-full bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">

            <div>
              <h2 className="text-3xl font-bold">
                Artist Applications
              </h2>

              <p className="text-gray-400 mt-2">
                Review portfolios, verify creators & approve accounts.
              </p>
            </div>

            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-[260px]">
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search creators..."
                  className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
              </div>
            <select
              value={filterStatus}
              placeholder="Filter by status"
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
              className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white outline-none"
            >
              <option value="ALL" className="bg-black">
                All
              </option>

              <option value="PENDING" className="bg-black">
                Pending
              </option>

              <option value="APPROVED" className="bg-black">
                Approved
              </option>

              <option value="REJECTED" className="bg-black">
                Rejected
              </option>
            </select>
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-5 text-gray-400 text-sm border-b border-white/10 pb-5 px-2">
            <p>Artist</p>
            <p>Category</p>
            <p>Portfolio</p>
            <p>Status</p>
            <p className="text-right">Actions</p>
          </div>

          {/* Applications */}
          <div className="mt-2 space-y-5">

            {applications.map((artist,index) => (
              <div
                key={index}
                className="grid lg:grid-cols-5 gap-5 items-center bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1"
              >

                {/* Artist */}
                <div className="flex items-center gap-4">

                  <div className="relative">
                    <img
                      src={artist.profilePicture}
                      alt="artist"
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                    />

                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-[#05070B]">
                      <BadgeCheck size={13} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {artist.artistName}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {artist.location}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/10">
                    {artist.category}
                  </span>
                </div>

                {/* Portfolio */}
                <div>
                  <p className="text-white font-semibold">
                    {artist.portfolioSize} artworks
                  </p>

                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${statusStyles[artist.status]}`}
                  >
                    {statusIcons[artist.status]}
                    {artist.status}
                  </span>
                </div>

                {/* Actions */}
              <div className="flex justify-end gap-3">

                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  onClick={() => handleView(artist.id)}
                >
                  <Eye size={18} />
                  View
                </button>

                {/* PENDING */}
                {artist.status === "PENDING" && (
                  <>
                    <button
                      className="px-5 py-3 rounded-2xl bg-green-500/15 text-green-300 hover:bg-green-500/25 transition font-medium"
                      onClick={() => updateStatus(artist.id, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      className="px-5 py-3 rounded-2xl bg-red-500/15 text-red-300 hover:bg-red-500/25 transition font-medium"
                      onClick={() => updateStatus(artist.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* APPROVED */}
                {artist.status === "APPROVED" && (
                  <div className="px-5 py-3 rounded-2xl bg-green-500/15 text-green-300 border border-green-500/20 font-medium">
                    Approved ✓
                  </div>
                )}

                {/* REJECTED */}
                {artist.status === "REJECTED" && (
                  <div className="px-5 py-3 rounded-2xl bg-red-500/15 text-red-300 border border-red-500/20 font-medium">
                    Rejected ✕
                  </div>
                )}

              </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-7">

            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-gray-300">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>

{showModal && artistDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
    <div className="relative w-full max-w-6xl max-h-screen overflow-y-auto rounded-[30px] border border-white/10 bg-[#0B0F19] shadow-2xl">
      
      {/* Sticky Close Button */}
      <div className="sticky top-0 z-50 flex justify-end p-6">
        <button
          onClick={() => setShowModal(false)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500"
        >
          ✕
        </button>
      </div>

      {/* Header Image */}
      <div className="relative h-65 overflow-hidden">
        <img
          src={
            artistDetails.sampleArtworks?.[0] ||
            artistDetails.profilePicture
          }
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 flex w-full items-end gap-6 p-8">
          <img
            src={artistDetails.profilePicture}
            alt="profile"
            className="h-36 w-36 rounded-3xl border-4 border-white/10 object-cover shadow-2xl"
          />
          <div className="pb-3">
            <h1 className="text-5xl font-black tracking-tight text-white">
              {artistDetails.artistName}
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              {artistDetails.fullName}
            </p>
            <div className="mt-4 flex gap-3">
              <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300">
                {artistDetails.category}
              </span>
              <div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${statusStyles[artistDetails.status]}`}
                >
                  {statusIcons[artistDetails.status]}
                  {artistDetails.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 p-8 lg:grid-cols-[320px_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-5 text-xl font-bold text-white">Information</h3>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 break-all text-white">{artistDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="mt-1 text-white">{artistDetails.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="mt-1 text-white">{artistDetails.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Portfolio Size</p>
                <p className="mt-1 text-white">{artistDetails.portfolioSize}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
            <h3 className="mb-5 text-xl font-bold text-white">Links</h3>
            <div className="space-y-3">
              <a
                href={artistDetails.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-white transition hover:bg-cyan-500/20"
              >
                <span>🌐 Portfolio</span>
                <span>↗</span>
              </a>
              <a
                href={artistDetails.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-white transition hover:bg-pink-500/20"
              >
                <span>📸 Instagram</span>
                <span>↗</span>
              </a>
              <a
                href={artistDetails.artStation}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-white transition hover:bg-blue-500/20"
              >
                <span>🎨 ArtStation</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-7">
            <h2 className="mb-5 text-2xl font-bold text-white">Artist Bio</h2>
            <p className="leading-8 text-gray-300">{artistDetails.artistBio}</p>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Featured Artworks</h2>
              <span className="text-sm text-gray-400">
                {artistDetails.sampleArtworks?.length} pieces
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {artistDetails.sampleArtworks?.map((art, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/3"
                >
                  <div className="overflow-hidden">
                    <img
                      src={art}
                      alt={`artwork-${index}`}
                      className="h-70 w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ApplicationsApproval;