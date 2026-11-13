import React, { useEffect, useState } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import { uploadToCloudinary } from "../../util/cloudinaryUpload"
import { toast } from 'sonner';

const Tickets = () => {
  const token = localStorage.getItem('token');
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("PAYMENT");
  const [priority, setPriority] = useState("LOW");
  const [screenshot, setScreenshot] = useState("");
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/getTicket", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          description,
          category,
          priority,
          screenshot, // Included screenshot state in payload
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit ticket");
      }

      setSubject("");
      setDescription("");
      setCategory("PAYMENT");
      setPriority("LOW");
      setScreenshot(""); // Reset screenshot on success

      toast.success("Ticket submitted successfully");
      fetchTickets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit ticket");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG and JPG allowed");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(file);
      setScreenshot(imageUrl);
      toast.success("Screenshot uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Screenshot upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white">
      <CustomerHeader />

      <div className="flex">
        <CustomerSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-black">HELP & SUPPORT</h1>
            <p className="text-gray-400 mt-3 text-lg">
              Report issues, ask questions, and track support requests.
            </p>
          </div>

          {/* Create Ticket */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-8">
            <h2 className="text-3xl font-bold mb-6">Create Support Ticket</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <label className="block mb-2 text-gray-300">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter issue title"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-gray-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none"
                >
                  <option value="PAYMENT">Payment</option>
                  <option value="REFUND">Refund</option>
                  <option value="ARTWORK">Artwork</option>
                  <option value="ACCOUNT">Account</option>
                  <option value="TECHNICAL">Technical Issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block mb-2 text-gray-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 text-white border border-white/10 outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Upload */}
              <div>
                <label className="block mb-2 text-gray-300">Screenshot (Optional)</label>
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                  onChange={handleUpload}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block mb-2 text-gray-300">Description</label>
              <textarea
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none"
              />
            </div>

            <button
              className="mt-6 px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold"
              onClick={submitTicket}
            >
              Submit Ticket
            </button>
          </div>

          {/* Conditional Rendering: Only displays stats and list if tickets exist */}
          {tickets.length > 0 && (
            <>
              {/* Ticket Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400">Total Tickets</p>
                  <h2 className="text-4xl font-black text-cyan-300 mt-2">
                    {tickets.length}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400">Open Tickets</p>
                  <h2 className="text-4xl font-black text-yellow-300 mt-2">
                    {tickets.filter(ticket => ticket.status === "OPEN").length}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">
                  <p className="text-gray-400">Resolved</p>
                  <h2 className="text-4xl font-black text-green-400 mt-2">
                    {tickets.filter(ticket => ticket.status === "RESOLVED").length}
                  </h2>
                </div>
              </div>

              {/* My Tickets */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <h2 className="text-3xl font-bold mb-6">My Support Tickets</h2>

                <div className="space-y-5">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id || ticket.ticketId}
                      className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-cyan-400/30 transition"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-5">
                        <div>
                          <h3 className="text-xl font-semibold text-cyan-300">
                            {ticket.ticketId}
                          </h3>
                          <p className="mt-2 text-white">{ticket.subject}</p>
                          <p className="text-gray-400 mt-2 text-sm">
                            Created on {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3">
                          <span className="px-4 py-2 rounded-full bg-yellow-500/15 text-yellow-300 text-sm font-medium">
                            {ticket.status}
                          </span>
                          <span className="px-4 py-2 rounded-full bg-red-500/15 text-red-300 text-sm font-medium">
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tickets;