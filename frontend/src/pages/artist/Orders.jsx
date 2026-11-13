import React, { useState, useEffect } from "react";
import ArtistSidebar from "./ArtistSidebar";
import ArtistHeader from "./ArtistHeader";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("current");
  const token = localStorage.getItem("token");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/artists/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setDashboard(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const currentOrders = dashboard?.orders?.filter(
    (o) => o.status?.toLowerCase() !== "delivered"
  ) ?? [];

  const completedOrders = dashboard?.orders?.filter(
    (o) => o.status?.toLowerCase() === "delivered"
  ) ?? [];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "processing":
        return "bg-blue-500/20 text-blue-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 flex justify-between items-center hover:shadow-xl hover:scale-[1.02] transition">
      <div className="flex items-center gap-5">
        {order.artworkImage ? (
          <img
            src={order.artworkImage}
            className="w-20 h-20 rounded-xl object-cover"
            alt={order.artworkTitle}
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 text-xs text-center">
            No Image
          </div>
        )}
        <div>
          <p className="font-semibold text-lg">{order.artworkTitle ?? "—"}</p>
          <p className="text-sm text-gray-300">
            Buyer: {order.buyerName ?? "—"}
          </p>
          <p className="text-sm text-gray-300">
            Order ID: #{order.orderId ?? order.id ?? "—"}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg">
          ₹{order.price?.toLocaleString("en-IN") ?? "—"}
        </p>
        <span
          className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status ?? "Unknown"}
        </span>
      </div>
    </div>
  );

  const EmptyState = ({ label }) => (
    <div className="text-center py-16 text-gray-400">
      <p className="text-5xl mb-4">📦</p>
      <p className="text-lg">No {label} orders found.</p>
    </div>
  );

  return (
    <div>
      <ArtistHeader />
      <div className="flex">
        <ArtistSidebar />
        <div className="my-25 mx-15 w-full min-h-screen p-8 mr-10 my-20 bg-linear-to-br from-[#B5C4D2] via-[#4c5666] to-[#3d3f47] text-white rounded-3xl font-['Figtree']">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-medium font-['Jockey_One'] mb-8 tracking-wide">
              Orders & Sales
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { title: "Total Orders", value: dashboard?.totalOrders ?? 0 },
                {
                  title: "Total Sales",
                  value: dashboard?.totalSales
                    ? `₹${dashboard.totalSales.toLocaleString("en-IN")}`
                    : "₹0",
                },
                {
                  title: "Pending Deliveries",
                  value: dashboard?.pendingOrders ?? 0,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl text-center shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <p className="text-gray-300">{item.title}</p>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-white/20 mb-8">
              {["current", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-lg transition-all duration-300 ${
                    activeTab === tab
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "current" ? "Current Orders" : "Completed Orders"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "current" && (
              <div className="space-y-5">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, i) => (
                    <OrderCard key={order.orderId ?? order.id ?? i} order={order} />
                  ))
                ) : (
                  <EmptyState label="current" />
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className="space-y-5">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order, i) => (
                    <OrderCard key={order.orderId ?? order.id ?? i} order={order} />
                  ))
                ) : (
                  <EmptyState label="completed" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;