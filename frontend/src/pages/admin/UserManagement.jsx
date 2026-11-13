import React, { useEffect, useState } from "react";
import SideBar from "./AdminSideBar";

import {
  Search,
  Filter,
  Users,
  ShieldCheck,
  UserX,
  Crown,
  Eye,
  Ban,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";



const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;

  const [search, setSearch] = useState("");

   useEffect(() => {
      if(token)
        fetchUsers();
  }, [token]);
  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8080/api/admin/allUsers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    setUsers(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;

    if (filter === "ARTISTS") {
      matchesFilter = user.role==="ARTIST";
    } else if (filter === "CURATORS") {
      matchesFilter = user.role === "CURATOR";
    } else if (filter === "USERS") {
      matchesFilter =
        !(user.isArtist === true || user.isArtist === "true") &&
        !(user.isCurater === true || user.isCurater === "true");
    }

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-cyan-400"></div>
      </div>
    );
  }
return (
  <div className="min-h-screen bg-[#05070B] flex text-white overflow-hidden relative">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-cyan-500/10 blur-[180px] rounded-full"></div>
    <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-blue-500/10 blur-[180px] rounded-full"></div>

    <SideBar />

    <div className="flex-1 p-8 relative z-10 overflow-y-auto">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black">User Management</h1>
          <p className="text-gray-400 mt-2">
            Manage all platform users, artists and curators.
          </p>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
          <Sparkles size={18} className="text-cyan-300" />
          <span className="text-sm text-gray-300">
            Admin Control Panel
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-full md:w-[400px]">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-white"
          />
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-black/50 text-white"
          >
            <option value="ALL">All</option>
            <option value="ARTISTS">Artists</option>
            <option value="CURATORS">Curators</option>
            <option value="USERS">Users</option>
          </select>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

        {/* Table Header */}
        <div className="hidden xl:grid xl:grid-cols-8 gap-4 px-6 py-5 border-b border-white/10 text-gray-400 text-sm">
          <p>User</p>
          <p>Contact</p>
          <p>Role</p>
          <p>Artist</p>
          <p>Curator</p>
          <p>Country</p>
          <p>Joined</p>
          <p className="text-right">Actions</p>
        </div>

        {/* Users */}
        <div className="divide-y divide-white/5">

          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="grid xl:grid-cols-8 gap-4 items-center px-6 py-5 hover:bg-white/[0.03] transition"
            >
              {/* User */}
              <div className="flex items-center gap-4">

                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                />

                <div>
                  <h3 className="font-semibold">
                    {user.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    ID #{user.id}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-sm">
                  {user.email}
                </p>

                <p className="text-xs text-gray-500">
                  {user.phone || "No Phone"}
                </p>
              </div>

              {/* Role */}
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20">
                  {user.role}
                </span>
              </div>

              {/* Artist */}
              <div>
                {user.role === "ARTIST" ? (
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">
                    No
                  </span>
                )}
              </div>

              {/* Curator */}
              <div>
                {user.role === "CURATOR" ? (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-xs border border-yellow-500/20">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">
                    No
                  </span>
                )}
              </div>

              {/* Country */}
              <div>
                <span className="text-sm">
                  {user.country || "N/A"}
                </span>
              </div>

              {/* Joined */}
              <div>
                <p className="text-sm">
                  {new Date(user.joinedAt).toLocaleDateString()}
                </p>

                <p className="text-xs text-gray-500">
                  Registered
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">

                <button className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition">
                  Suspend
                </button>

                <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition">
                  Ban
                </button>

              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              No users found
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">

        <p className="text-gray-400 text-sm">
          Total Users: {filteredUsers.length}
        </p>

        <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === i + 1
                ? "bg-cyan-500"
                : "bg-white/5 border border-white/10"
            }`}
          >
            {i + 1}
          </button>
        ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-50"
      >
        Next
      </button>
        </div>

      </div>
    </div>
  </div>
);
};

export default UserManagement;