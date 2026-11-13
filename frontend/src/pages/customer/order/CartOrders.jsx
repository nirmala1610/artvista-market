import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { CurrentOrderSkeleton } from "./OrderSkeleton";

const CartOrders = ({
  loading ,  
  cart,
  handleRemoveCartItem,
}) => {

     if (loading) return <CurrentOrderSkeleton />;
  return (
<div className="w-full max-w-8xl mx-auto px-4 lg:px-6 pt-4 pb-8 my-5">
           <div className="bg-linear-to-br from-[#d7e3ee] to-[#b8c8d8] rounded-[40px] shadow-2xl p-8 backdrop-blur-md">
             <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-5xl font-black font-['Jockey_One'] text-[#002730] tracking-wide">
                  Your Cart
                </h1>
              </div>
          <div className="bg-[#002730] text-white px-6 py-3 rounded-2xl shadow-lg">
            <p className="font-['Figtree'] text-lg">
              {cart.items.length} Items
            </p>
          </div>
        </div>

        {cart.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-8xl mb-6">🛒</div>

            <h2 className="text-4xl font-bold font-['Jockey_One'] text-[#002730]">
              Your cart feels lonely
            </h2>

            <p className="text-gray-700 mt-4 text-xl font-['Figtree']">
              Add some beautiful artworks and start your collection.
            </p>

            <Link to="/buyer/browse">
              <button className="mt-8 px-8 py-4 bg-[#002730] hover:scale-105 transition-all duration-300 text-white rounded-full text-2xl font-['Poller_One'] shadow-xl">
                Explore Art
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="group bg-black/10 backdrop-blur-lg rounded-[35px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-85 overflow-hidden rounded-[30px]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-87.5 object-cover rounded-[30px] group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="text-4xl font-black font-['Jockey_One'] text-[#002730]">
                          {item.title}
                        </h2>

                        <p className="text-lg text-gray-600 mt-2 font-['Figtree']">
                          Premium collectible artwork
                        </p>
                      </div>

                      <div className="bg-[#002730] text-white px-5 py-2 rounded-2xl font-bold text-lg shadow-md">
                        Order ID: #{index + 1}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                      <div className="bg-[#edf3f7] rounded-2xl p-4">
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                          Category
                        </p>
                        <h3 className="text-2xl font-bold text-[#002730] mt-1">
                          {item.category}
                        </h3>
                      </div>

                      <div className="bg-[#edf3f7] rounded-2xl p-4">
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                          Orientation
                        </p>
                        <h3 className="text-2xl font-bold text-[#002730] mt-1">
                          {item.orientation}
                        </h3>
                      </div>

                      <div className="bg-[#edf3f7] rounded-2xl p-4">
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                          Edition
                        </p>
                        <h3 className="text-2xl font-bold text-[#002730] mt-1">
                          {item.edition}
                        </h3>
                      </div>

                      <div className="bg-[#edf3f7] rounded-2xl p-4">
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                          Year Created
                        </p>
                        <h3 className="text-2xl font-bold text-[#002730] mt-1">
                          {item.year}
                        </h3>
                      </div>

                    </div>
                  </div>
                  <div className="flex flex-wrap gap-5 mt-10">
                   <Link to={`/buyer/checkout?artworkId=${item.artworkId}&quantity=${1}`} >
                      <button className="px-10 py-4 bg-[#002730] hover:bg-[#014050] text-white text-2xl font-['Poller_One'] rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                        Checkout
                      </button>
                    </Link>

                    <button className="px-8 py-4 border-2 border-[#002730] text-[#002730] hover:bg-[#002730] hover:text-white rounded-full text-xl font-bold transition-all duration-300"
                            onClick={() => handleRemoveCartItem(item.artworkId)}>
                          Remove
                        </button>

                      </div>

                    </div>
                  </div>
                </div>
                    ))}
              </div>
            </div>
          </div>
  );
};

export default React.memo(CartOrders);