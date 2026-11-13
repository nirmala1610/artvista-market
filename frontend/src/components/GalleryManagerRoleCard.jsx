import React, { useState } from "react";
import {
  Palette,
  ShieldCheck,
  ArrowRight,
  BadgeCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import LearnMoreModal from "./Learnmoremodal";
import { useNavigate } from "react-router-dom";

const GalleryManagerRoleCard = () => {
  
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="w-full py-15 font-['Jost'] overflow-hidden relative">

      {/* Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full h-auto bg-cyan-500/10 blur-[180px] rounded-full"></div>

      <div className="w-full mx-auto px-6 relative z-10">

        {/* Main Card */}
        <div className="rounded-[40px] border border-white/10 bg-black overflow-hidden grid grid-cols-1 xl:grid-cols-2 mx-10">

          {/* LEFT IMAGE SECTION */}
          <div className="relative p-8">

            <div className="relative h-full rounded-[35px] overflow-hidden group">

              <img
                src="/Exhibition.jpg"
                alt="Gallery Manager"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              {/* Badge */}
              <div className="absolute top-8 left-8 px-5 py-3 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center gap-3">

                <BadgeCheck size={18} className="text-cyan-300" />

                <span className="text-white text-sm font-semibold">
                  Staff Leadership Role
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-10 left-10 right-10">

                <p className="text-cyan-300 tracking-[4px] uppercase text-sm mb-4">
                  Featured Staff Position
                </p>

                <h2 className="text-5xl font-black text-white leading-tight">

                  Become The
                  <br />

                  Gallery Manager
                </h2>

                <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-lg">
                  Lead premium collections, organize exhibitions,
                  and shape the visual identity of ArtVista’s
                  creative universe.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center p-10 xl:p-16 text-white">

            {/* Top Label */}
            <div className="inline-flex w-fit items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">

              <Sparkles className="text-cyan-300" size={18} />

              <span className="text-sm text-gray-300">
                Premium Staff Opportunity
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl xl:text-6xl font-black leading-tight font-['Poller_One']">

              Curate The
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {" "}Creative Future
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed mt-8 max-w-2xl">

              As a Gallery Manager, you will oversee featured artwork
              collections, approve premium showcases, collaborate with
              creators, and help maintain the artistic quality of the
              ArtVista ecosystem.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-10">

              <div>
                <h2 className="text-5xl font-black text-cyan-300">
                  2K+
                </h2>

                <p className="text-gray-400 mt-2">
                  Artists Managed
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-black text-white">
                  120+
                </h2>

                <p className="text-gray-400 mt-2">
                  Monthly Exhibitions
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-black text-green-400">
                  24H
                </h2>

                <p className="text-gray-400 mt-2">
                  Review Response Time
                </p>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="mt-12">

              <h3 className="text-2xl font-bold mb-6">
                Responsibilities
              </h3>

              <div className="space-y-5">

                <div className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-cyan-300 mt-1"
                    size={20}
                  />

                  <p className="text-gray-300 leading-relaxed">
                    Curate and feature high-quality artwork collections.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-cyan-300 mt-1"
                    size={20}
                  />

                  <p className="text-gray-300 leading-relaxed">
                    Review premium artist submissions and exhibitions.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-cyan-300 mt-1"
                    size={20}
                  />

                  <p className="text-gray-300 leading-relaxed">
                    Maintain artistic quality standards across the platform.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-cyan-300 mt-1"
                    size={20}
                  />

                  <p className="text-gray-300 leading-relaxed">
                    Collaborate with moderators and event curators.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-5 mt-14">

              <button className="group px-8 py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg hover:scale-105 transition duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(59,130,246,0.25)]"
              onClick={()=>navigate("/curator-application")}
              >

                <Palette size={22} />

                Apply As Gallery Manager

                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button className="px-8 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-white font-semibold text-lg"
               onClick={() => setModalOpen(true)}>

                Learn More
              </button>
            </div>

            {/* Bottom Note */}
            <p className="text-gray-500 text-sm mt-6">
              Applications are reviewed by the ArtVista administration team.
            </p>
          </div>
        </div>
      </div>
      <LearnMoreModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={() => {
          setModalOpen(false);
        }}
      />
    </section>
  );
};

export default GalleryManagerRoleCard;