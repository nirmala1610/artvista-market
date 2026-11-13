import React, { useEffect, useState } from "react";

const ArtistStep = ({ formData, setFormData }) => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/api/artists/artist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchData();
  }, []);

  const toggleArtist = (artistId) => {
    // FIX: Using defensive checks to handle potential undefined fields safely
    if (!artistId) return;

    const selected = formData.selectedArtists.includes(artistId)
      ? formData.selectedArtists.filter((id) => id !== artistId)
      : [...formData.selectedArtists, artistId];

    setFormData({
      ...formData,
      selectedArtists: selected,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {artists.map((artist) => {
        // FIX: Extract the correct MongoDB identifier fallback dynamically
        const artistIdentifier = artist._id || artist.id;

        return (
          <div
            key={artistIdentifier}
            onClick={() => toggleArtist(artistIdentifier)}
            className={`p-4 rounded-2xl cursor-pointer border transition ${
              formData.selectedArtists.includes(artistIdentifier)
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            {artist.artistName}
          </div>
        );
      })}
    </div>
  );
};

export default ArtistStep;