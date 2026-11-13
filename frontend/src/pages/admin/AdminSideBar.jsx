import { GrDocumentUser } from "react-icons/gr";
import {
  FaPalette,
  FaUsers,
  FaChartLine,
  FaFlag,
  FaCrown,
  FaChartPie
} from "react-icons/fa";
import { MdOutlineSyncProblem } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { NavLink,useNavigate} from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { useState,useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
const SideBar = () => {
      const [profileData, setProfileData] = useState(null);
      const navigate = useNavigate();

      const token = localStorage.getItem("token");
      useEffect(() => {
        const fetchProfile = async () => {
          try {
            const res = await fetch("http://localhost:8080/api/auth/profile", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            setProfileData(data);
          } catch (err) {
            console.error(err);
          }
        };
    
        if (token) fetchProfile();
      }, [token]);

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  const baseClasses =
    "flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition";
  const activeClasses =
    "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border border-cyan-400/20 shadow-lg shadow-cyan-500/10";
  const inactiveClasses = "hover:bg-white/10";

  return (
    
    <div className="w-[320px] min-h-screen bg-white/5 border-r border-white/10 backdrop-blur-3xl px-7 py-8 flex flex-col justify-between relative z-10">
      <div>
        <NavLink to="/admin/dashboard">
          <div className="flex items-center gap-4 mb-14">
            <img
              src="/ArtVista.png"
              alt="ArtVista"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
            />
            <div>
              <h1 className="text-white text-2xl font-black">ArtVista</h1>
              <p className="text-gray-400 text-sm">Admin Dashboard</p>
            </div>
          </div>
        </NavLink>

        <div className="flex flex-col gap-4">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          <FaChartPie className="text-white text-2xl" />

          <p className="text-white font-semibold text-[16px]">
            Overview
          </p>
        </NavLink>
          <NavLink
            to="/admin/dashboard/application-approval"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <GrDocumentUser className="text-white text-2xl" />
            <p className="text-white font-semibold text-[16px]">
              Artist Applications
            </p>
          </NavLink>
          <NavLink
            to="/admin/dashboard/gallary-manager"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <GrUserManager className="text-white text-2xl" />
            <p className="text-white font-semibold text-[16px]">
              Gallery Manager
            </p>
          </NavLink>

          {/* <NavLink
            to="/admin/dashboard/artwork-moderation"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaPalette className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">Artworks</p>
          </NavLink> */}

          <NavLink
            to="/admin/dashboard/user-management"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaUsers className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">
              User Management
            </p>
          </NavLink>

          <NavLink
            to="/admin/dashboard/disputes"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <MdOutlineSyncProblem className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">Disputes</p>
          </NavLink>
          <NavLink
            to="/admin/dashboard/tickets"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <IoTicketOutline className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">Tickets</p>
          </NavLink>

          <NavLink
            to="/admin/dashboard/reports"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaFlag className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">Reports</p>
          </NavLink>

          <NavLink
            to="/admin/dashboard/analytics"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <SiGoogleanalytics className="text-white text-2xl" />
            <p className="text-gray-200 font-medium text-[16px]">Aanalytics</p>
          </NavLink>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <img
            src={profileData?.image}
            alt="Admin"
            className="w-16 h-16 rounded-2xl object-cover border border-cyan-400/20"
          />
          <div>
            <h1 className="text-white text-lg font-bold uppercase">
              {profileData?.name}
            </h1>
            <p className="text-gray-400 text-sm">Super Administrator</p>
          </div>
        </div>
        <button className="w-full mt-5 flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl py-3 transition"
          onClick={handleLogout}  >
          <RiLogoutBoxRFill className="text-red-400 text-2xl" />
          <span className="text-red-300 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
