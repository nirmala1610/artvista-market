import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  ShieldAlert,
  Eye,
  CheckCircle2,
  XCircle,
  Flag,
  Sparkles,
  ImageIcon,
  Clock3,
} from "lucide-react";

const artworks = [
  {
    id: 1,
    title: "Cyber Ronin",
    artist: "KuroSketch",
    category: "Digital Art",
    status: "Pending",
    reports: 2,
    image: "/Aizen.jpg",
  },
  {
    id: 2,
    title: "Dreamscape City",
    artist: "NeoCanvas",
    category: "Fantasy",
    status: "Approved",
    reports: 0,
    image: "/Aizen.jpg",
  },
  {
    id: 3,
    title: "Blood Moon",
    artist: "PixelSoul",
    category: "Dark Art",
    status: "Flagged",
    reports: 8,
    image: "/Aizen.jpg",
  },
];

const statusStyles = {
  Pending:
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
  Approved:
    "bg-green-500/15 text-green-300 border border-green-500/20",
  Flagged:
    "bg-red-500/15 text-red-300 border border-red-500/20",
};

const statusIcons = {
  Pending: <Clock3 size={15} />,
  Approved: <CheckCircle2 size={15} />,
  Flagged: <ShieldAlert size={15} />,
};

const ArtworkModeration = () => {
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
              ARTWORK MODERATION
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Monitor uploads, review flagged content & maintain platform quality.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />
            <span className="text-sm text-gray-300">
              AI Content Scanner Enabled
            </span>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Total Artworks
            </p>

            <h2 className="text-5xl font-black text-cyan-300">
              48K
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-400">
              +18% uploads
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Pending Reviews
            </p>

            <h2 className="text-5xl font-black text-yellow-300">
              128
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm text-yellow-300">
              Needs attention
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Flagged Content
            </p>

            <h2 className="text-5xl font-black text-red-400">
              24
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm text-red-300">
              Community reports
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl">
            <p className="text-gray-400 mb-3">
              Approved Today
            </p>

            <h2 className="text-5xl font-black text-green-400">
              312
            </h2>

            <div className="mt-5 flex items-center gap-2 text-sm text-green-300">
              Moderation stable
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">

            <div>
              <h2 className="text-3xl font-bold">
                Artwork Review Queue
              </h2>

              <p className="text-gray-400 mt-2">
                Review uploaded artworks before public visibility.
              </p>
            </div>

            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-[260px]">
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search artworks..."
                  className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="hidden xl:grid grid-cols-6 text-gray-400 text-sm border-b border-white/10 pb-5 px-2">
            <p>Artwork</p>
            <p>Artist</p>
            <p>Category</p>
            <p>Reports</p>
            <p>Status</p>
            <p className="text-right">Actions</p>
          </div>

          {/* Artwork Cards */}
          <div className="mt-3 space-y-5">

            {artworks.map((art) => (
              <div
                key={art.id}
                className="grid xl:grid-cols-6 gap-5 items-center bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1"
              >

                {/* Artwork */}
                <div className="flex items-center gap-4">

                  <div className="relative">
                    <img
                      src={art.image}
                      alt="artwork"
                      className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                    />

                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center border-2 border-[#05070B]">
                      <ImageIcon size={16} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {art.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      High Resolution Artwork
                    </p>
                  </div>
                </div>

                {/* Artist */}
                <div>
                  <p className="text-white font-medium">
                    {art.artist}
                  </p>

                  <p className="text-gray-400 text-sm">
                    Verified Creator
                  </p>
                </div>

                {/* Category */}
                <div>
                  <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/10">
                    {art.category}
                  </span>
                </div>

                {/* Reports */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-300 border border-red-500/10">
                    <Flag size={15} />
                    {art.reports} Reports
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${statusStyles[art.status]}`}
                  >
                    {statusIcons[art.status]}
                    {art.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">

                  <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <Eye size={18} />
                    Preview
                  </button>

                  <button className="px-5 py-3 rounded-2xl bg-green-500/15 text-green-300 hover:bg-green-500/25 transition font-medium">
                    Approve
                  </button>

                  <button className="px-5 py-3 rounded-2xl bg-red-500/15 text-red-300 hover:bg-red-500/25 transition font-medium">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-10 pt-6 border-t border-white/10 gap-5">

            <p className="text-gray-400 text-sm">
              Showing 1 to 3 of 128 artworks pending moderation
            </p>

            <div className="flex items-center gap-3">

              <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Previous
              </button>

              <button className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold">
                1
              </button>

              <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                2
              </button>

              <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModeration;