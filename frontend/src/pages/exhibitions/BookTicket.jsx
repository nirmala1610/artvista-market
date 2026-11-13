import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Minus, Plus, CreditCard, Loader2 } from "lucide-react";

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exhibition, setExhibition] = useState(null);
  const [quantity, setQuantity] = useState(0); // Default to 0 until date is picked
  const [visitDate, setVisitDate] = useState("");
  const [remainingTickets, setRemainingTickets] = useState(0);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Fetch exhibition details
  useEffect(() => {
    fetch(`http://localhost:8080/api/exhibitions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setExhibition(data))
      .catch(console.error);
  }, [id]);

  // Fetch ticket availability when date changes + Field Clearance
  useEffect(() => {
    if (!visitDate) {
      setRemainingTickets(0);
      setQuantity(0); // Cleanly clear quantity to 0 if date is empty
      return;
    }

    setIsLoadingAvailability(true);

    fetch(`http://localhost:8080/api/payments/availability/${id}/${visitDate}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const available = data.remaining; // maxVisitors - bookedTickets
        setRemainingTickets(available);

        if (available <= 0) {
          setQuantity(0); // Explicit Field Clearance: Sold Out means 0 tickets
        } else {
          // If a date changes, dynamically fallback to 1 or respect maximum boundaries
          setQuantity((prev) => (prev > available ? available : prev === 0 ? 1 : prev));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingAvailability(false));
  }, [visitDate, id]);

  // Handle date change input cleanly without race conditions
  const handleDateChange = (e) => {
    setVisitDate(e.target.value);
    // Let the availability useEffect handle updating the quantity safely!
  };

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
        <p className="text-gray-400 font-medium">Loading exhibition details...</p>
      </div>
    );
  }

  const total = exhibition.ticketPrice * quantity;

  const handlePayment = async () => {
    if (!visitDate) {
      alert("Please select a visit date");
      return;
    }

    if (remainingTickets <= 0) {
      alert("Sold out for this date!");
      return;
    }

    if (quantity <= 0) {
      alert("Please select at least 1 ticket.");
      return;
    }

    if (quantity > remainingTickets) {
      alert(`Not enough tickets available. Only ${remainingTickets} left.`);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/payments/create-order?amount=${total}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const order = await res.json();

      const options = {
        key: "rzp_test_T0KyDM7dT9uGZF",
        amount: order.amount,
        currency: "INR",
        name: "ArtVista",
        description: `${exhibition.title} Ticket Booking`,
        order_id: order.id,

        handler: async function (response) {
          await fetch("http://localhost:8080/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              ...response,
              exhibitionId: id,
              quantity,
              total,
              visitDate,
            }),
          });

          navigate("/buyer/ticket-success", {
            state: {
              exhibition,
              quantity,
              paymentId: response.razorpay_payment_id,
            },
          });
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white p-6 md:p-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-white/[0.03] backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl"
      >
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl group">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            src={exhibition.bannerUrl}
            className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            alt={exhibition.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent" />
        </div>

        {/* Header Details */}
        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {exhibition.title}
          </h1>
          <p className="text-cyan-400/80 font-medium mt-1 flex items-center gap-1.5 text-sm uppercase tracking-wider">
            <span>📍</span> {exhibition.city}
          </p>
        </div>

        <hr className="border-white/10 my-6" />

        {/* Date Selector Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold tracking-wide text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Select Visit Date
          </label>
          <input
            type="date"
            value={visitDate}
            min={exhibition.startDate}
            max={exhibition.endDate}
            onChange={handleDateChange}
            className="bg-white/[0.05] border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 px-4 py-3 rounded-xl w-full text-white outline-none transition-all duration-200"
          />
        </div>

        {/* Dynamic Ticket Selection Area */}
        <AnimatePresence mode="wait">
          {visitDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6 overflow-hidden"
            >
              {/* Availability Notice */}
              <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Price per ticket</p>
                  <p className="text-xl font-bold text-white">₹{exhibition.ticketPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Availability</p>
                  {isLoadingAvailability ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400 ml-auto mt-1" />
                  ) : (
                    <p className={`text-sm font-bold ${remainingTickets > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {remainingTickets > 0 ? `${remainingTickets} slots left` : "Sold Out"}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Counter - Only shows if remaining tickets exist */}
              {remainingTickets > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Select Tickets</span>
                  <div className="flex items-center gap-4 bg-white/[0.05] p-1.5 rounded-xl border border-white/10">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(quantity - 1)}
                      className="bg-white/5 hover:bg-white/10 disabled:opacity-30 p-2.5 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>

                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity >= remainingTickets}
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-white/5 hover:bg-white/10 disabled:opacity-30 p-2.5 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Details Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
            <h2 className="text-3xl font-black text-cyan-400">₹{total}</h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!visitDate || remainingTickets <= 0 || isLoadingAvailability || quantity === 0}
            onClick={handlePayment}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-cyan-500/10 transition-all duration-200"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Payment
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookTicket;