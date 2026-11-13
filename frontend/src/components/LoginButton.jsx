import { motion } from "framer-motion";
import { User } from "lucide-react";

const LoginButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="
        group relative overflow-hidden
        flex items-center gap-2
        px-5 py-2.5
        rounded-full
        
        bg-white/5
        backdrop-blur-md
        
        border border-cyan-200/20
        hover:border-cyan-200/40
        
        text-white
        
        shadow-[0_0_20px_rgba(120,200,255,0.08)]
        hover:shadow-[0_0_30px_rgba(120,200,255,0.18)]
        
        transition-all duration-500
      "
    >
      {/* soft glow */}
      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition duration-500
          bg-gradient-to-r
          from-cyan-400/10
          via-white/5
          to-blue-400/10
        "
      />

      {/* shimmer */}
      <span
        className="
          absolute inset-0
          -translate-x-full
          group-hover:translate-x-full
          transition-transform duration-1000
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />

      {/* icon */}
      <div
        className="
          relative z-10
          w-8 h-8
          rounded-full
          flex items-center justify-center
          
          bg-white/8
          border border-white/10
          
          group-hover:bg-cyan-300/10
          transition-all duration-300
        "
      >
        <User
          size={16}
          strokeWidth={1.8}
          className="text-cyan-100"
        />
      </div>

      {/* text */}
      <span
        className="
          relative z-10
          text-sm tracking-[0.18em]
          uppercase
          font-semibold
          text-white/90
        "
      >
        Login
      </span>
    </motion.button>
  );
};

export default LoginButton;