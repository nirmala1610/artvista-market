import React from "react";

const ArtworkSkeleton = () => {
  return (
    <div className="space-y-8">

      {[1, 2, 3].map((item) => (

        <div
          key={item}
          className="animate-pulse bg-[#ffffffaa] rounded-[35px] p-6"
        >

          <div className="flex gap-8">

            <div className="w-[320px] h-[320px] bg-gray-300 rounded-3xl" />

            <div className="flex-1 space-y-5">

              <div className="h-10 bg-gray-300 rounded w-1/2" />

              <div className="h-6 bg-gray-300 rounded w-full" />

              <div className="h-6 bg-gray-300 rounded w-3/4" />

              <div className="grid grid-cols-2 gap-5 mt-8">

                <div className="h-28 bg-gray-300 rounded-3xl" />

                <div className="h-28 bg-gray-300 rounded-3xl" />

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
};

export default ArtworkSkeleton;