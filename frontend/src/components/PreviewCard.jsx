import React from "react";

const PreviewCard = ({ formData }) => {

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-4">{formData.title || "Untitled"}</h2>

      <p className="text-gray-400">{formData.themeName}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p>Category: {formData.category}</p>
        <p>
          Dates: {formData.startDate} → {formData.endDate}
        </p>
        <p>
          Ticket: {formData.isPaid ? `₹${formData.ticketPrice}` : "Free"}
        </p>
        <p>Artists: {formData.selectedArtists.length}</p>
      </div>
    </div>
  );
};

export default PreviewCard;