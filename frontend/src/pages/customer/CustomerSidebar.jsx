import React from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { BiSupport } from "react-icons/bi";

import { FaHeart, FaUserLock } from "react-icons/fa";

import { HiOutlineLogout } from "react-icons/hi";
import { MdOutlineBugReport } from "react-icons/md";
import { ImLocation, ImTruck } from "react-icons/im";
import { motion } from "framer-motion";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineSyncProblem } from "react-icons/md";
const CustomerSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-300
    ${
      isActive
        ? "bg-[#24303d] text-cyan-300"
        : "text-white hover:bg-[#1d2630]"
    }`;

  return (

    <div className="sticky top-10 self-start w-72 shrink-0 mx-12 my-10">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#161A20] rounded-3xl p-6 space-y-2">

        {/* Orders */}
        <NavLink
          to="/buyer/dashboard"
          className={navClass}
        >
          <ImTruck className="w-7 h-7 shrink-0" />

          <span>Your Orders</span>
        </NavLink>

        {/* Address */}
        <NavLink
          to="/buyer/address"
          className={navClass}
        >
          <ImLocation className="w-7 h-7 shrink-0" />

          <span>Your Address</span>
        </NavLink>

        {/* Saved */}
        <NavLink
          to="/buyer/saved-item"
          className={navClass}
        >
          <FaHeart className="w-7 h-7 shrink-0" />

          <span>Saved Items</span>
        </NavLink>
        <NavLink
          to="/buyer/tickets"
          className={navClass}
        >
          <IoTicketOutline className="w-7 h-7 shrink-0" />

          <span>Raise a Ticket</span>
        </NavLink>
        <NavLink
          to="/buyer/reportCenter"
          className={navClass}
        >
          <MdOutlineBugReport className="w-7 h-7 shrink-0" />

          <span>Report Center</span>
        </NavLink>
        <NavLink
          to="/buyer/disputeCenter"
          className={navClass}
        >
          <MdOutlineSyncProblem className="w-7 h-7 shrink-0" />

          <span>Open Dispute</span>
        </NavLink>

        {/* Support */}
        <NavLink
          to="/buyer/contactSupport"
          className={navClass}
        >
          <BiSupport className="w-7 h-7 shrink-0" />

          <span>FAQ's</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-300 text-white hover:bg-red-500/20 w-full mt-3"
        >
          <HiOutlineLogout className="w-7 h-7 shrink-0" />

          <span>Log Out</span>
        </button>

      </motion.div>

    </div>
  );
};

export default CustomerSidebar;