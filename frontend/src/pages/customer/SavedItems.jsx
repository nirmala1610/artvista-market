import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import CustomerSidebar from "./CustomerSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// ─── Skeleton ────────────────────────────────────────────────────────────────
const SavedItemsSkeleton = () => (
  <div className="w-full mr-10 my-20">
    <div className="bg-[#B5C4D2] rounded-[40px] p-8 shadow-2xl">

      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-3">
          <div className="h-12 w-56 bg-white/40 rounded-2xl animate-pulse" />
          <div className="h-5 w-48 bg-white/30 rounded-xl animate-pulse" />
        </div>
        <div className="bg-[#002730]/40 w-32 h-24 rounded-3xl animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-[35px] overflow-hidden shadow-2xl animate-pulse"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="w-full h-130 bg-white/40 rounded-[35px]" />
          </div>
        ))}
      </div>

    </div>
  </div>
);

// ─── Variants ────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const wrapperVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Component ───────────────────────────────────────────────────────────────
const SavedIteams = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/artworks/mySaved", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSavedItems(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedItems();
  }, [token]);

  const handleRemove = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/artworks/delete-saved?artworkId=${selectedArtwork.artworkId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSavedItems((prev) =>
          prev.filter((art) => art.artworkId  !== selectedArtwork.artworkId)
        );
        setRemoveOpen(false);
        toast.success("Artwork removed successfully!");
      } else {
        toast.error("Failed to remove artwork.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove artwork.");
    }
  };


  return (
    <div>
      <CustomerHeader />
      <div className="flex">
        <CustomerSidebar />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SavedItemsSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              className="w-full mr-10 my-20"
            >
              <div className="bg-[#B5C4D2] rounded-[40px] p-8 shadow-2xl">

                {/* HEADER */}
                <motion.div
                  variants={headerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center justify-between mb-10"
                >
                  <div>
                    <h1 className="text-5xl font-black text-[#002730] font-['Jockey_One']">
                      Saved Items
                    </h1>
                    <p className="text-lg text-gray-700 mt-3 font-['Figtree']">
                      Your saved artwork collection
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                    className="bg-[#002730] text-white px-6 py-4 rounded-3xl shadow-xl"
                  >
                    <p className="text-sm uppercase tracking-[3px] text-white/70">
                      Total
                    </p>
                    <h2 className="text-4xl font-black font-['Jockey_One']">
                      {savedItems.length}
                    </h2>
                  </motion.div>
                </motion.div>

                {/* EMPTY STATE */}
                <AnimatePresence>
                  {savedItems.length === 0 && (
                    <motion.div
                      variants={emptyVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-24"
                    >
                      <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[100px]"
                      >
                        📭
                      </motion.div>

                      <h2 className="text-4xl font-black text-[#002730] mt-5 font-['Jockey_One']">
                        No Saved Items Yet
                      </h2>

                      <Link to="/buyer/browse">
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-10 px-10 py-5 bg-[#002730] hover:bg-[#014050] text-white rounded-full text-2xl font-['Poller_One'] shadow-2xl transition-colors duration-300"
                        >
                          Explore Art
                        </motion.button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* GRID */}
                {savedItems.length > 0 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                  >
                    <AnimatePresence>
                      {savedItems.map((item) => (
                        <motion.div
                          key={item.artworkId}
                          variants={cardVariants}
                          exit="exit"
                          layout
                          whileHover={{ y: -6, transition: { duration: 0.25 } }}
                          className="group relative overflow-hidden rounded-[35px] shadow-2xl cursor-pointer"
                        >
                          {/* IMAGE */}
                          <div className="overflow-hidden rounded-[35px]">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-130 object-cover group-hover:scale-110 transition-all duration-700"
                            />
                          </div>

                          {/* HOVER OVERLAY */}
                        {/* HOVER OVERLAY */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="
                            absolute inset-0
                            bg-black/25
                            flex items-end justify-center
                            pb-10
                          "
                        >
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="flex gap-4"
                          >

                            {/* VIEW DETAILS */}
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="
                                px-8 py-4
                                bg-white text-black
                                rounded-full
                                text-xl
                                font-['Poller_One']
                                shadow-2xl
                                hover:scale-105
                                transition-all duration-300
                              "
                              onClick={() =>
                                navigate("/buyer/artDetail", {
                                  state: { data: item.artworkId },
                                })
                              }
                            >
                              View Details
                            </motion.button>

                            {/* REMOVE BUTTON */}
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedArtwork(item);
                                setRemoveOpen(true);
                              }}
                              className="
                                px-8 py-4
                                bg-red-600 text-white
                                rounded-full
                                text-xl
                                font-['Poller_One']
                                shadow-2xl
                                hover:bg-red-700
                                hover:scale-105
                                transition-all duration-300
                              "
                            >
                              Remove
                            </motion.button>

                          </motion.div>
                        </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {removeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                🗑️
              </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-800">
              Remove Artwork?
            </h2>

            <p className="mt-3 text-center text-gray-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-xl bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200 transition"
                onClick={() => {setRemoveOpen(false)}}
              >
                Cancel
              </button>

              <button
                className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white hover:bg-red-600 transition"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default SavedIteams;