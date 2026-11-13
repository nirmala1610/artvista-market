import React, { useEffect, useState } from "react";

import ArtistHeader from "./artist/ArtistHeader";
import ArtistSidebar from "./artist/ArtistSidebar";

import ArtworkCard from "./artist/ArtworkCard";
import ArtworkSkeleton from "./artist/ArtworkSkeleton";
import EmptyArtwork from "./artist/EmptyArtwork";
import { motion,AnimatePresence  } from "framer-motion";
import EditArtworkModal from "./artist/EditArtworkModal";
import { toast } from "sonner";
import BackButton from "../components/BackButton";
const ArtistDashboard = () => {
  const token = localStorage.getItem("token");

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const reversedArtworks = [...artworks].reverse();

  const optimizeImage = (url) => {
    if (!url) return "";

    return url.replace(
      "/upload/",
      "/upload/w_700,q_auto,f_auto/"
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:8080/api/artists/my-artworks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setArtworks(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);



  const handleRemove = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/artworks/delete-artwork/${selectedArtwork.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setArtworks((prev) =>
          prev.filter((art) => art.id !== selectedArtwork.id)
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

  const handleEditSave = async (updatedData) => {

    try {

      const res = await fetch(
        `http://localhost:8080/api/artworks/edit-artwork/${selectedArtwork.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update artwork");
        return;
      }

      const updatedArtwork = await res.json();

      // update artwork instantly in UI
      setArtworks((prev) =>
        prev.map((art) =>
          art.id === updatedArtwork.id
            ? updatedArtwork
            : art
        )
      );

      toast.success("Artwork updated successfully!");

      setEditOpen(false);
      setSelectedArtwork(null);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };


  const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.85,
      filter: "blur(6px)",
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div>
      <ArtistHeader />

      <div className="flex">

        <ArtistSidebar />

        <div className="w-full mr-10 my-25 mx-15">

          <div className="bg-[#B5C4D2] rounded-[40px] p-8 shadow-lg min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">

              <div>

                <h1 className="text-5xl font-black text-[#002730] font-['Jockey_One']">
                  Your Artworks
                </h1>

                <p className="text-lg text-gray-700 mt-3">
                  Manage your creative universe 
                </p>

              </div>

              <div className="bg-[#002730] text-white px-6 py-4 rounded-3xl shadow-md">

                <p className="text-sm uppercase tracking-[3px] text-white/70">
                  Total
                </p>

                <h2 className="text-4xl font-black">
                  {artworks.length}
                </h2>

              </div>

            </div>

            {loading ? (
              <ArtworkSkeleton />
            ) : artworks.length === 0 ? (
              <EmptyArtwork />
            ) : (
              <motion.div
                layout
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-10"
              >
                <AnimatePresence mode="popLayout">
                  {reversedArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                    >
                      <ArtworkCard
                        artwork={artwork}
                        total={artworks.length}
                        index={index}
                        optimizeImage={optimizeImage}
                        onEdit={() => {
                          setSelectedArtwork(artwork);
                          setEditOpen(true);
                        }}
                        onDelete={() => {
                          setSelectedArtwork(artwork);
                          setRemoveOpen(true);
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            
          {editOpen && (
            <EditArtworkModal
              isOpen={editOpen}
              artwork={selectedArtwork}
              optimizeImage={optimizeImage}
              onSave={handleEditSave}
              onClose={() => {
                setSelectedArtwork(null);
                setEditOpen(false);
              }}
            />
          )}

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

      </div>

    </div>
  );
};

export default ArtistDashboard;