
import {
  FaChartPie,
  FaImages,
  FaPaintBrush,
  FaStar,
  FaChartLine,
  FaComments,
  FaHandshake,
  FaShieldAlt,
  FaCog
} from "react-icons/fa";

import { RiLogoutBoxRFill } from "react-icons/ri";
import { NavLink,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

const SideBar = () => {
  const navigate = useNavigate();

     const token = localStorage.getItem("token");
     const [profileData, setProfileData] = useState({});

       
   const handleLogout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("role");
   navigate("/");
   };

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

  const baseClasses =
    "flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300";

  const activeClasses =
    "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border border-cyan-400/20 shadow-lg shadow-cyan-500/10";

  const inactiveClasses =
    "hover:bg-white/10 border border-transparent";

  return (
    <div className="w-[320px] min-h-screen bg-white/5 border-r border-white/10 backdrop-blur-3xl px-7 py-8 flex flex-col justify-between relative z-10">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <NavLink to="/">
          <div className="flex items-center gap-4 mb-14">
            <img
              src="/ArtVista.png"
              alt="ArtVista"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
            />

            <div>
              <h1 className="text-white text-2xl font-black">
                ArtVista
              </h1>

              <p className="text-gray-400 text-sm">
                Curator Dashboard
              </p>
            </div>
          </div>
        </NavLink>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-4">

          {/* OVERVIEW */}
        <NavLink
          to="/curator/dashboard"
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

          {/* EXHIBITIONS */}
          <NavLink
            to="/curator/dashboard/exhibitions"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaImages className="text-white text-2xl" />

            <p className="text-gray-200 font-medium text-[16px]">
             Create Exhibitions
            </p>
          </NavLink>

          {/* CURATION STUDIO */}
          <NavLink
            to="/curator/dashboard/curation-studio"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaPaintBrush className="text-white text-2xl" />

            <p className="text-gray-200 font-medium text-[16px]">
              Curation Studio
            </p>
          </NavLink>
          {/* ARTWORK SELECTION */}
          <NavLink
            to="/curator/dashboard/artwork-selection"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaImages className="text-white text-2xl" />

            <p className="text-gray-200 font-medium text-[16px]">
              Artwork Selection
            </p>
          </NavLink>

          {/* FEATURED ARTISTS */}
          <NavLink
            to="/curator/dashboard/featured-artists"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaStar className="text-white text-2xl" />

            <p className="text-gray-200 font-medium text-[16px]">
              Featured Artists
            </p>
          </NavLink>

          {/* ANALYTICS */}
          <NavLink
            to="/curator/dashboard/analytics"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <FaChartLine className="text-white text-2xl" />

            <p className="text-gray-200 font-medium text-[16px]">
              Analytics
            </p>
          </NavLink>

        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl mt-10">

        <div className="flex items-center gap-4">

          <img
            src={profileData.image}
            alt="Curator"
            className="w-16 h-16 rounded-2xl object-cover border border-cyan-400/20"
          />

          <div>
            <h1 className="text-white text-lg font-bold uppercase">
              {profileData.name}
            </h1>

            <p className="text-gray-400 text-sm">
              Lead Curator
            </p>
          </div>

        </div>

        <button className="w-full mt-5 flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl py-3 transition"
         onClick={handleLogout}>

          <RiLogoutBoxRFill className="text-red-400 text-2xl" />

          <span className="text-red-300 font-medium">
            Logout
          </span>

        </button>

      </div>
    </div>
  );
};

export default SideBar;