import React, { useEffect, useMemo, useState } from "react";
import { Search, CalendarDays, MapPin, Ticket, Eye, X, Clock, Eye as ViewIcon, ShieldCheck, DollarSign, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const statusStyles = {
  ACTIVE: "bg-green-500/15 text-green-300 border border-green-500/20",
  UPCOMING: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20",
  COMPLETED: "bg-gray-500/15 text-gray-300 border border-gray-500/20",
};

const filters = ["ALL", "ACTIVE", "UPCOMING", "COMPLETED"];

const getExhibitionDays = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return isNaN(diffDays) ? 1 : diffDays;
};

const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedExhibition, setSelectedExhibition] = useState(null); // Track model instance for details modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/exhibitions/fetch", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch exhibitions");
        const data = await res.json();
        setExhibitions(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const handleBooking = async (exhibition) => {
    try {
      if (Number(exhibition.ticketPrice) === 0) {
        const res = await fetch(`http://localhost:8080/api/payments/free`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ exhibitionId: exhibition.id }),
        });

        if (!res.ok) throw new Error("Free booking failed");

        const data = await res.json().catch(() => ({}));
        const referenceId = data.paymentId || data.id || `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        navigate("/buyer/ticket-success", {
          state: { exhibition, quantity: 1, passId: referenceId }
        });
        return;
      }
      navigate(`/buyer/exhibitions/${exhibition.id}/book`);
    } catch (error) {
      console.error(error);
      alert("Booking failed");
    }
  };

  const filteredExhibitions = useMemo(() => {
    return exhibitions.filter((exhibition) => {
      const matchesSearch =
        exhibition.title?.toLowerCase().includes(search.toLowerCase()) ||
        exhibition.city?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        selectedFilter === "ALL" ? true : exhibition.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter, exhibitions]);

  return (
    <div className="min-h-screen bg-[#070a0c] text-white relative overflow-hidden">

      {/* Dynamic Background Blur Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[180px] rounded-full" />
      <div className="sticky my-10 mx-10">
        <BackButton/>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Hero Section */}
        <div className="rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-3xl mb-10">
          <div className="relative h-[350px]">
            <img
              src="./goku.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center px-10">
              <h1 className="text-5xl md:text-7xl font-black">
                Explore <span className="text-cyan-300">Exhibitions</span>
              </h1>
              <p className="text-gray-300 mt-5 text-lg max-w-2xl">
                Discover immersive art experiences, connect with artists, and book tickets for upcoming exhibitions.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center mb-8">
          <div className="w-full lg:w-100 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search exhibitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-3 rounded-2xl transition ${
                  selectedFilter === filter
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Layout Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading live gallery instances...</p>
          </div>
        ) : filteredExhibitions.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredExhibitions.map((exhibition) => {
              const totalDays = getExhibitionDays(exhibition.startDate, exhibition.endDate);
              const maxVisitorsAllowed = Number(exhibition.maxVisitors || 0);
              const ticketsSoldTotal = Number(exhibition.ticketsSold || 0);
              const totalCapacityAcrossDuration = totalDays * maxVisitorsAllowed;
              const remainingSeats = totalCapacityAcrossDuration - ticketsSoldTotal;

              return (
                <div
                  key={exhibition.id || exhibition._id}
                  className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-2xl hover:border-cyan-400/30 transition-all hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div className="relative h-60 w-full bg-gray-900">
                    <img
                      src={exhibition.bannerUrl || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"}
                      alt={exhibition.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyles[exhibition.status] || statusStyles.ACTIVE}`}>
                        {exhibition.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-3 line-clamp-1">{exhibition.title}</h2>
                      
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-gray-500" />
                          <span className="truncate">{exhibition.location || "Theme Room"}, {exhibition.city || "Online"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays size={16} className="text-gray-500" />
                          <span>
                            {exhibition.startDate} - {exhibition.endDate}
                            <span className="text-xs text-gray-500 ml-1">({totalDays} {totalDays === 1 ? "day" : "days"})</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Ticket size={16} className="text-gray-500" />
                          <span>
                            {Number(exhibition.ticketPrice) === 0 ? "Free" : `₹${exhibition.ticketPrice}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className={`text-sm font-medium ${remainingSeats > 0 ? "text-cyan-300" : "text-rose-400"}`}>
                          {remainingSeats > 0 ? `${remainingSeats} Seats Left` : "Sold Out"}
                        </span>
                        <span className="font-bold text-xl">
                          {Number(exhibition.ticketPrice) === 0 ? "Free" : `₹${exhibition.ticketPrice}`}
                        </span>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => setSelectedExhibition(exhibition)} // Triggers popup menu layout modal data inject
                          className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                        >
                          <Eye size={16} /> Details
                        </button>

                        {exhibition.status === "COMPLETED" || remainingSeats <= 0 ? (
                          <button disabled className="flex-1 px-4 py-3 rounded-2xl bg-gray-800 text-gray-500 cursor-not-allowed text-sm">
                            {exhibition.status === "COMPLETED" ? "Gallery" : "Sold Out"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBooking(exhibition)}
                            className="flex-1 px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold text-sm text-black"
                          >
                            Book Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-20 text-center">
            <h2 className="text-3xl font-bold">No Exhibitions Found</h2>
            <p className="text-gray-400 mt-3">Try changing your search term or filter parameters.</p>
          </div>
        )}
      </div>

      {/* ==================== DETAILS POPUP MODAL SCREEN LAYER ==================== */}
      {selectedExhibition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#141212] border border-white/10 rounded-[36px] overflow-y-auto shadow-2xl custom-scrollbar flex flex-col">
            
            {/* Banner Media Cover Frame */}
            <div className="relative h-64 md:h-72 w-full bg-neutral-900 shrink-0">
              <img 
                src={selectedExhibition.bannerUrl || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"} 
                alt={selectedExhibition.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141212] via-[#141212]/30 to-black/40" />
              
              {/* Floating Header Action Buttons */}
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-cyan-500 text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {selectedExhibition.category || "General Exhibition"}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[selectedExhibition.status] || statusStyles.ACTIVE}`}>
                  {selectedExhibition.status}
                </span>
              </div>

              <button 
                onClick={() => setSelectedExhibition(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-black/60 text-gray-300 hover:text-white border border-white/10 hover:scale-110 transition-all shadow-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Info Compartment */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{selectedExhibition.title}</h2>
                <p className="text-cyan-400 font-medium text-sm mt-1 flex items-center gap-1.5">
                  <Award size={16} /> Theme: {selectedExhibition.themeName || "Creative Canvas space"}
                </p>
              </div>

              {/* Timing & Dates Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Event Timeline</p>
                    <p className="font-medium text-white">{selectedExhibition.startDate} to {selectedExhibition.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Daily Operating Hours</p>
                    <p className="font-medium text-white">{selectedExhibition.openTime || "09:00 AM"} - {selectedExhibition.closeTime || "06:00 PM"}</p>
                  </div>
                </div>
              </div>

              {/* Structural Description */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">About the Exhibition</h3>
                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedExhibition.description || "No dynamic overview description compiled by host artist collections yet."}
                </p>
              </div>

              {/* Ticket Configurations & Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase text-gray-500 font-bold">Standard Pass</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {Number(selectedExhibition.ticketPrice) === 0 ? "Free" : `₹${selectedExhibition.ticketPrice}`}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase text-gray-500 font-bold">VIP Access Pass</p>
                  <p className="text-lg font-bold text-amber-400 mt-0.5">
                    {selectedExhibition.vipPrice ? `₹${selectedExhibition.vipPrice}` : "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase text-gray-500 font-bold">Max Allowed Slots</p>
                  <p className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Users size={16} className="text-gray-400" /> {selectedExhibition.maxVisitors || "Unlimited"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase text-gray-500 font-bold">Live Traffic Views</p>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5 flex items-center gap-1.5">
                    <ViewIcon size={16} /> {selectedExhibition.views || 0}
                  </p>
                </div>
              </div>

              {/* Artworks Showcase Section */}
              {selectedExhibition.artworks && selectedExhibition.artworks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Featured Artworks Collection ({selectedExhibition.artworks.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedExhibition.artworks.map((art, index) => (
                      <div key={art.id || index} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-neutral-900">
                        <img 
                          src={art.imageUrl || art.url} 
                          alt={art.title || "Artwork Image"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-xs font-bold text-white line-clamp-1">{art.title || "Untitled"}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">By: {art.artistName || "Resident Artist"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Sticky Footer Base Bar */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Admission Fee</p>
                  <p className="text-2xl font-black text-white">
                    {Number(selectedExhibition.ticketPrice) === 0 ? "Free Entry" : `₹${selectedExhibition.ticketPrice}`}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedExhibition(null)}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                  >
                    Close
                  </button>
                  {selectedExhibition.status !== "COMPLETED" && (
                    <button 
                      onClick={() => {
                        const target = selectedExhibition;
                        setSelectedExhibition(null);
                        handleBooking(target);
                      }}
                      className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition text-black font-bold text-sm shadow-lg shadow-cyan-500/10"
                    >
                      Book Ticket Pass
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Exhibitions;