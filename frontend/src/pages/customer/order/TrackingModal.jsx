const TrackingModal = ({ selectedOrder, setSelectedOrder }) => {
  if (!selectedOrder) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-2xl font-bold text-[#002730]">
          Tracking Details
        </h2>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Tracking ID</p>
          <h3 className="text-lg font-semibold text-[#002730] break-all">
            {selectedOrder.trackingId}
          </h3>
        </div>

        <div className="relative ml-3 border-l-2 border-gray-300 space-y-8">
          <div className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500" />
            <h4 className="font-semibold text-[#002730]">Order Placed</h4>
            <p className="text-sm text-gray-500">
              Your order has been confirmed
            </p>
          </div>

          <div className="relative pl-6">
            <div
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${
                selectedOrder.status === "SHIPPED" || selectedOrder.status === "DELIVERED"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
            <h4 className="font-semibold text-[#002730]">Shipped</h4>
            <p className="text-sm text-gray-500">Artwork is on the way</p>
          </div>

          <div className="relative pl-6">
            <div
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${
                selectedOrder.status === "DELIVERED" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <h4 className="font-semibold text-[#002730]">Delivered</h4>
            <p className="text-sm text-gray-500">
              Expected: {selectedOrder.expectedDelivery}
            </p>
          </div>
        </div>
        
        <button
          // Update the close handler here too
          onClick={() => setSelectedOrder(null)}
          className="w-full mt-10 bg-[#002730] hover:bg-[#014050] text-white py-3 rounded-2xl font-semibold transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  );
};

export default TrackingModal;