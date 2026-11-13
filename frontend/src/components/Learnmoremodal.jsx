import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Users, Calendar, Clock, Star, Palette, Shield, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearnMoreModal = ({ isOpen, onClose, onApply }) => {

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const perks = [
    { icon: <Users size={20} />, title: "Manage 2K+ Artists", desc: "Oversee a thriving community of verified creators across all art styles." },
    { icon: <Calendar size={20} />, title: "120+ Monthly Exhibitions", desc: "Curate and launch premium showcases that reach thousands of art collectors." },
    { icon: <Clock size={20} />, title: "24H Response SLA", desc: "Fast-track review pipeline with dedicated support tools built for speed." },
    { icon: <Star size={20} />, title: "Featured Collections", desc: "Handpick artworks that define the visual identity of ArtVista each season." },
    { icon: <Palette size={20} />, title: "Creative Authority", desc: "Full autonomy over aesthetic direction, curation themes, and artist spotlights." },
    { icon: <Shield size={20} />, title: "Quality Standards", desc: "Maintain platform integrity by enforcing submission and showcase guidelines." },
  ];

  const requirements = [
    "3+ years in art curation, gallery management, or creative direction",
    "Strong visual aesthetic judgment and knowledge of contemporary art trends",
    "Experience collaborating with artists and creative professionals",
    "Ability to manage multiple exhibitions and deadlines simultaneously",
    "Excellent written communication for artist feedback and platform announcements",
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0, y: 40, scale: 0.96,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#0d1117] border border-white/10 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
              >
                <X size={18} />
              </motion.button>

              {/* Hero banner */}
              <div className="relative h-52 overflow-hidden rounded-t-[32px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#002730] via-[#014050] to-[#001820]" />
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(circle at 30% 50%, #22d3ee 0%, transparent 60%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)"
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-cyan-400 text-xs font-semibold uppercase tracking-[3px] font-['Figtree']">
                        Featured Staff Position
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-white font-['Jockey_One'] leading-tight">
                      Gallery Manager
                    </h2>
                    <p className="text-white/60 text-sm mt-1 font-['Figtree']">
                      Full-time · Remote · ArtVista Platform
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="p-8 space-y-10"
              >

                {/* About role */}
                <motion.div variants={fadeUp}>
                  <h3 className="text-xl font-black text-white font-['Jockey_One'] mb-3">
                    About The Role
                  </h3>
                  <p className="text-white/60 font-['Figtree'] text-base leading-relaxed">
                    As Gallery Manager at ArtVista, you'll be the creative backbone of our platform. You'll oversee featured artwork collections, approve premium showcases, collaborate with creators, and help maintain the artistic quality of our ecosystem — shaping what thousands of art lovers discover every day.
                  </p>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                  {[
                    { value: "2K+", label: "Artists Managed", color: "text-cyan-400" },
                    { value: "120+", label: "Monthly Exhibitions", color: "text-white" },
                    { value: "24H", label: "Review Response", color: "text-green-400" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:border-white/20 transition-colors duration-300"
                    >
                      <h4 className={`text-3xl font-black font-['Jockey_One'] ${stat.color}`}>
                        {stat.value}
                      </h4>
                      <p className="text-white/50 text-xs mt-1 font-['Figtree'] uppercase tracking-widest">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* Perks grid */}
                <motion.div variants={fadeUp}>
                  <h3 className="text-xl font-black text-white font-['Jockey_One'] mb-5">
                    What You'll Do
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {perks.map((perk, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 hover:bg-white/8 transition-all duration-300"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                          {perk.icon}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm font-['Figtree']">
                            {perk.title}
                          </p>
                          <p className="text-white/50 text-xs mt-0.5 font-['Figtree'] leading-relaxed">
                            {perk.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Requirements */}
                <motion.div variants={fadeUp}>
                  <h3 className="text-xl font-black text-white font-['Jockey_One'] mb-4">
                    Requirements
                  </h3>
                  <div className="space-y-3">
                    {requirements.map((req, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle size={17} className="text-cyan-400 mt-0.5 shrink-0" />
                        <p className="text-white/60 font-['Figtree'] text-sm leading-relaxed">
                          {req}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Process */}
                <motion.div variants={fadeUp}>
                  <h3 className="text-xl font-black text-white font-['Jockey_One'] mb-4">
                    Application Process
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {["Apply Online", "Portfolio Review", "Interview", "Onboarding"].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 justify-center">
                          <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-white/70 text-xs font-['Figtree'] whitespace-nowrap">
                            {step}
                          </span>
                        </div>
                        {i < 3 && <ArrowRight size={14} className="text-white/20 shrink-0 hidden sm:block" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
                <p className="text-center text-white/30 text-xs font-['Figtree']">
                  Applications are reviewed by the ArtVista administration team.
                </p>

              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LearnMoreModal;