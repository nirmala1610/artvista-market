import React from "react";
import { Link } from "react-router-dom"; // Added since you use Link below
import OptimizedImage from "./OptimizedImage";
import { CurrentOrderSkeleton } from "./OrderSkeleton";
import { fadeUp, staggerContainer } from "../../../util/animations";
import { motion } from "framer-motion";
const AllOrders = ({ loading,allOrder }) => {
     if (loading) return <CurrentOrderSkeleton />;
  return (
   <div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
      <div className="bg-linear-to-br from-[#dce7f1] via-[#cad8e5] to-[#b5c4d2] rounded-[45px] shadow-2xl overflow-hidden">
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/20 border-b border-white/20 px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <h1 className="text-5xl font-black font-['Jockey_One'] text-[#002730] tracking-wide">
                Your Orders
              </h1>
              <p className="mt-2 text-lg text-[#28434a] font-['Figtree']">
                Every masterpiece you've collected 
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#002730] text-white px-6 py-4 rounded-3xl shadow-xl">
                <p className="text-sm uppercase tracking-widest text-white/70 font-semibold">
                  Total Orders
                </p>
                <h2 className="text-3xl font-black font-['Jockey_One']">
                  {allOrder.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {allOrder.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 px-6">
            <div className="text-[120px] animate-bounce">
              🖼️
            </div>
            <h2 className="text-4xl lg:text-5xl text-center font-black font-['Jockey_One'] text-[#002730] mt-4">
              No Orders Yet
            </h2>
            <p className="text-center text-gray-700 text-xl mt-5 max-w-2xl font-['Figtree']">
              Your gallery is waiting. Explore artworks and let your collection begin like an anime protagonist unlocking legendary loot ✨
            </p>
            <Link to="/buyer/browse">
              <button className="mt-10 px-10 py-5 bg-[#002730] hover:bg-[#013946] text-white rounded-full text-2xl font-['Poller_One'] shadow-2xl hover:scale-105 transition-all duration-300">
                Explore Art
              </button>
            </Link>
          </div>
        )}

        <motion.div variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="px-7 pb-7 space-y-6">
          {[...allOrder].reverse().map((order, index) => (
            <motion.div
              key={index}
                variants={fadeUp}
                whileInView={{ opacity: 1, y: 0 }}   // re-triggers on scroll into view
                initial={{ opacity: 0, y: 40 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative overflow-hidden rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 px-8 py-6 border-b border-black/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-[#002730] text-white px-5 py-2 rounded-2xl text-lg font-bold shadow-lg">
                      Item #{index + 1}
                    </div>

                    <div
                      className={`px-5 py-2 rounded-2xl text-lg font-bold shadow-md
                          ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "PAID"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-3 text-lg text-[#28434a] font-['Figtree']">
                    <p>
                      Tracking ID:
                      <span className="font-bold ml-2 text-[#002730]">
                        {order.trackingId}
                      </span>
                    </p>
                    <span className="hidden md:block">•</span>
                    <p>
                      🗓️ {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-[#002730] text-white rounded-3xl px-7 py-5 shadow-2xl min-w-55">
                  <p className="text-sm uppercase tracking-[3px] text-white/70">
                    Total Amount
                  </p>
                  <h2 className="text-4xl font-black mt-2 font-['Jockey_One']">
                    ₹{order.totalAmount}
                  </h2>
                </div>
              </div>

              <div className="p-6 lg:p-8 space-y-8">
                {order.artworks.map((artwork, artIndex) => (
                  <div
                    key={artIndex}
                    className="group bg-white/60 rounded-[35px] p-5 lg:p-6 flex flex-col xl:flex-row gap-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="xl:min-w-[280px] xl:max-w-[320px] overflow-hidden rounded-[30px] relative hover:scale-105 transition-all duration-500">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-80 object-cover rounded-[30px] group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl font-bold">
                        #{artIndex + 1}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col xl:items-start gap-8">
                      <div>
                        <h2 className="text-4xl font-black text-[#002730] font-['Jockey_One']">
                          {artwork.title}
                        </h2>
                        <p className="text-lg text-gray-600 mt-2 font-['Figtree']">
                          Premium collectible artwork
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                          <div className="bg-[#edf3f7] rounded-3xl p-5">
                            <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                              Category
                            </p>
                            <h3 className="text-2xl font-black text-[#002730] mt-2">
                              {artwork.category}
                            </h3>
                          </div>

                          <div className="bg-[#edf3f7] rounded-3xl p-5">
                            <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                              Orientation
                            </p>
                            <h3 className="text-2xl font-black text-[#002730] mt-2">
                              {artwork.orientation}
                            </h3>
                          </div>

                          <div className="bg-[#edf3f7] rounded-3xl p-5">
                            <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                              Edition
                            </p>
                            <h3 className="text-2xl font-black text-[#002730] mt-2">
                              {artwork.edition}
                            </h3>
                          </div>

                          <div className="bg-[#edf3f7] rounded-3xl p-5">
                            <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">
                              Year Created
                            </p>
                            <h3 className="text-2xl font-black text-[#002730] mt-2">
                              {artwork.year}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(AllOrders);