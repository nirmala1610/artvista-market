import React, { useState, useEffect } from "react";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../../components/BackButton";
import { uploadToCloudinary } from "../../util/cloudinaryUpload";

const CustomerHeader = () => {
  const countries = countryList().getData();
  const [profileData, setProfileData] = useState(null);
  const token = localStorage.getItem("token");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleSave = async () => {
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      toast.error("Invalid phone number", {
        description: "Phone number must be 10 digits",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, country }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData(data);
        setPhone(data.phone || "");
        setCountry(data.country || "");
        toast.success("Updated successfully!", {
          description: "Your profile has been updated.",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
          "http://localhost:8080/api/auth/profilePic-update?image=" +
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
  
        profileData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
  
        toast.success("Profile uploaded");
      } catch (err) {
        console.log(err);
        toast.error("Profile upload failed");
      }
    };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -6 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full overflow-hidden"
    >
      <div className="mx-10 mt-8">
        <BackButton/>
      </div>
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-teal-400/8 rounded-full blur-[80px]" />
      </div>

      {/* Section label */}
      <motion.div variants={itemVariants} className="px-10 pt-10 mb-2">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-semibold uppercase tracking-[4px] font-['Figtree']">
            Your Profile
          </span>
        </div>
      </motion.div>

      {/* Main card */}
      <motion.div
        variants={itemVariants}
        className="mx-6 lg:mx-10 mt-4 mb-8 bg-white/[0.04] border border-white/10 rounded-[40px] backdrop-blur-sm overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row gap-8 p-8 lg:p-10">

          {/* LEFT — Avatar */}
          <motion.div
            variants={imageVariants}
            className="flex flex-col items-center lg:items-start gap-4 shrink-0"
          >
            <div className="relative">
              {/* Spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1.5 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 60%, #22d3ee 100%)",
                  borderRadius: "9999px",
                }}
              />
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
                src={profileData?.image || "/default-profile.png"}
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
            </div>

            {/* Name under avatar on mobile */}
            <AnimatePresence>
              {profileData?.name && (
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:hidden text-3xl font-black text-white font-['Jockey_One'] text-center"
                >
                  {profileData.name}
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            variants={containerVariants}
            className="flex-1 flex flex-col justify-between gap-6"
          >
            {/* Name (desktop) */}
            <AnimatePresence>
              {profileData?.name && (
                <motion.div variants={itemVariants}>
                  <h1 className="hidden lg:block text-5xl font-black text-white font-['Jockey_One'] tracking-wide leading-tight">
                    {profileData?.name}
                  </h1>
                  <div className="hidden lg:block mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Email — always read-only */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 group hover:border-cyan-400/30 transition-colors duration-300"
              >
                <p className="text-xs uppercase tracking-[3px] text-gray-500 font-semibold font-['Figtree'] mb-1">
                  Email
                </p>
                <p className="text-white font-['Figtree'] text-base truncate">
                  {profileData?.email || "—"}
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 hover:border-cyan-400/30 transition-colors duration-300"
              >
                <p className="text-xs uppercase tracking-[3px] text-gray-500 font-semibold font-['Figtree'] mb-1">
                  Phone No
                </p>
                {!profileData?.phone ? (
                  <input
                    type="text"
                    value={phone}
                    placeholder="Enter 10-digit number"
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent text-white font-['Figtree'] text-base outline-none placeholder:text-gray-600 border-b border-white/20 focus:border-cyan-400 transition-colors duration-200 pb-1"
                  />
                ) : (
                  <p className="text-white font-['Figtree'] text-base">
                    {profileData?.phone}
                  </p>
                )}
              </motion.div>

              {/* Country */}
              <motion.div
                variants={itemVariants}
                className="bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 hover:border-cyan-400/30 transition-colors duration-300 md:col-span-2"
              >
                <p className="text-xs uppercase tracking-[3px] text-gray-500 font-semibold font-['Figtree'] mb-1">
                  Country
                </p>
                {!profileData?.country ? (
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-transparent text-white font-['Figtree'] text-base outline-none border-b border-white/20 focus:border-cyan-400 transition-colors duration-200 pb-1 cursor-pointer"
                  >
                    <option value="" className="bg-[#0d1b22]">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.value} value={c.label} className="bg-[#0d1b22]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white font-['Figtree'] text-base">
                    {profileData?.country}
                  </p>
                )}
              </motion.div>
            </motion.div>

            {/* Save / Update button */}
            <motion.div variants={itemVariants} className="flex">
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                disabled={saving}
                className="relative overflow-hidden group px-8 py-3 rounded-2xl font-['Jockey_One'] text-lg tracking-wide text-white shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #002730 0%, #014050 100%)",
                  border: "1px solid rgba(34,211,238,0.2)",
                }}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <span className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      />
                      Saving…
                    </>
                  ) : profileData?.phone || profileData?.country ? (
                    "Update Profile"
                  ) : (
                    "Save Profile"
                  )}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="h-[2px] bg-gradient-to-r from-cyan-400/60 via-teal-400/40 to-transparent"
        />
      </motion.div>
    </motion.div>
  );
};

export default CustomerHeader;
