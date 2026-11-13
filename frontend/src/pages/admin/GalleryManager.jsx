import React, { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Eye,
  Settings2,
  Clock3,
  BadgeCheck,
  Users,
  Lock,
  Sparkles,
} from "lucide-react";

const statusStyles = {
  PENDING:
    "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",

  APPROVED:
    "bg-green-500/15 text-green-300 border border-green-500/20",

  REJECTED:
    "bg-red-500/15 text-red-300 border border-red-500/20",
};

const StaffRoleManagement = () => {
  
const [stats, setStats] = useState(null);
const [roleRequests, setRoleRequests] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [currentPage, setCurrentPage] = useState(1);

const [showModal, setShowModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [selectedStatus, setSelectedStatus] = useState("");

const openConfirmation = (id, status) => {
  setSelectedId(id);
  setSelectedStatus(status);
  setShowModal(true);
};

const applicationsPerPage = 5;

const lastIndex = currentPage * applicationsPerPage;

const firstIndex = lastIndex - applicationsPerPage;

const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchStaffData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/admin/staff-management",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setStats(data.stats);
      setRoleRequests(data.applications);

    } catch (error) {
      console.error(error);
    }
  };

  fetchStaffData();
}, [token]);
  const statCards = [
    {
      title: "Total Applications",
      value: stats?.totalApplications,
      color: "text-cyan-300",
    },
    {
      title: "Approved",
      value: stats?.approvedApplications,
      color: "text-green-400",
    },
    {
      title: "Pending",
      value: stats?.pendingApplications,
      color: "text-yellow-300",
    },
    {
      title: "Rejected",
      value: stats?.rejectedApplications,
      color: "text-red-400",
    },
  ];
const filteredApplications = roleRequests.filter((app) => {

  const matchesSearch =
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" ||
    app.approved === statusFilter;

  return matchesSearch && matchesStatus;
});

const currentApplications =
  filteredApplications.slice(firstIndex, lastIndex);

const totalPages = Math.ceil(
  filteredApplications.length / applicationsPerPage
);
const confirmAction = async () => {
  await updateStatus(selectedId, selectedStatus);
};
const updateStatus = async (id, status) => {
  try {

    const response = await fetch(
      `http://localhost:8080/api/admin/curator-status/${id}?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    setRoleRequests((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, approved: status }
          : app
      )
    );

    setShowModal(false);

    const result = await response.text();
    console.log(result);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-[#05070B] flex overflow-hidden relative font-['Jost'] text-white">

      {/* Background Glow */}
      <div className="absolute -top-52 -left-44 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full"></div>

      <div className="absolute -bottom-52 -right-44 w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <SideBar />

      <div className="flex-1 p-8 relative z-10 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-5xl font-black font-['Poller_One'] tracking-wide">
              STAFF ROLE MANAGEMENT
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Manage admin access, permissions & staff assignments.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Sparkles className="text-cyan-300" size={20} />

            <span className="text-sm text-gray-300">
              Secure Access Control Enabled
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {statCards?.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-2xl"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-400 mb-3">
                    {stat.title}
                  </p>

                  <h2 className={`text-5xl font-black ${stat.color}`}>
                    {stat.value}
                  </h2>
                </div>

                <Users className={stat.color} size={32} />
              </div>

              <div className={`mt-5 text-sm ${stat.color}`}>
                Updated recently
              </div>
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 backdrop-blur-3xl">

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">

            <div>
              <h2 className="text-3xl font-bold">
                Staff Role Requests
              </h2>

              <p className="text-gray-400 mt-2">
                Review and manage platform staff permissions.
              </p>
            </div>

            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-[260px]">

                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search curator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-5 py-3 rounded-2xl bg-black/50 text-white border border-white/10 backdrop-blur-3xl"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Staff Cards */}
          <div className="space-y-6">

            {currentApplications?.map((staff, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 rounded-[30px] p-6 transition-all duration-300"
              >

                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">

                  {/* LEFT */}
                  <div className="flex-1">

                    {/* Profile */}
                    <div className="flex items-center gap-5">

                      <img
                        src={staff.profilePhoto}
                        alt="staff"
                        className="w-20 h-20 rounded-3xl object-cover border border-white/10"
                      />

                      <div>
                        <h3 className="text-2xl font-bold">
                          {staff.fullName}
                        </h3>

                        <p className="text-gray-400 mt-1">
                          {staff.email}
                        </p>

                        <div className="flex items-center gap-3 mt-4 flex-wrap">

                          {/* Role */}
                          <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/10 text-sm">
                            {staff.currentRole}
                          </span>

                          <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
                            {staff.experience}
                          </span>

                          {/* Status */}
                          <span
                            className={`px-4 py-2 rounded-full text-sm ${statusStyles[staff.approved]}`}
                          >
                            {staff.approved}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div className="mt-8">

                      <h4 className="text-lg font-semibold mb-4">
                        Skills
                      </h4>

                      <div className="grid md:grid-cols-2 gap-4">

                    {staff.skills?.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5"
                      >
                        <ShieldCheck
                          size={18}
                          className="text-green-400"
                        />

                        <span className="text-gray-300 text-sm">
                          {skill}
                        </span>
                      </div>
                    ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold mb-4">
                        Specializations
                      </h4>

                      <div className="flex flex-wrap gap-3">
                        {staff.specializations?.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Timeline */}
                    <div className="mt-8">

                      <h4 className="text-lg font-semibold mb-4">
                        Activity Timeline
                      </h4>
                      <div className="space-y-4">

                        <div className="flex items-start gap-3">
                          <Clock3 size={18} className="text-cyan-300 mt-0.5" />
                          <p className="text-gray-400 text-sm">
                            Application Submitted
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock3 size={18} className="text-cyan-300 mt-0.5" />
                          <p className="text-gray-400 text-sm">
                            {new Date(staff.createdAt).toLocaleString()}
                          </p>
                        </div>

                         </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION PANEL */}
                  <div className="xl:w-[300px]">

                    <div className="bg-white/5 border border-white/10 rounded-[28px] p-6">

                      <h3 className="text-xl font-bold mb-6">
                        Admin Actions
                      </h3>

                      <div className="space-y-4">
                      <button
                        disabled={staff.approved === "APPROVED"}
                        className={`w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl
                          ${
                            staff.approved === "APPROVED"
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-green-500/15 text-green-300"
                          }
                        `}
                        onClick={() => openConfirmation(staff.id, "APPROVED")}
                      >
                        <UserCheck size={18} />
                        Approve Role
                      </button>

                      <button
                        disabled={staff.approved === "REJECTED"}
                        className={`w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl
                          ${
                            staff.approved === "REJECTED"
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-red-500/15 text-red-300"
                          }
                        `}
                        onClick={() => openConfirmation(staff.id, "REJECTED")}
                      >
                        <UserX size={18} />
                        Reject Role
                      </button>
                        </div>

                      {/* Security */}
                      <div className="flex flex-col gap-4 mt-5 p-5 rounded-2xl">
                        <a
                        href={staff.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-cyan-500/15 text-cyan-300"
                      >
                        <Eye size={18} />
                        Portfolio
                      </a>
                      <a
                        href={staff.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-cyan-500/15 text-cyan-300"
                      >
                        <Eye size={18} />
                        Resume
                      </a>
                      </div>

                      {/* Verification */}
                  <div
                    className={`mt-5 p-5 rounded-2xl border ${
                      staff.approved === "APPROVED"
                        ? "bg-green-500/10 border-green-500/10"
                        : "bg-yellow-500/10 border-yellow-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <BadgeCheck
                        size={18}
                        className={
                          staff.approved === "APPROVED"
                            ? "text-green-300"
                            : "text-yellow-300"
                        }
                      />

                      <h4
                        className={`font-semibold ${
                          staff.approved === "APPROVED"
                            ? "text-green-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {staff.approved === "APPROVED"
                          ? "Verification Complete"
                          : "Verification Pending"}
                      </h4>

                    </div>

                    <p className="text-gray-300 text-sm mt-3">
                      {staff.approved === "APPROVED"
                        ? "Identity and account documents verified."
                        : "Awaiting admin approval and document verification."}
                    </p>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-10 pt-6 border-t border-white/10 gap-5">

            <p className="text-gray-400 text-sm">
             Showing {firstIndex + 1} to{" "}
              {Math.min(lastIndex, filteredApplications.length)}
              of {filteredApplications.length} applications
            </p>
            <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-5 py-2 rounded-xl ${
                    currentPage === index + 1
                      ? "bg-cyan-500 text-white"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              Next
            </button>

          </div>
          </div>
          
        </div>
        
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="w-[450px] bg-[#0B0F17] border border-white/10 rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-4">
        Confirm Action
      </h2>

      <p className="text-gray-400 mb-8">
        Are you sure you want to
        {" "}
        <span
          className={
            selectedStatus === "APPROVED"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {selectedStatus.toLowerCase()}
        </span>
        {" "}
        this curator application?
      </p>

      <div className="flex justify-end gap-4">

        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10"
        >
          Cancel
        </button>

        <button
          onClick={confirmAction}
          className={`px-5 py-3 rounded-xl text-white ${
            selectedStatus === "APPROVED"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          Confirm
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
};

export default StaffRoleManagement;