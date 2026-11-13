import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, ShoppingCart, Bookmark, Eye, User, X, SlidersHorizontal } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import BackButton from "../../components/BackButton";

/* ─── Price range map → minPrice / maxPrice ─────────────────────────── */
const PRICE_RANGE_MAP = {
  "Under ₹500":   { minPrice: null, maxPrice: 500  },
  "₹500–₹2000":  { minPrice: 500,  maxPrice: 2000 },
  "₹2000–₹5000": { minPrice: 2000, maxPrice: 5000 },
  "₹5000+":       { minPrice: 5000, maxPrice: null },
};

/* ─── Sort label → backend sortBy key ───────────────────────────────── */
const SORT_KEY_MAP = {
  "Sort by": "newest",
  "Price Low → High": "priceLow",
  "Price High → Low": "priceHigh",
  "Artist": "artist",
  "Newest": "newest",
};

const EMPTY_FILTERS = {
  categories:   [],
  mediums:      [],
  orientations: [],
  priceLabels:  [],   // UI-only; resolved to minPrice/maxPrice before sending
  sortBy:       "newest",
  sortLabel:    "Sort by",
};

/* ─── helpers ────────────────────────────────────────────────────────── */

/** Convert selected price-label strings → unified {minPrice, maxPrice} */
const resolvePriceRange = (priceLabels) => {
  if (!priceLabels.length) return { minPrice: null, maxPrice: null };
  let min = Infinity, max = -Infinity;
  priceLabels.forEach((label) => {
    const r = PRICE_RANGE_MAP[label];
    if (r.minPrice !== null && r.minPrice < min) min = r.minPrice;
    if (r.maxPrice !== null && r.maxPrice > max) max = r.maxPrice;
  });
  return { minPrice: min === Infinity ? null : min, maxPrice: max === -Infinity ? null : max };
};

/** Build the DTO body expected by the Spring backend */
const buildFilterDTO = (filters) => {
  const { minPrice, maxPrice } = resolvePriceRange(filters.priceLabels);
  return {
    categories:   filters.categories.length   ? filters.categories   : null,
    mediums:      filters.mediums.length       ? filters.mediums      : null,
    orientations: filters.orientations.length  ? filters.orientations : null,
    minPrice,
    maxPrice,
    sortBy: filters.sortBy,
  };
};

/* ─── Skeleton Card ──────────────────────────────────────────────────── */
const SkeletonCard = ({ height = "h-64" }) => (
  <div
    className={`break-inside-avoid rounded-2xl overflow-hidden bg-[#111318] border border-[#1e2530] mb-6 ${height}`}
    style={{ animation: "skeletonPulse 1.8s ease-in-out infinite" }}
  >
    <div className="w-full h-full relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(157,220,255,0.04) 50%, transparent 100%)",
          animation: "shimmer 1.8s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-3 bg-[#1e2530] rounded-full w-3/4" />
        <div className="h-2 bg-[#1a2028] rounded-full w-1/2" />
        <div className="h-2 bg-[#1a2028] rounded-full w-1/4 mt-2" />
      </div>
    </div>
  </div>
);

/* ─── Filter Group ───────────────────────────────────────────────────── */
const FilterGroup = ({ title, items, selected, onToggle }) => (
  <div>
    <p
      className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
      style={{ color: "#9ddcff", fontFamily: "'DM Mono', monospace" }}
    >
      {title}
    </p>
    <div className="space-y-2">
      {items.map((item, i) => {
        const isChecked = selected.includes(item);
        return (
          <label
            key={i}
            className="flex items-center gap-3 cursor-pointer text-sm text-gray-400 hover:text-white transition-colors group"
            onClick={(e) => {
              e.preventDefault(); // Stop native label double-triggers
              onToggle(item);
            }}
          >
            <span
              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                background: isChecked ? "rgba(157,220,255,0.15)" : "rgba(157,220,255,0.03)",
                borderColor: isChecked ? "#9ddcff" : "#2a3540",
              }}
            >
              {isChecked && <span className="w-2 h-2 rounded-sm bg-[#9ddcff] block" />}
            </span>
            {item}
          </label>
        );
      })}
    </div>
  </div>
);

