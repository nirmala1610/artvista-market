import React ,{useState} from "react";

import { FaEdit } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdImageSearch } from "react-icons/md";
import { motion } from "framer-motion";

const ArtworkCard = ({ artwork, total,index, optimizeImage , onEdit, onDelete }) => {

  return (
      <motion.div
        whileHover={{
          y: -5,
          scale: 1.01,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="
        bg-[#99b1b47c]
        rounded-[35px]
        p-6
        shadow-lg
        "
      >
      <div className="flex flex-col xl:flex-row gap-8">

        {/* IMAGE */}
        <div className="xl:w-140 overflow-hidden rounded-[30px]">
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            src={optimizeImage(artwork.imageUrl)}
            className="
            w-full
            h-80
            object-cover
            rounded-[30px]
            transition-transform
            duration-300
            hover:scale-[1.02]
            will-change-transform "
          />

        </div>

        {/* DETAILS */}
        <div className="flex-1 flex flex-col justify-between">

          <div>

            <div className="flex items-start justify-between flex-wrap gap-5">

              <div>

                <h2 className="text-4xl font-black text-[#002730] font-['Jockey_One']">
                  {artwork.title}
                </h2>

              </div>

              <div className="bg-[#002730] text-white px-5 py-3 rounded-2xl shadow-md">

                <p className="text-sm uppercase tracking-[3px] text-white/70">
                  Artwork
                </p>

                <h3 className="text-2xl font-black">
                  #{total-index}
                </h3>

              </div>

            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

              <div className="bg-[#dde1e4] rounded-3xl p-5">

                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                  Category
                </p>

                <h3 className="text-2xl font-black text-[#002730] mt-2">
                  {artwork.category}
                </h3>

              </div>

              <div className="bg-[#dde1e4] rounded-3xl p-5">

                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                  Price
                </p>

                <h3 className="text-2xl font-black text-[#002730] mt-2">
                  ₹{artwork.price}
                </h3>

              </div>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-5 mt-10">

            <button
              className="
              flex items-center gap-3
              px-8 py-4
              bg-[#002730]
              hover:bg-[#014050]
              text-white
              rounded-full
              text-xl
              font-bold
              shadow-md
              transition-all
              duration-300
              hover:scale-[1.03]
              "
              onClick={onEdit}
            >
              <FaEdit />
              Edit
            </button>

            <button
              className="
              flex items-center gap-3
              px-8 py-4
              bg-white
              hover:bg-red-800
              hover:text-white
              rounded-full
              text-xl
              font-bold
              shadow-md
              transition-all
              duration-300
              hover:scale-[1.03]
              "
              onClick={onDelete}
            >
              <IoIosRemoveCircle />
              Remove
            </button>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ArtworkCard);