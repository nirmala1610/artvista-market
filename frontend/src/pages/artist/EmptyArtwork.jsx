import React from "react";

const EmptyArtwork = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">

      <div className="text-[100px]">
        🎭
      </div>

      <h2 className="text-4xl font-black text-[#002730] mt-5 font-['Jockey_One']">
        No Artworks Yet
      </h2>

      <p className="text-xl text-gray-700 mt-3">
        Upload your first masterpiece
      </p>

    </div>
  );
};

export default EmptyArtwork;