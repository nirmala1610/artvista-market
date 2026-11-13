import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ContactSupportModal = ({ isOpen, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message);
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg bg-[#161A20] rounded-3xl p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Contact Support</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-[#16889c]"
              >
                <X size={28} />
              </button>
            </div>

            {/* Message Box */}
            <label className="block mb-2 text-white font-semibold">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Describe your issue..."
              className="w-full p-4 rounded-xl bg-white/70 outline-none border border-gray-300 focus:border-[#16889c] resize-none"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#16889c] to-[#0f5c6d] text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              Submit Request
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactSupportModal;
