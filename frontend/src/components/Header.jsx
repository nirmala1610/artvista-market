import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { MdCollections } from "react-icons/md";
import LoginButton from "./LoginButton";

const Header = () => {
  const [profileData, setProfileData] = useState(null);
  const [results, setResults] = useState([]);
  const [keyword,setKeyword] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  const navigate = useNavigate();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setProfileData(null);
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (token) {
    fetchProfile();
  }

  if (!keyword?.trim()) {
    setResults([]);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/artworks/search?keyword=${encodeURIComponent(keyword)}`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [token, navigate, keyword]);


  return (
    <header className="w-full h-24 flex items-center justify-between px-10 bg-[#100D0D] mt-10 rounded-[37px] shadow-lg">
      <div className="flex flex-col items-center gap-3">
        <Link to="/">
        <img src="/ArtVista.png" alt="logo" className="w-16 h-16 rounded-full" />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-between bg-[#7EC9E0] rounded-full px-6 py-3 w-75 hover:shadow-lg transition-all duration-300"
             onClick={() => setSearchOpen(true)}>
          <p>Search for artworks</p>
          <FiSearch className="text-black text-lg cursor-pointer" />
        </div>

        <div className="flex items-center justify-center rounded-full">
          {profileData && (role === "ROLE_CUSTOMER" || role ==="CUSTOMER" ) && (
            <Link to="/buyer/dashboard">
              <img
                src={profileData.image}
                alt="profile"
                className="w-15 h-15 rounded-full object-cover border-4 border-[#133a46]"
              />
            </Link>
          )}

          {profileData && (role === "ROLE_ARTIST" || role ==="ARTIST" ) && (
            <Link to="/artist/dashboard">
              <img
                src={profileData.image}
                alt="profile"
                className="w-15 h-15 rounded-full object-cover border-4 border-[#133a46]"
              />
            </Link>
          )}

          {profileData && (role === "ROLE_ADMIN" || role === "ADMIN") && (
            <Link to="/admin/dashboard">
              <img src={profileData.image} alt="profile" className="w-15 h-15 rounded-full object-cover border-4 border-[#133a46]" />
            </Link>
          )}

          {profileData && (role === "ROLE_CURATOR" || role === "CURATOR") && (
            <Link to="/curator/dashboard">
              <img src={profileData.image} alt="profile" className="w-15 h-15 rounded-full object-cover border-4 border-[#133a46]"/>
            </Link>
          )}

          {!profileData && (
            <LoginButton onClick={() => navigate("/login")} />
          )}

        </div>

        {(role === "ROLE_CUSTOMER" || role === "CUSTOMER") && (
          <Link to="/buyer/cart">
            <FiShoppingCart className="text-white text-2xl cursor-pointer" />
          </Link>
        )}
        
      </div>

{searchOpen && (

  <div
   onClick={() => setSearchOpen(false)}
    className="fixed inset-0 z-50 flex items-start justify-center pt-32"
    style={{
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(12px)",
    }}
  >

    <div
      className="w-[700px] rounded-3xl overflow-hidden"
      style={{
        background: "rgba(15,15,18,0.92)",
        border: "1px solid rgba(157,220,255,0.12)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
      }}
    >

      {/* SEARCH INPUT */}

      <div className="flex items-center px-6 py-5 border-b border-[#1e2530]"
      onClick={(e) => e.stopPropagation()}>

        <FiSearch className="text-[#9ddcff] text-xl mr-4" />

        <input
          autoFocus
          spellCheck={false}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search artworks, artists..."
          className="w-full bg-transparent outline-none text-white text-lg"
        />

        <button
          onClick={() => {
            setSearchOpen(false);
            setKeyword("");
            setResults([]);
          }}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

      </div>

      {/* RESULTS */}

      <div className="max-h-[500px] overflow-y-auto">

        {results.map((art) => (

          <div
            key={art.id}
            onClick={() => {
              setSearchOpen(false);

              navigate("/buyer/artDetail", {
                state: { data: art.id }
              });
            }}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#161b22] transition-all"
          >

            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-16 h-16 rounded-xl object-cover"
            />

            <div>

              <h3 className="text-white font-semibold">
                {art.title}
              </h3>

              <p className="text-sm text-gray-400">
                {art.artist}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>

)}
    </header>
  );
};

export default Header;
