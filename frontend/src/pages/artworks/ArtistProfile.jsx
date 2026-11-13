import { useEffect, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaGlobe,
  FaBehance,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useLocation,useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";


const ArtistProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const artistId = location.state?.artistId;

  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/artworks/profile/${artistId}`
        );
        const data = await res.json();
        setArtist(data);
        setArtworks(data.artworks || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtistProfile();
  }, [artistId]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [artworks]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 330, behavior: "smooth" });
  };

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <div className="relative h-[460px]">
        
        {/* ── BACK BUTTON POSITIONED OVER IMAGE ── */}
        <div className="absolute top-6 left-6 lg:left-12 z-20">
          <BackButton />
        </div>

        <img
          src="./Artist-banner.jpeg"
          alt="banner"
          className="w-full h-full object-cover"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/65 to-transparent z-10" />

        <div className="absolute bottom-0 left-0 w-full px-6 lg:px-12 pb-10 z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-end">

            {/* ── AVATAR ── */}
            <div className="relative flex-shrink-0 animate-[fadeUp_0.6s_ease_both]">
              <img
                src={artist.profilePicture}
                alt={artist.artistName}
                className="w-[170px] h-[170px] rounded-[28px] object-cover border-2 border-white/10"
              />
              {/* small verified dot on avatar */}
              {artist.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-[#05070B]">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            {/* ── INFO ── */}
            <div className="flex-1 animate-[fadeUp_0.6s_ease_0.1s_both]">

              {/* name + verified badge */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl lg:text-5xl font-black leading-tight">
                  {artist.artistName}
                </h1>
                {artist.verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-medium animate-pulse">
                    <MdVerified className="text-cyan-400 text-sm" />
                    Verified Artist
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-lg mt-2">{artist.fullName}</p>

              {/* tags */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-cyan-500" />
                  {artist.location}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  {artist.category}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {artist.experience}
                </span>
              </div>

              {/* bio */}
              <p className="mt-5 text-gray-300 max-w-2xl leading-relaxed text-sm lg:text-base">
                {artist.artistBio}
              </p>
            </div>

            {/* ── SOCIALS ── */}
            <div className="flex gap-3 animate-[fadeUp_0.6s_ease_0.2s_both]">
              {artist.instagram && (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:-translate-y-1 transition-all duration-200"
                >
                  <FaInstagram />
                </a>
              )}
              {artist.artStation && (
                <a
                  href={artist.artStation}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:-translate-y-1 transition-all duration-200"
                >
                  <FaBehance />
                </a>
              )}
              {artist.portfolioUrl && (
                <a
                  href={artist.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:-translate-y-1 transition-all duration-200"
                >
                  <FaGlobe />
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── ARTWORK COLLECTION ── */}
      <div className="px-6 lg:px-12 py-14">

        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Sample Collection</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Selected artworks from the artist portfolio
          </p>
        </div>

        {/* scroll container */}
        <div className="relative">

          {/* LEFT button */}
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10
              w-11 h-11 rounded-full flex items-center justify-center
              border transition-all duration-200
              ${canScrollLeft
                ? "bg-[#0d1117]/90 border-white/20 text-white hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 hover:scale-110"
                : "bg-[#0d1117]/40 border-white/5 text-white/20 cursor-not-allowed"
              }
            `}
            aria-label="Scroll left"
          >
            <HiChevronLeft className="text-lg" />
          </button>

          {/* RIGHT button */}
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10
              w-11 h-11 rounded-full flex items-center justify-center
              border transition-all duration-200
              ${canScrollRight
                ? "bg-[#0d1117]/90 border-white/20 text-white hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 hover:scale-110"
                : "bg-[#0d1117]/40 border-white/5 text-white/20 cursor-not-allowed"
              }
            `}
            aria-label="Scroll right"
          >
            <HiChevronRight className="text-lg" />
          </button>

          {/* track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide scroll-smooth px-1"
          >
            {artworks.map((art, i) => (
              <div
                key={art.id}
                className="min-w-[300px] max-w-[300px] bg-white/[0.04] border border-white/10 rounded-[28px] overflow-hidden flex-shrink-0 group cursor-pointer hover:-translate-y-2 hover:border-cyan-500/30 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden h-[320px]">
                  <img
                    src={art.imageUrl}
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onClick={ () => navigate("/buyer/artDetail", { state: { data: art.id } })}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{art.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{art.category}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ArtistProfile;