import React from "react";
import OptimizedImage from "./OptimizedImage";

const ArtworkCard = React.memo(({ artwork }) => {
  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg">
      <OptimizedImage
        src={artwork.imageUrl}
        alt={artwork.title}
        className="w-full h-80 object-cover rounded-3xl"
      />

      <div className="mt-5">
        <h2 className="text-3xl font-black text-[#002730]">
          {artwork.title}
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="bg-[#edf3f7] p-4 rounded-2xl">
            <p className="text-sm text-gray-500">Category</p>
            <h3 className="font-bold">{artwork.category}</h3>
          </div>

          <div className="bg-[#edf3f7] p-4 rounded-2xl">
            <p className="text-sm text-gray-500">Orientation</p>
            <h3 className="font-bold">{artwork.orientation}</h3>
          </div>

          <div className="bg-[#edf3f7] p-4 rounded-2xl">
            <p className="text-sm text-gray-500">Edition</p>
            <h3 className="font-bold">{artwork.edition}</h3>
          </div>

          <div className="bg-[#edf3f7] p-4 rounded-2xl">
            <p className="text-sm text-gray-500">Year</p>
            <h3 className="font-bold">{artwork.year}</h3>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ArtworkCard;