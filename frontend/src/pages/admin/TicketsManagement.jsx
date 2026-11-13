import React, { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";
import {
  Search,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const TicketsManagement = () => {
  const token = localStorage.getItem("token");
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/reports/getAllTicket",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setTickets(data.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, [token]);

  const statusBadge = (status) => {
    if (status === "OPEN") return "bg-red-500/20 text-red-400";
    if (status === "IN_PROGRESS" || status === "UNDER_REVIEW") return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>
      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 p-8 z-10">
        <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
        <p className="text-gray-400 mb-6">
          Manage all user support requests
        </p>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr className="text-left">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Artwork Title</th>
                <th className="p-4">Artist</th>
                <th className="p-4">Reporter ID</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Evidence</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{ticket.id}</td>
                  <td className="p-4 font-semibold text-cyan-400">{ticket.artworkTitle}</td>
                  <td className="p-4">{ticket.artistName}</td>
                  <td className="p-4 text-gray-400">User #{ticket.userId}</td>
                  <td className="p-4">
                    <span className="text-sm bg-white/5 px-2 py-1 rounded border border-white/10 block w-fit">
                      {ticket.reason}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.evidence ? (
                      <a 
                        href={ticket.evidence} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm underline decoration-cyan-500/30 transition-all"
                      >
                        View Image <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">No link</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${statusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status?.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No tickets found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsManagement;