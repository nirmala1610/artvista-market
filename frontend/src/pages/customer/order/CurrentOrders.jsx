import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { CurrentOrderSkeleton } from "./OrderSkeleton";
import { motion } from "framer-motion";
import { fadeUp,staggerContainer, scaleIn} from "../../../util/animations";

const CurrentOrders = ({
  loading, 
  currentOrders,
  setSelectedOrder,
  setSupportOpen,
}) => {
 
     if (loading) return <CurrentOrderSkeleton />;

  return (
    <div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
      {/* MAIN SINGLE BACKGROUND */}
      <div className="bg-linear-to-br from-[#dce7f1] via-[#cad8e5] to-[#b5c4d2] rounded-[45px] shadow-2xl overflow-hidden">
        {/* Page Header */}
        <motion.div variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="sticky top-0 z-10 bg-[#002730] px-8 py-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white font-['Jockey_One'] tracking-wide">
                Current Orders
              </h1>
              <p className="text-white/70 text-lg mt-3 font-['Figtree']">
                Your artworks are travelling through the galaxy, here’s their current status 
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl px-7 py-5">
              <p className="uppercase tracking-[4px] text-sm text-white/60">
                Active Orders
              </p>
              <h2 className="text-5xl font-black text-white font-['Jockey_One'] mt-2">
                {currentOrders.length}
              </h2>
            </div>
          </div>
        </motion.div>

        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 px-8">
            <div className="text-[120px]">
              🚛
            </div>
            <h1 className="text-5xl font-black text-[#002730] mt-5 text-center font-['Jockey_One']">
              No Active Orders
            </h1>
            <p className="text-xl text-gray-700 mt-4 text-center max-w-2xl font-['Figtree']">
              Your delivery lane is currently silent like a midnight Tokyo street 🌌
            </p>
            <Link to="/buyer/browse">
              <button className="mt-10 px-10 py-5 bg-[#002730] hover:bg-[#014050] text-white rounded-full text-2xl font-['Poller_One'] shadow-2xl hover:scale-105 transition-all duration-300">
                Explore Art
              </button>
            </Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="p-6 lg:p-8 space-y-10">
            {currentOrders.map((order, orderIndex) => (
              <div
                key={orderIndex}
                className="bg-white/30 backdrop-blur-lg rounded-[40px] border border-white/20 overflow-hidden shadow-xl"
              >
                <div className="px-7 py-6 border-b border-black/10">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-4xl font-black text-[#002730] font-['Jockey_One']">
                          Order #{orderIndex + 1}
                        </h1>

                        <div
                          className={`px-5 py-2 rounded-2xl text-lg font-bold
                            ${
                              order.status === "SHIPPED"
                                ? "bg-yellow-300 text-black"
                                : order.status === "PAID"
                                ? "bg-blue-400 text-white"
                                : "bg-green-400 text-black"
                            }`}
                        >
                          {/* Note: Missing content inside this div in the original snippet */}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-3 mt-5 text-lg text-[#28434a] font-['Figtree']">
                        <p>
                          {order.artworks.length} Products
                        </p>
                        <span className="hidden md:block">•</span>
                        <p>
                          🗓️ {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#002730] text-white rounded-3xl px-7 py-5 shadow-xl">
                      <p className="uppercase tracking-[4px] text-sm text-white/70">
                        Total
                      </p>
                      <h2 className="text-5xl font-black font-['Jockey_One'] mt-2">
                        ₹{order.totalAmount}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-7">
                  <div className="bg-[#edf3f7] rounded-[30px] p-6">
                    <p className="uppercase tracking-[3px] text-sm text-gray-500 font-semibold">
                      Delivery Status
                    </p>
                    <h2 className="text-3xl font-black text-[#002730] mt-3">
                      {order.status.replaceAll("_", " ")}
                    </h2>
                  </div>

                  <div className="bg-[#edf3f7] rounded-[30px] p-6">
                    <p className="uppercase tracking-[3px] text-sm text-gray-500 font-semibold">
                      Expected Delivery
                    </p>
                    <h2 className="text-3xl font-black text-[#002730] mt-3">
                      {new Date(
                        new Date(order.createdAt).setDate(
                          new Date(order.createdAt).getDate() + 2
                        )
                      ).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                  </div>

                  <div className="bg-[#edf3f7] rounded-[30px] p-6">
                    <p className="uppercase tracking-[3px] text-sm text-gray-500 font-semibold">
                      Tracking ID
                    </p>
                    <h2 className="text-2xl font-black text-[#002730] mt-3 break-all">
                      {order.trackingId}
                    </h2>
                  </div>
                </div>

                {/* ARTWORKS */}
                <motion.div variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="px-7 pb-7 space-y-6">
                  {order.artworks.map((artwork, artIndex) => (
                    <div
                      key={artIndex}
                      className="bg-white/50 rounded-[35px] p-5 flex flex-col xl:flex-row gap-7 shadow-lg"
                    >
                      <div className="xl:w-75 rounded-[30px] overflow-hidden">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-99 rounded-3xl object-cover hover:scale-105 transition-all duration-500"
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-4xl font-black text-[#002730] font-['Jockey_One']">
                            {artwork.title}
                          </h2>
                          <p className="text-lg text-gray-600 mt-3 font-['Figtree']">
                            Premium collectible artwork
                          </p>

                          {/* GRID */}
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

                        {/* BUTTONS */}
                        <div className="flex flex-wrap gap-5 mt-10">
                          <button
                            className="px-9 py-4 bg-[#002730] hover:bg-[#014050] text-white rounded-full text-2xl font-['Poller_One'] shadow-xl hover:scale-105 transition-all duration-300"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Track Order
                          </button>

                          <button
                            className="px-8 py-4 border-2 border-[#002730] text-[#002730] hover:bg-[#002730] hover:text-white rounded-full text-xl font-bold transition-all duration-300"
                            onClick={() => setSupportOpen(true)}
                          >
                            Contact Support
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CurrentOrders);