/* ─── Filter Bar ─────────────────────────────────────────────────────── */
// FIXED: Destructured onApply parameter layout correctly here
const FilterBar = ({ open, setOpen, filters, setFilters, onApply, onClear }) => {
  const toggle = (field) => (value) =>
    setFilters((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });

  return (
    <div className="sticky top-0 z-30" style={{ animation: "slideDown 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      <div
        className="flex justify-between items-center px-6 py-4 rounded-2xl"
        style={{
          background: "rgba(10,13,18,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(157,220,255,0.08)",
          boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-semibold transition-all px-4 py-2 rounded-xl"
            style={{
              color: open ? "#0f0f10" : "#9ddcff",
              background: open ? "#9ddcff" : "rgba(157,220,255,0.06)",
              border: "1px solid rgba(157,220,255,0.15)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {open && <X size={13} />}
          </button>
        </div>

        <select
          value={filters.sortLabel}
          onChange={(e) => {
            const label = e.target.value;
            setFilters((prev) => ({ ...prev, sortLabel: label, sortBy: SORT_KEY_MAP[label] }));
          }}
          className="text-sm px-4 py-2 rounded-xl outline-none transition-all cursor-pointer"
          style={{
            background: "rgb(34, 51, 59)",
            border: "1px solid rgba(157,220,255,0.1)",
            color: "#75a4bd",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {Object.keys(SORT_KEY_MAP).map((label) => (
            <option key={label}>{label}</option>
          ))}
        </select>
      </div>

      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}
      >
        <div
          className="mt-3 p-6 rounded-2xl"
          style={{
            background: "rgba(10,13,18,0.9)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(157,220,255,0.08)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
            <FilterGroup title="Category"    items={["Digital","Illustration","Photography","Abstract"]}    selected={filters.categories}   onToggle={toggle("categories")}   />
            <FilterGroup title="Medium"      items={["Oil","Watercolor","Ink","Mixed Media"]}               selected={filters.mediums}       onToggle={toggle("mediums")}       />
            <FilterGroup title="Price"       items={Object.keys(PRICE_RANGE_MAP)}                           selected={filters.priceLabels}   onToggle={toggle("priceLabels")}   />
            <FilterGroup title="Orientation" items={["Landscape","Portrait","Square"]}                      selected={filters.orientations}  onToggle={toggle("orientations")}  />
          </div>

          <div
            className="h-px w-full mb-4"
            style={{ background: "linear-gradient(90deg, transparent, rgba(157,220,255,0.1), transparent)" }}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClear}
              className="px-5 py-2 text-sm rounded-xl font-medium transition-all hover:bg-[#1a2028]"
              style={{ border: "1px solid rgba(157,220,255,0.1)", color: "#6b8090", fontFamily: "'DM Mono', monospace" }}
            >
              Clear all
            </button>
            <button
              onClick={() => { 
                onApply();      // FIXED: Invokes active backend connection pipeline mapping
                setOpen(false); 
              }}
              className="px-5 py-2 text-sm rounded-xl font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #3baedc, #52c7f5)",
                color: "#060a0f",
                fontFamily: "'DM Mono', monospace",
                boxShadow: "0 0 20px rgba(59,174,220,0.3)",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Art Card ───────────────────────────────────────────────────────── */
const ArtCard = ({ id, img, title, artist, price, index = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCart = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/cart/add?artworkId=${encodeURIComponent(id)}`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) { toast.error("Failed to add to cart", { description: "Please try again later." }); return; }
      toast.success("Added to Cart", { description: "The artwork has been added to your cart." });
    } catch (err) {
      console.error(err);
      toast.success("Already in Cart", { description: "This artwork is already in your cart." });
    }
  };

  const handleSaved = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/artworks/saved?artworkId=${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ artworkId: id }),
      });
      if (!res.ok) { toast.error("Failed to add to saved", { description: "Please try again later." }); return; }
      toast.success("Added to Saved", { description: "The artwork has been added to your saved list." });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="relative group break-inside-avoid rounded-2xl overflow-hidden mb-6"
      style={{
        background: "#0d1117",
        border: "1px solid rgba(157,220,255,0.07)",
        animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms both`,
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(157,220,255,0.2)";
        e.currentTarget.style.boxShadow   = "0 8px 40px rgba(59,174,220,0.12)";
        e.currentTarget.style.transform   = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(157,220,255,0.07)";
        e.currentTarget.style.boxShadow   = "0 2px 20px rgba(0,0,0,0.4)";
        e.currentTarget.style.transform   = "translateY(0)";
      }}
    >
      <div className="relative overflow-hidden">
        {!imgLoaded && (
          <div className="w-full h-64 relative overflow-hidden" style={{ background: "#111318", animation: "skeletonPulse 1.8s ease-in-out infinite" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(157,220,255,0.04) 50%, transparent 100%)", animation: "shimmer 1.8s ease-in-out infinite", backgroundSize: "200% 100%" }} />
          </div>
        )}
        <img src={img} alt={title} onLoad={() => setImgLoaded(true)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ display: imgLoaded ? "block" : "none" }} />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-white text-sm font-semibold leading-tight truncate pr-2" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"><MoreHorizontal size={16} /></button>
        </div>
        <p className="text-xs text-gray-500 mb-3 truncate" style={{ fontFamily: "'DM Mono', monospace" }}>{artist}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold" style={{ color: "#9ddcff", fontFamily: "'DM Mono', monospace" }}>₹{price}</span>
          <Link to={`/buyer/checkout?artworkId=${id}&quantity=1`}>
            <button
              className="text-xs px-4 py-1.5 rounded-lg font-bold transition-all"
              style={{ background: "linear-gradient(135deg, rgba(59,174,220,0.15), rgba(82,199,245,0.15))", border: "1px solid rgba(59,174,220,0.3)", color: "#52c7f5", fontFamily: "'DM Mono', monospace" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #3baedc, #52c7f5)"; e.currentTarget.style.color = "#060a0f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,174,220,0.15), rgba(82,199,245,0.15))"; e.currentTarget.style.color = "#52c7f5"; }}
            >Buy Now</button>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} className="absolute bottom-16 right-4 rounded-xl shadow-2xl text-sm w-44 z-20 overflow-hidden"
          style={{ background: "#0d1117", border: "1px solid rgba(157,220,255,0.12)", animation: "menuPop 0.15s cubic-bezier(0.16,1,0.3,1)" }}>
          {[
            { label: "View Details", icon: <Eye size={13} />,      action: () => navigate("/buyer/artDetail", { state: { data: id } }) },
            { label: "Add to Saved", icon: <Bookmark size={13} />, action: handleSaved },
            { label: "Add to Cart",  icon: <ShoppingCart size={13} />, action: handleCart },
          ].map((item, i) => (
            <button key={i} onClick={() => { item.action(); setMenuOpen(false); }}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-gray-300 transition-all"
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(157,220,255,0.08)"; e.currentTarget.style.color = "#9ddcff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#d1d5db"; }}
            >
              <span style={{ color: "rgba(157,220,255,0.5)" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function BrowseArt() {
  const [open, setOpen]         = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState(EMPTY_FILTERS);

  /* Helper definition to handle fetching filter data */
  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/artworks/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildFilterDTO(filters)),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setArtworks(data);
    } catch (err) {
      console.error("Filter failed:", err);
      toast.error("Filter failed", { description: "Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  /* Run when component mounts OR when sort metrics alter explicitly */
  useEffect(() => {
    handleApply();
  }, [filters.sortBy]);

  /* Clear → reset state + reload all */
  const handleClear = async () => {
    setFilters(EMPTY_FILTERS);
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:8080/api/artworks/all");
      const data = await res.json();
      setArtworks(data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  
  const skeletonHeights = ["h-52","h-72","h-64","h-80","h-56","h-68","h-60","h-76"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shimmer      { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes skeletonPulse{ 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown    { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes menuPop      { from{opacity:0;transform:scale(0.92) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes gridReveal   { from{opacity:0} to{opacity:1} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0d12}
        ::-webkit-scrollbar-thumb{background:#1e2530;border-radius:2px}
      `}</style>

      <div className="min-h-screen" style={{ background:"#100D0D", fontFamily:"'Syne', sans-serif", position:"relative", overflow:"hidden" }}>
        <div className="mx-10 mt-5">
          <BackButton/>
        </div>
        <div style={{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"80vw", height:"60vh", background:"radial-gradient(ellipse at center, rgba(59,174,220,0.04) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:"-10%", right:"-10%", width:"40vw", height:"40vh", background:"radial-gradient(ellipse at center, rgba(82,199,245,0.03) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        <div className="relative z-10 px-6 md:px-10 pt-8 pb-16 max-w-[1600px] mx-auto">

          <div className="mb-8" style={{ animation:"fadeUp 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color:"rgba(157,220,255,0.4)", fontFamily:"'DM Mono', monospace" }}>Explore Collection</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-none" style={{ background:"linear-gradient(135deg, #ffffff 40%, rgba(157,220,255,0.6))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Browse Art</h1>
            {!loading && <p className="text-sm mt-2" style={{ color:"rgba(157,220,255,0.3)", fontFamily:"'DM Mono', monospace" }}>{artworks.length} works available</p>}
          </div>

          <div className="mb-8 cursor-pointer">
            <FilterBar 
              open={open} 
              setOpen={setOpen} 
              filters={filters} 
              setFilters={setFilters} 
              onApply={handleApply} // Linked perfectly to match the destructuring props contract
              onClear={handleClear} 
            />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5" style={{ animation:"gridReveal 0.4s ease 0.2s both" }}>
            {loading
              ? skeletonHeights.map((h, i) => <SkeletonCard key={i} height={h} />)
              : artworks.map((art, i) => <ArtCard key={art.id} id={art.id} img={art.imageUrl} title={art.title} artist={art.artist} price={art.price} index={i} />)
            }
          </div>

          {!loading && artworks.length === 0 && (
            <div className="text-center py-32" style={{ animation:"fadeUp 0.6s ease" }}>
              <div className="text-6xl mb-6 opacity-20" style={{ filter:"grayscale(1)" }}>🎨</div>
              <p className="text-gray-500 text-lg font-semibold">No artworks found</p>
              <p className="text-sm mt-2" style={{ color:"rgba(157,220,255,0.2)", fontFamily:"'DM Mono', monospace" }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}