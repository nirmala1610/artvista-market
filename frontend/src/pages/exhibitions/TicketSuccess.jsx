import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, CheckCircle2, MapPin, Ticket, ArrowLeft, Loader2, QrCode } from "lucide-react";
import { domToJpeg } from "modern-screenshot";

const TicketSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!state || !state.exhibition) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 font-medium">No pass information found.</p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </button>
      </div>
    );
  }

  const { exhibition, quantity, passId } = state;

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await domToJpeg(ticketRef.current, {
        quality: 0.95,
        scale: 2,
        features: { foreignObject: true }
      });

      const link = document.createElement("a");
      const sanitizedTitle = exhibition.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `artvista-free-pass-${sanitizedTitle}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate pass download:", error);
      alert("Export failed. Please capture a quick screenshot of your pass instead!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white p-6 md:p-10 flex flex-col items-center justify-center gap-8">
      
      {/* Success Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center justify-center bg-cyan-500/10 p-3 rounded-full border border-cyan-500/20 text-cyan-400 mb-2 shadow-lg shadow-cyan-500/5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-cyan-400">
          Access Granted!
        </h1>
        <p className="text-gray-400 text-sm">Your free pass is claimed. Save it to present at entry.</p>
      </motion.div>

      {/* Physical Pass Container */}
      <div
        ref={ticketRef}
        className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative border border-gray-800 bg-[#0D111A]"
      >
        {/* Top Image Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-900">
          <img 
            src={exhibition.bannerUrl || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"} 
            alt={exhibition.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D111A] via-[#0D111A]/40 to-black/30" />
          
          <span className="absolute top-4 right-4 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Free Entry Pass
          </span>
        </div>

        {/* Middle Details */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              Art Gallery RSVP
            </span>
            <h2 className="text-xl font-black mt-2 tracking-tight leading-tight text-white">
              {exhibition.title}
            </h2>
          </div>

          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>{exhibition.city || "Main Gallery Room"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>Admit <strong className="text-white text-base">{quantity}</strong> {quantity > 1 ? "visitors" : "visitor"}</span>
            </div>
          </div>
        </div>

        {/* Pass Tear Line */}
        <div className="relative flex items-center py-2 px-3">
          <div className="w-6 h-6 bg-[#05070B] border-r border-gray-800 rounded-full absolute -left-3 z-10" />
          <div className="w-full border-t-2 border-dashed border-gray-800" />
          <div className="w-6 h-6 bg-[#05070B] border-l border-gray-800 rounded-full absolute -right-3 z-10" />
        </div>

        {/* Bottom Stub */}
        <div className="p-6 pt-3 bg-black/20 flex items-center justify-between gap-4">
          <div className="text-left space-y-1 flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Pass Reference</p>
            <p className="text-xs font-mono text-gray-400 select-all truncate bg-white/[0.02] px-2 py-1 rounded border border-white/5">
              {passId}
            </p>
            <p className="text-[11px] text-emerald-400 font-medium pt-1">Status: Confirmed</p>
          </div>

          {/* Minimal visual QR placeholder instead of financial barcode */}
          <div className="p-2 bg-white rounded-xl flex items-center justify-center opacity-90 shrink-0">
            <QrCode className="w-12 h-12 text-black" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          disabled={isDownloading}
          className="w-full sm:w-auto flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/10 text-sm"
        >
          Go Home
        </button>

        <button
          onClick={downloadTicket}
          disabled={isDownloading}
          className="w-full sm:w-auto flex-[2] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-800 disabled:to-gray-800 text-black font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Pass...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Entry Pass
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default TicketSuccess;