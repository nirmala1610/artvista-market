import { useEffect, useState } from "react";
import SideBar from "./CuratorSideBar";
import {
  FaPlus,
  FaSearch,
  FaImages,
  FaGlobe
} from "react-icons/fa";
import { toast } from "sonner";

const ArtworkSelection = () => {
  const [activeExhibitions, setActiveExhibitions] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublishing, setIsPublishing] = useState(false); 

  // Fetch Exhibitions
  const fetchActiveExhibitions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/exhibitions/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setActiveExhibitions(data);
      
      if (data && data.length > 0) {
        setSelectedExhibition(data[0]);
      }
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    }
  };

  // Fetch Artworks
  const fetchAvailableArtworks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/artworks/available", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setArtworks(data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  useEffect(() => {
    fetchActiveExhibitions();
    fetchAvailableArtworks();
  }, []);

  // Action: Add artwork (FIXED: State filter added)
  const addArtworkToExhibition = async (artwork) => {
    if (!selectedExhibition) {
      toast.error("Please select an exhibition from the right panel first.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/exhibitions/${selectedExhibition.id}/add-artwork`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            artworkId: artwork.id,
            imageUrl: artwork.imageUrl,
          }),
        }
      );

      if (res.ok) {
        const msg = await res.text();
        toast.success(msg);

        // FIX: Remove the added piece from the local available artworks list instantly
        setArtworks((prevArtworks) => prevArtworks.filter((item) => item.id !== artwork.id));
        
        // Refresh local exhibition counts to show updated "Artworks Added" numbers
        fetchActiveExhibitions();
      } else {
        toast.error("Failed to append artwork to exhibition.");
      }
    } catch (err) {
      console.error("Error adding artwork:", err);
    }
  };

  // Fixed Action: Publish Exhibition Handler (FIXED: Authorization header structure fixed)
  const handlePublishExhibition = async () => {
    if (!selectedExhibition) {
      toast.error("No exhibition selected to publish.");
      return;
    }

    try {
      setIsPublishing(true);

      // FIX: Explicitly pass authorization to avoid 403 header parsing omissions
      const response = await fetch(`http://localhost:8080/api/exhibitions/publish/${selectedExhibition.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        toast.success(`Successfully published: ${selectedExhibition.title}`);
        fetchActiveExhibitions();
      } else if (response.status === 403) {
        toast.error("Access Forbidden (403): Check backend security configurations or token validity.");
      } else {
        toast.error("Failed to publish exhibition.");
      }

    } catch (error) {
      console.error("Publish execution error:", error);
      toast.error("An operational error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Filter items dynamically based on search bar
  const filteredArtworks = artworks.filter((art) => {
    const query = searchQuery.toLowerCase();
    return (
      art.title?.toLowerCase().includes(query) ||
      art.artistName?.toLowerCase().includes(query) ||
      art.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full pointer-events-none"></div>

      <SideBar />

      <div className="flex-1 relative z-10 p-10 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black font-['Poller_One']">
              Artwork Selection
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Add artworks into exhibitions and manage curated collections.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-3xl">
            <p className="text-gray-400 mb-3">Total Artworks</p>
            <h2 className="text-5xl font-black text-cyan-300">{artworks?.length || 0}</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-3xl">
            <p className="text-gray-400 mb-3">Active Exhibitions</p>
            <h2 className="text-5xl font-black text-green-300">{activeExhibitions?.length || 0}</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-3xl">
            <p className="text-gray-400 mb-3">Featured Pieces</p>
            <h2 className="text-5xl font-black text-purple-300">48</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-7 backdrop-blur-3xl">
            <p className="text-gray-400 mb-3">Published Galleries</p>
            <h2 className="text-5xl font-black text-yellow-300">7</h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 backdrop-blur-3xl mb-10">
          <div className="flex items-center gap-3 bg-[#0B1118] border border-white/10 rounded-2xl px-5 py-4">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks, artists, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* ARTWORKS MAIN LIST (LEFT SIDE) */}
          <div className="xl:col-span-2 space-y-8">
            {filteredArtworks.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No artworks found matching criteria.</p>
            ) : (
              filteredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-white/5 border border-white/10 rounded-[35px] overflow-hidden backdrop-blur-3xl"
                >
                  <img
                    src={artwork.imageUrl || "https://via.placeholder.com/600x320"}
                    alt={artwork.title}
                    className="w-full h-[320px] object-cover"
                  />

                  <div className="p-7">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold">{artwork.title}</h2>
                        <p className="text-gray-400 mt-2">by {artwork.artistName}</p>
                      </div>
                      <span className="px-4 py-2 rounded-full bg-cyan-500/15 text-cyan-300 text-sm">
                        {artwork.category || "Uncategorized"}
                      </span>
                    </div>

                    <button
                      onClick={() => addArtworkToExhibition(artwork)}
                      className="w-full py-4 rounded-2xl bg-cyan-500 font-bold text-black hover:bg-cyan-400 transition"
                    >
                      Add to {selectedExhibition ? `"${selectedExhibition.title}"` : "Exhibition"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SIDEBAR PANELS (RIGHT SIDE) */}
          <div className="space-y-8">
            {/* EXHIBITIONS CONTAINER */}
            <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-3xl font-bold">Exhibitions</h2>
                <button className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 hover:bg-cyan-500/25 transition">
                  <FaPlus className="text-cyan-300" />
                </button>
              </div>

              <div className="space-y-5">
                {activeExhibitions?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No active exhibitions available.</p>
                ) : (
                  activeExhibitions?.map((exhibition) => {
                    const isSelected = selectedExhibition?.id === exhibition.id;
                    return (
                      <div
                        key={exhibition.id}
                        onClick={() => setSelectedExhibition(exhibition)}
                        className={`border rounded-2xl p-5 cursor-pointer transition ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400"
                            : "bg-[#0B1118] border-white/10 hover:border-cyan-400/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-xl">{exhibition.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {exhibition.themeName || "No Theme"}
                            </p>
                          </div>
                          <span className={`text-sm ${isSelected ? "text-cyan-300" : "text-green-300"}`}>
                            {exhibition.status || "Active"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-gray-400 text-sm">
                            {exhibition.artworks?.length || 0} Artworks Added
                          </p>
                          <button 
                            className={`px-4 py-2 rounded-xl font-semibold transition ${
                              isSelected ? "bg-cyan-500 text-black scale-105" : "bg-white/10 hover:bg-white/20"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* EXHIBITION CONTROL PANEL */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-[35px] p-8 backdrop-blur-3xl">
              <div className="flex items-center gap-4 mb-7">
                <FaImages className="text-cyan-300 text-3xl" />
                <div>
                  <h2 className="text-3xl font-bold">Exhibition Control</h2>
                  <p className="text-gray-400 text-sm mt-1">Manage selected exhibition</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-[#0B1118] rounded-2xl p-5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Current Exhibition</p>
                  <h3 className="text-2xl font-bold text-cyan-300">
                    {selectedExhibition ? selectedExhibition.title : "None Selected"}
                  </h3>
                </div>

                <div className="bg-[#0B1118] rounded-2xl p-5 border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Remaining Slots</p>
                  <h3 className="text-xl font-semibold text-yellow-300">
                    {selectedExhibition ? `${30 - (selectedExhibition.artworks?.length || 0)} Slots Left` : "--"}
                  </h3>
                </div>

                <button 
                  onClick={handlePublishExhibition}
                  disabled={isPublishing || !selectedExhibition}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-500/15 text-green-300 border border-green-500/20 hover:bg-green-500/25 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaGlobe />
                  {isPublishing ? "Publishing Status..." : "Publish Exhibition"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkSelection;