import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "../components/sonner"; // Matching your template's layout
import { toast } from "sonner";

/* Keyframes injected once — matched identically to your template */
const keyframes = `
  @keyframes bgZoom {
    from { transform: scale(1); }
    to   { transform: scale(1.06); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 30px rgba(255,0,0,0.4), 0 0 80px rgba(255,0,0,0.25); }
    50%       { box-shadow: 0 0 45px rgba(255,0,0,0.6), 0 0 100px rgba(255,0,0,0.35); }
  }
  @keyframes logoBounce {
    0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
    70%  { transform: scale(1.08) rotate(2deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .anim-bg     { animation: bgZoom 18s ease-in-out infinite alternate; }
  .anim-logo   { animation: logoBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
  .anim-title  { animation: fadeInDown 0.65s ease 0.25s both; }
  .anim-card   { animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both, glowPulse 4s ease-in-out 1.2s infinite; }
  .anim-label  { animation: fadeInUp 0.5s ease both; }
  .anim-input  { animation: fadeInUp 0.5s ease both; }
  .anim-btn    { animation: fadeInUp 0.5s ease both; }
  .anim-row    { animation: fadeInUp 0.5s ease both; }

  .input-focus-ring:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 100, 100, 0.55), 0 0 12px rgba(255,0,0,0.25);
    transform: scale(1.01);
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .btn-submit {
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .btn-submit:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 28px rgba(255,0,0,0.35);
  }
  .btn-submit:active { transform: scale(0.97); }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault(); // Prevent standard form reload behavior
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      toast.success("OTP sent to your email 🎉", { description: "Please check your inbox or spam folder." });
      setShowOtpField(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Password reset failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      toast.success("Password changed successfully 🎉", { description: "Welcome back! Redirecting to home..." });
      navigate("/");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <Toaster />

      <div className="w-screen h-screen relative overflow-hidden">
        
        {/* Background — slow Ken Burns zoom */}
        <img
          src="./Login.jpg"
          alt="background"
          className="anim-bg absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />
        <div className="absolute inset-0 bg-black/10" />

        {/* Logo — spring bounce in */}
        <img
          src="./ArtVista.png"
          alt="logo"
          className="anim-logo absolute top-17.5 right-30 w-24 h-24 rounded-full"
        />

        {/* Heading — slides down */}
        <h1 className="
          anim-title
          absolute
          left-[70px]
          top-[110px]
          text-white
          text-6xl
          font-['Righteous']
          uppercase
          tracking-wide
        ">
          {showOtpField ? "Reset Password" : "Recover Account"}
        </h1>

        {/* Card — slides up + glow pulse */}
        <div className="
          anim-card
          absolute
          left-[69px]
          top-[220px]
          w-[516px]
          min-h-[420px]
          rounded-[44px]
          bg-red-700/20
          backdrop-blur-2xl
          border border-red-300/30
          shadow-[0_0_30px_rgba(255,0,0,0.4),0_0_80px_rgba(255,0,0,0.25)]
          p-10
          text-white
          transition-all duration-500
        ">
          
          {/* Form wrapper splits conditionally based on OTP validation phase */}
          {!showOtpField ? (
            <form onSubmit={sendOtp}>
              {/* Email label */}
              <label
                className="anim-label text-3xl font-['Madimi_One'] uppercase block"
                style={{ animationDelay: "0.55s" }}
              >
                Email
              </label>

              {/* Email input */}
              <input
                type="email"
                value={email}
                className="
                  anim-input
                  input-focus-ring
                  w-full mt-2 mb-8 h-12 rounded-lg
                  bg-red-100 font-bold
                  backdrop-blur-sm px-4 text-black
                  transition-all duration-200
                "
                style={{ animationDelay: "0.6s" }}
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Send OTP button */}
              <button
                className="
                  anim-btn
                  btn-submit
                  w-[320px] h-14
                  bg-red-300
                  text-black
                  rounded-[45px]
                  text-3xl
                  font-['Metal_Mania']
                  uppercase
                  mx-auto block mt-4
                "
                style={{ animationDelay: "0.68s" }}
                type="submit"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword}>
              {/* OTP label */}
              <label
                className="anim-label text-3xl font-['Madimi_One'] uppercase block"
                style={{ animationDelay: "0.4s" }}
              >
                OTP Code
              </label>

              {/* OTP input */}
              <input
                type="text"
                value={otp}
                className="
                  anim-input
                  input-focus-ring
                  w-full mt-2 mb-5 h-12 rounded-lg
                  bg-red-100 font-bold
                  backdrop-blur-sm px-4 text-black
                  transition-all duration-200
                "
                style={{ animationDelay: "0.45s" }}
                required
                onChange={(e) => setOtp(e.target.value)}
              />

              {/* New Password label */}
              <label
                className="anim-label text-3xl font-['Madimi_One'] uppercase block"
                style={{ animationDelay: "0.5s" }}
              >
                New Password
              </label>

              {/* New Password input */}
              <input
                type="password"
                value={newPassword}
                className="
                  anim-input
                  input-focus-ring
                  w-full mt-2 mb-8 h-12 rounded-lg
                  bg-red-100 font-bold
                  backdrop-blur-sm px-4 text-black
                  transition-all duration-200
                "
                style={{ animationDelay: "0.55s" }}
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* Change Password button */}
              <button
                className="
                  anim-btn
                  btn-submit
                  w-[320px] h-14
                  bg-red-400
                  text-black
                  rounded-[45px]
                  text-3xl
                  font-['Metal_Mania']
                  uppercase
                  mx-auto block mt-4
                "
                style={{ animationDelay: "0.6s" }}
                type="submit"
              >
                Change Password
              </button>
            </form>
          )}

          {/* Navigation back to login */}
          <Link to="/login">
            <div
              className="
                anim-row
                text-center mt-8
                font-['Merriweather'] uppercase text-sm
                hover:text-red-300
                transition-colors duration-200
                cursor-pointer
              "
              style={{ animationDelay: "0.75s" }}
            >
              Remember your password? <span className="font-black">Sign In</span>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
};

export default ForgotPassword;