import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { FaPaintBrush, FaUpload } from "react-icons/fa";
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { SiGoogleanalytics } from "react-icons/si";
import { BiSupport } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";

const ArtistSidebar = () => {
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
    <div className="sticky top-10 self-start w-[320px] my-20 ml-10">

      <div className="bg-[#161A20] rounded-3xl p-6 shadow-2xl">

        <NavLink to="/artist/dashboard" className={navClass}>
          <FaPaintBrush className="w-7 h-7 shrink-0" />
          <span>My Artworks</span>
        </NavLink>

        <NavLink to="/artist/upload-artwork" className={navClass}>
          <FaUpload className="w-7 h-7 shrink-0" />
          <span>Upload Artwork</span>
        </NavLink>

        <NavLink to="/artist/orders" className={navClass}>
          <PiListMagnifyingGlassBold className="w-7 h-7 shrink-0" />
          <span>Orders & Sales</span>
        </NavLink>

        <NavLink to="/artist/analytics" className={navClass}>
          <SiGoogleanalytics className="w-7 h-7 shrink-0" />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/artist/support" className={navClass}>
          <BiSupport className="w-7 h-7 shrink-0" />
          <span>Support</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-300 text-white hover:bg-red-500/20 w-full mt-3"
        >
          <HiOutlineLogout className="w-7 h-7 shrink-0" />
          <span>Log Out</span>
        </button>

      </div>

    </div>
  );
};

export default ArtistSidebar;