import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
const ArtistHeader = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

     const fetchDashboard = async () => {

      try {

       const response = await fetch(
        "http://localhost:8080/api/artists/dashboard",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`
          }
        }
      );
        const data = await response.json();

        setDashboard(data);
        console.log(data);

      } catch (error) {

        console.log(error);

      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const handleProfileImage = async (e) => {
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

      const res = await fetch(
        "http://localhost:8080/api/artists/profilePic-update?image=" +
          encodeURIComponent(imageUrl),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        return toast.error("Failed to update profile image");
      }

      dashboard((prev) => ({
        ...prev,
        profilePicture: imageUrl,
      }));

      toast.success("Profile uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Profile upload failed");
    }
  };

  return (
    <div className="w-full min-h-[500px] relative overflow-hidden rounded-b-[40px]">
      {/* Background Banner */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-[#0e1117]
          via-[#111827]
          to-[#0a0d12]
          mx-10 my-10
          rounded-4xl
        "
      />

      {/* Glow Effects */}
      <div className="absolute top-[-120px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[250px] h-[250px] bg-blue-600/20 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 px-16 py-14">

        {/* Heading */}
        <h1
          className="
            text-white
            text-5xl
            font-['Lilita_One']
            tracking-wide
            mb-12
          "
        >
          ARTIST DASHBOARD
        </h1>

        <div className="flex flex-col lg:flex-row gap-14 items-center">

          {/* LEFT PROFILE */}
          <div className="relative group">

            <div
              className="
                w-72 h-72
                rounded-full
                p-[5px]
                shadow-[0_0_40px_rgba(34,211,238,0.25)]
              "
            >
              <img
                className="
                  w-full h-full
                  rounded-full
                  object-cover
                  border-[6px]
                  border-[#10141b]
                "
                src={dashboard?.profilePicture || "/default-profile.png"}
                alt="profile"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              id="profileUpload"
              className="hidden"
              onChange={handleProfileImage}
            />

            {/* Hover Upload */}
            <div
              className="
                absolute inset-0
                rounded-full
                bg-black/70
                opacity-0
                group-hover:opacity-100
                transition-all duration-500
                flex items-center justify-center
                backdrop-blur-md
              "
            >
              <button
                onClick={() =>
                  document.getElementById("profileUpload").click()
                }
                className="
                  px-6 py-3
                  rounded-full
                  bg-white
                  text-black
                  font-bold
                  hover:scale-105
                  transition-all
                "
              >
                Change Profile
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 text-white">

            {/* Artist Name */}
            <h1 className="text-5xl font-['Lilita_One'] mb-3">
              {dashboard?.artistName || "Eren Yeager"}
            </h1>

            {/* Tagline */}
            <p className="text-gray-400 text-lg max-w-2xl leading-8">
              {dashboard?.catogory}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-cyan-400">{dashboard?.totalArtworks}</h2>
                <p className="text-gray-400 mt-1">Artworks</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-green-400">
                  ₹{dashboard?.totalSales}
                </h2>
                <p className="text-gray-400 mt-1">Total Sales</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-yellow-400">
                  {dashboard?.totalOrders}
                </h2>
                <p className="text-gray-400 mt-1">Orders</p>
              </div>

              {/* <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h2 className="text-3xl font-bold text-pink-400">
                  1.2K
                </h2>
                <p className="text-gray-400 mt-1">Views</p>
              </div> */}
            </div>

            {/* Buttons */}
            <div className="flex gap-5 mt-10 flex-wrap">

              <button
                onClick={() =>
                  navigate('/artist-profile')
                }
                className="
                  px-8 py-3
                  rounded-full
                  bg-gradient-to-r
                  from-[#16889c]
                  to-[#0f5c6d]
                  text-white
                  font-bold
                  shadow-lg
                  hover:scale-105
                  transition-all duration-300
                "
              >
                View Profile
              </button>

              <button
                className="
                  px-8 py-3
                  rounded-full
                  border border-white/20
                  bg-white/5
                  backdrop-blur-md
                  hover:bg-white/10
                  transition-all duration-300
                "
              >
                Edit Portfolio
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
