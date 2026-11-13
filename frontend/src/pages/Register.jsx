import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster } from "../components/sonner"; // Added to match the system notification container template
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

  .btn-signin {
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .btn-signin:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 28px rgba(255,0,0,0.35);
  }
  .btn-signin:active { transform: scale(0.97); }

  .btn-google {
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-google:hover { opacity: 0.8; transform: scale(1.02); }
  .btn-google:active { transform: scale(0.97); }
`;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success(`OTP sent to ${email} 🎉`);
      setShowOtpField(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully 🎉");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate("/");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const gooleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: tokenResponse.access_token,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error("Google login failed");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate("/");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    },
  });

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
          src="./Register.jpg"
          alt="background"
          className="anim-bg absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Logo — spring bounce in */}
        <img
          src="./ArtVista.png"
          alt="logo"
          className="anim-logo absolute top-[60px] left-[60px] w-24 h-24 rounded-full"
        />

        {/* Heading — slides down */}
        <h1
          className="
            anim-title
            absolute
            top-[70px]
            right-[120px]
            text-white
            text-6xl
            uppercase
            font-['Righteous']
          "
        >
          Create an Account
        </h1>

        {/* Card — slides up + glow pulse */}
        <div
          className="
            anim-card
            absolute
            right-[120px]
            top-[220px]
            w-[520px]
            rounded-[44px]
            bg-red-700/15
            backdrop-blur-2xl
            border border-red-300/30
            shadow-[0_0_40px_rgba(255,0,0,0.35)]
            p-10
            text-white
          "
        >
          <form onSubmit={handleSubmit}>
            {/* Name input */}
            <label 
              className="anim-label text-3xl font-['Madimi_One'] uppercase block"
              style={{ animationDelay: "0.45s" }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              className="
                anim-input
                input-focus-ring
                w-full mt-2 mb-6 h-12 rounded-lg 
                bg-red-100 px-4 font-bold text-black
                transition-all duration-200
              "
              style={{ animationDelay: "0.5s" }}
              required
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email input */}
            <label 
              className="anim-label text-3xl font-['Madimi_One'] uppercase block"
              style={{ animationDelay: "0.55s" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              className="
                anim-input
                input-focus-ring
                w-full mt-2 mb-6 h-12 rounded-lg 
                bg-red-100 px-4 font-bold text-black
                transition-all duration-200
              "
              style={{ animationDelay: "0.6s" }}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <label 
              className="anim-label text-3xl font-['Madimi_One'] uppercase block"
              style={{ animationDelay: "0.65s" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              className="
                anim-input
                input-focus-ring
                w-full mt-2 mb-6 h-12 rounded-lg 
                bg-red-100 px-4 font-bold text-black
                transition-all duration-200
              "
              style={{ animationDelay: "0.7s" }}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Conditional OTP validation block */}
            {showOtpField && (
              <>
                <label 
                  className="anim-label text-3xl font-['Madimi_One'] uppercase block"
                  style={{ animationDelay: "0.75s" }}
                >
                  OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  className="
                    anim-input
                    input-focus-ring
                    w-full mt-2 mb-6 h-12 rounded-lg 
                    bg-red-100 px-4 font-bold text-black
                    transition-all duration-200
                  "
                  style={{ animationDelay: "0.8s" }}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  className="
                    anim-btn
                    btn-signin
                    w-full
                    h-14
                    bg-red-300
                    text-black
                    rounded-[45px]
                    text-2xl
                    font-['Metal_Mania']
                    uppercase
                    mt-4 block
                  "
                  style={{ animationDelay: "0.85s" }}
                >
                  Verify OTP
                </button>
              </>
            )}

            {/* Action control button conditional rendering */}
            {!showOtpField && (
              <button
                type="submit"
                className="
                  anim-btn
                  btn-signin
                  w-full
                  h-14
                  bg-red-300
                  text-black
                  rounded-[45px]
                  text-2xl
                  font-['Metal_Mania']
                  uppercase
                  mt-4 block
                "
                style={{ animationDelay: "0.75s" }}
              >
                Create Account
              </button>
            )}
          </form>

          {/* Login routing fallback entry text */}
          <div 
            className="anim-row text-center mt-6 font-['Merriweather'] uppercase"
            style={{ animationDelay: "0.85s" }}
          >
            Already have an account?{" "}
            <Link to="/login" className="font-black cursor-pointer hover:text-red-300 transition-colors duration-200">
              Login
            </Link>
          </div>

          {/* Graphical Divider line breaking options layout blocks */}
          <div 
            className="anim-row flex items-center my-6"
            style={{ animationDelay: "0.9s" }}
          >
            <div className="flex-1 h-[1px] bg-white"></div>
            <span className="px-4 font-['Rubik_Mono_One']">OR</span>
            <div className="flex-1 h-[1px] bg-white"></div>
          </div>

          {/* OAuth Integration Trigger Button */}
          <button
            className="
              anim-btn
              btn-google
              w-full
              flex
              items-center
              justify-center
              gap-3
              text-white
              text-2xl
              font-['Mirza']
              uppercase
              cursor-pointer
            "
            style={{ animationDelay: "0.95s" }}
            onClick={() => gooleLogin()}
          >
            <img 
              src="./Icons/google.png" 
              alt="google" 
              className="w-8 h-8 transition-transform duration-200 hover:rotate-12" 
            />
            Sign up with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;