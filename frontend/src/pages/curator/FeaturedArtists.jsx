import SideBar from "./CuratorSideBar";
import { useState, useEffect } from "react";
import {
  FaCrown,
  FaUsers,
  FaPalette,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FeaturedArtists = () => {
  const navigate = useNavigate();

  // Backend Data States
  const [artistOfTheWeek, setArtistOfTheWeek] = useState(null);
  const [featuredGridArtists, setFeaturedGridArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Core Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); 

        const headers = {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        };

        const [artistOfWeekRes, featuredRes] = await Promise.all([
          fetch("http://localhost:8080/api/artists/artist-of-the-week", { method: "GET", headers }),
          fetch("http://localhost:8080/api/artists/feturedArtist", { method: "GET", headers })
        ]);
        
        const artistOfWeekData = await artistOfWeekRes.json();
        const featuredData = await featuredRes.json();
        
        setArtistOfTheWeek(artistOfWeekData);
        setFeaturedGridArtists(featuredData);
      } catch (error) {
        console.error("Error fetching dashboard creators data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center text-white font-['Jost']">
        <div className="text-xl tracking-widest animate-pulse text-cyan-400">LOADING CURATOR CONSOLE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/10 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 relative z-10 p-10 overflow-y-auto max-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Featured Artists</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Spotlight exceptional creators and boost exhibition visibility.
            </p>
          </div>
        </div>

        {/* ARTIST OF THE WEEK & METRICS SECTION */}
        {artistOfTheWeek && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-12">
            
            {/* MAIN CARD: LEFTSIDE 3-COLUMNS WIDTH */}
            <div className="xl:col-span-3 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-3xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

              {/* Profile Image - Preserved aspect ratio and sizing */}
              <div className="w-40 h-40 rounded-xl overflow-hidden border border-white/10 shadow-xl flex-shrink-0 bg-neutral-900">
                <img
                  src={artistOfTheWeek.profilePicture || "/Aizen.jpg"}
                  alt={artistOfTheWeek.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Space */}
              <div className="flex-1 w-full flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaCrown className="text-yellow-400 text-xs" />
                    <span className="text-[10px] font-bold tracking-wider text-yellow-400 uppercase">
                      Artist Of The Week
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight mb-2">{artistOfTheWeek.artistName}</h2>
                  {artistOfTheWeek.bio && (
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-4 line-clamp-2">{artistOfTheWeek.bio}</p>
                  )}

                  {/* Clean Mini-Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Category</p>
                      <h3 className="text-sm font-bold text-gray-200 truncate">{artistOfTheWeek.category || "General"}</h3>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Portfolio</p>
                      <h3 className="text-sm font-bold text-green-400">{artistOfTheWeek.portfolioSize || 0}</h3>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Artworks</p>
                      <h3 className="text-sm font-bold text-cyan-400">{artistOfTheWeek.artworkIds?.length || 0}</h3>
                    </div>
                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">Location</p>
                      <h3 className="text-sm font-bold text-purple-400 truncate">{artistOfTheWeek.location || "N/A"}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* METRIC CARD: COMPLETELY ALIGNED TO THE RIGHT CORNER */}
            <div className="xl:col-span-1 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-3xl flex flex-col justify-center relative overflow-hidden group hover:border-white/15 transition-all">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-cyan-500 opacity-80" />
              <p className="text-gray-400 text-xs font-bold tracking-wider uppercase">Total Featured Artists</p>
              <h2 className="text-6xl font-black text-purple-300 mt-2 tracking-tight">
                {featuredGridArtists.length}
              </h2>
            </div>

          </div>
        )}

        {/* FEATURED GRID SECTION */}
        <div className="mt-4">
          <h3 className="text-base font-bold tracking-wider text-gray-400 uppercase mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
            Currently Featured Catalog
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGridArtists.map((artist) => (
              <div key={artist.id || artist._id} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden backdrop-blur-3xl hover:border-white/20 transition-all flex flex-col justify-between group">
                <div>
                  {/* Fixed aspect container (h-48) preventing ultra-widescreen photo stretches */}
                  <div className="relative overflow-hidden h-48 bg-neutral-900 border-b border-white/5">
                    {artist.profilePicture ? (
                      <img src={artist.profilePicture} alt={artist.name} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 bg-neutral-950">No Cover Art</div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-xl font-bold tracking-tight line-clamp-1">{artist.artistName}</h4>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{artist.title || "Independent Creator"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-0.5 text-gray-500">
                          <FaUsers className="text-[10px] text-cyan-400/70" />
                          <p className="text-[9px] uppercase tracking-wider font-semibold">Category</p>
                        </div>
                        <h5 className="text-xs font-bold text-gray-300 truncate">{artist.category || "Digital"}</h5>
                      </div>

                      <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <div className="flex items-center gap-1.5 mb-0.5 text-gray-500">
                          <FaPalette className="text-[10px] text-purple-400/70" />
                          <p className="text-[9px] uppercase tracking-wider font-semibold">Artworks</p>
                        </div>
                        <h5 className="text-xs font-bold text-gray-300">{artist.artworkIds?.length || 0}</h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button 
                    onClick={() =>
                      navigate("/artist-profile", {
                        state: { artistId: artist.id },
                      })
                    }
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 text-xs font-bold transition active:scale-98 text-center"
                  >
                    View Portfolio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default FeaturedArtists;