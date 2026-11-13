import React from "react";

const ScheduleStep = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="p-4 rounded-2xl bg-[#0D1117]"
      />

      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        className="p-4 rounded-2xl bg-[#0D1117]"
      />

      <input
        type="time"
        name="openTime"
        value={formData.openTime}
        onChange={handleChange}
        className="p-4 rounded-2xl bg-[#0D1117]"
      />

      <input
        type="time"
        name="closeTime"
        value={formData.closeTime}
        onChange={handleChange}
        className="p-4 rounded-2xl bg-[#0D1117]"
      />
    </div>
  );
};

export default ScheduleStep;