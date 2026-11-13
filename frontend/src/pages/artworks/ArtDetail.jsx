import React from "react";
import { Link,useLocation  } from "react-router-dom";
import { useEffect,useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const ArtDetail = () => {
  const [art, setArt] = useState(null);
  const { state } = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchArt = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/artworks/artDetail?artworkId=${encodeURIComponent(state.data)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch artwork");
        return;
      }

      const data = await res.json();
      setArt(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching artwork:", err);
    }
  };
  fetchArt();
}, [state]);

  const handleCart = async () => {
  try {

    const res = await fetch(
      `http://localhost:8080/api/cart/add?artworkId=${encodeURIComponent(art.id)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error("Failed to add to cart", {
        description: "Please try again later."
      });

      return;
    }

    console.log(data);

    toast.success("Added to Cart", {
      description: "The artwork has been added to your cart."
    });

  } catch (err) {
    console.error(err);
    toast.success("Already in Cart", {
        description: "This artwork is already in your cart."
      });
  }
};

  if (!art) {
    return <h1>Loading...</h1>;
  }

return (
  <div className="min-h-screen text-white overflow-hidden">


    {/* BACKGROUND GLOW */}
    <div className="fixed top-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[160px]" />
    <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-purple-500/10 blur-[160px]" />
        <div className="mx-10 mt-4">
          <BackButton/>
        </div>
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

      {/* HERO SECTION */}
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="grid lg:grid-cols-2 gap-14 items-center">
        <div >
                            {/* TITLE */}
          <h1
            className="
              text-5xl
              lg:text-6xl
              font-black
              leading-tight
            "
          >
            {art.title}
          </h1>

          {/* ARTIST */}
          {art.artistName && (
            <p className="text-xl text-cyan-400 mt-4">
              by {art.artistName}
            </p>
          )}

          {/* PRICE */}
          <div className="mt-8">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Price
            </p>

            <h2 className="text-5xl font-bold mt-2">
              ₹{art.price}
            </h2>
          </div>
        {/* IMAGE */}

<motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  whileHover={{
    y: -10,
    rotateX: 3,
    rotateY: -3,
  }}
  className="
  mt-10
    relative
    rounded-[32px]
    overflow-hidden
    border border-white/10
    bg-[#121217]
    shadow-[0_0_50px_rgba(0,0,0,0.45)]
    group
  "
>

  {/* Animated Glow */}
  <div
    className="
      absolute
      inset-0
      opacity-0
      group-hover:opacity-100
      transition-all
      duration-700
      bg-gradient-to-tr
      from-cyan-500/10
      via-transparent
      to-purple-500/10
      pointer-events-none
    "
  />

  <img
    src={art.imageUrl}
    alt={art.title}
    className="
      w-full
      h-[650px]
      object-contain
      bg-black
      transition-transform
      duration-700
      group-hover:scale-105
    "
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

</motion.div>

        </div>

        


        {/* DETAILS */}
        <div>
      <div className="mt-10">

        <h2 className="text-xl font-bold mb-5">
          Artwork Metadata
        </h2>

        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {art.orientation && (
            <div
              className="
                group
                p-4
                rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                hover:border-cyan-400/40
                transition-all duration-300
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                Orientation
              </p>

              <h3 className="text-lg font-semibold mt-2 capitalize">
                {art.orientation}
              </h3>
            </div>
          )}

          {art.style && (
            <div
              className="
                group
                p-4
                rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                hover:border-pink-400/40
                transition-all duration-300
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                Style
              </p>

              <h3 className="text-lg font-semibold mt-2 capitalize">
                {art.style}
              </h3>
            </div>
          )}

          {art.medium && (
            <div
              className="
                group
                p-4
                rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                hover:border-yellow-400/40
                transition-all duration-300
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-yellow-400">
                Medium
              </p>

              <h3 className="text-lg font-semibold mt-2 capitalize">
                {art.medium}
              </h3>
            </div>
          )}

          {art.material && (
            <div
              className="
                group
                p-4
                rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                hover:border-orange-400/40
                transition-all duration-300
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
                Material
              </p>

              <h3 className="text-lg font-semibold mt-2 capitalize">
                {art.material}
              </h3>
            </div>
          )}

          {art.subject && (
            <div
              className="
                group
                p-4
                rounded-2xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                hover:border-purple-400/40
                transition-all duration-300
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
                Subject
              </p>

              <h3 className="text-lg font-semibold mt-2 capitalize">
                {art.subject}
              </h3>
            </div>
          )}

        </motion.div>
      </div>

              <h2 className="text-xl font-bold mt-10">
                Description
              </h2>
          {art.description && (
            <p className="text-gray-300 leading-8 mt-8 text-lg">
              {art.description}
            </p>
          )}



          {/* DIMENSIONS */}
          {(art.width || art.height || art.depth) && (
            <div
              className="
                mt-10
                p-6
                rounded-3xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
              "
            >
              <h2 className="text-xl font-bold mb-4">
                Dimensions
              </h2>

              <div className="grid grid-cols-2 gap-4 text-gray-300">

                {art.width && (
                  <p>Width: {art.width} cm</p>
                )}

                {art.height && (
                  <p>Height: {art.height} cm</p>
                )}

                {art.depth && (
                  <p>Depth: {art.depth} cm</p>
                )}

              </div>
            </div>
          )}

          {/* EXTRA DETAILS */}
          <div
            className="
              mt-10
              grid
              grid-cols-2
              gap-5
            "
          >

            {art.year && (
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Year</p>
                <p className="text-xl font-bold mt-2">{art.year}</p>
              </div>
            )}

            {art.edition && (
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Edition</p>
                <p className="text-xl font-bold mt-2">
                  {art.edition} Prints
                </p>
              </div>
            )}

          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-5 mt-12">

            <Link
              to={`/buyer/checkout?artworkId=${art.id}&quantity=1`}
            >
              <button
                className="
                  px-10 py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  font-bold
                  text-lg
                  shadow-[0_10px_30px_rgba(6,182,212,0.3)]
                  hover:scale-105
                  transition-all duration-300
                "
              >
                Buy Now
              </button>
            </Link>

            <button
              onClick={handleCart}
              className="
                px-10 py-4
                rounded-2xl
                bg-white
                text-black
                font-bold
                text-lg
                hover:scale-105
                transition-all duration-300
              "
            >
              Add to Cart
            </button>

          </div>

        </div>
      </motion.div>
    </div>
  </div>
);

};

export default ArtDetail;