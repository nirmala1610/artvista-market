import React from "react";
import { CalendarDays, Trash2, Edit3 } from "lucide-react";

const statusColors = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  UPCOMING: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  COMPLETED: "bg-gray-500/10 text-gray-400 border-white/10",
};

const CollectionCard = ({ exhibition, onDelete ,onEdit }) => {
  // Safe extraction for standard MongoDB String Hex IDs fallback
  const exhibitionId = exhibition._id || exhibition.id;

  return (
    <div className="group bg-white/[0.02] rounded-[28px] overflow-hidden border border-white/10 hover:border-cyan-500/30 backdrop-blur-3xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1 shadow-xl">
      
      {/* Visual Header / Banner Frame */}
      <div className="relative h-52 overflow-hidden bg-white/5">
        <img
          src={exhibition.bannerUrl || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"}
          alt={exhibition.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Absolute Status Badge Layer */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full border ${statusColors[exhibition.status] || statusColors.UPCOMING}`}>
            {exhibition.status || "UPCOMING"}
          </span>
        </div>
      </div>

      {/* Text / Action Body Container */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {exhibition.title}
          </h3>

          <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {exhibition.description || "No description set for this premium collection resource window profile."}
          </p>

          {/* Inline Meta Timing Info */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
            <CalendarDays size={14} className="text-cyan-400" />
            <span>{exhibition.startDate || "TBD"} — {exhibition.endDate || "TBD"}</span>
          </div>
        </div>

        {/* Dynamic Action Controls */}
        <div className="flex gap-2 mt-6">
          <button 
            type="button"
            onClick={() => onEdit(exhibition)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-medium transition text-gray-300"
          >
            <Edit3 size={15} />
            Modify
          </button>

          <button
            type="button"
            onClick={() => onDelete(exhibitionId)}
            className="px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent rounded-xl transition flex items-center justify-center"
            title="Delete Exhibition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;