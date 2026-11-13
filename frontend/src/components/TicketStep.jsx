import React from "react";

const TicketStep = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, isPaid: false })}
          className={`px-5 py-3 rounded-xl ${
            !formData.isPaid ? "bg-cyan-500" : "bg-white/10"
          }`}
        >
          Free
        </button>

        <button
          type="button"
          onClick={() => setFormData({ ...formData, isPaid: true })}
          className={`px-5 py-3 rounded-xl ${
            formData.isPaid ? "bg-cyan-500" : "bg-white/10"
          }`}
        >
          Paid
        </button>
      </div>

      {formData.isPaid && (
        <>
          <input
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="Ticket Price"
            className="w-full p-4 rounded-2xl bg-[#0D1117]"
          />

          <input
            name="vipPrice"
            value={formData.vipPrice}
            onChange={handleChange}
            placeholder="VIP Price"
            className="w-full p-4 rounded-2xl bg-[#0D1117]"
          />
        </>
      )}

      <input
        name="maxVisitors"
        value={formData.maxVisitors}
        onChange={handleChange}
        placeholder="Max Visitors"
        className="w-full p-4 rounded-2xl bg-[#0D1117]"
      />
    </div>
  );
};

export default TicketStep;