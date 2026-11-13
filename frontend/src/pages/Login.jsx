import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Toaster } from "../components/sonner";
import { toast } from "sonner";

/* Keyframes injected once — only what Tailwind can't do inline */
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
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
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

  .divider-line {
    transition: width 0.6s ease;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error("Login Failed", { description: "Account Not created or Password Mismatch" });
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Logined successfully 🎉", { description: "Welcome again! Redirecting you to home..." });
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error("Login Failed"); 
          setLoading(false);
          return; }
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        toast.success("Logined successfully 🎉", { description: "Welcome again! Redirecting you to home..." });
        navigate("/");
      } catch (err) { console.error(err);
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
          Welcome Back !
        </h1>

        {/* Card — slides up + glow pulse */}
        <div className="
          anim-card
          absolute
          left-[69px]
          top-[220px]
          w-[516px]
          h-[610px]
          rounded-[44px]
          bg-red-700/20
          backdrop-blur-2xl
          border border-red-300/30
          shadow-[0_0_30px_rgba(255,0,0,0.4),0_0_80px_rgba(255,0,0,0.25)]
          p-10
          text-white
        ">
          <form onSubmit={handleSubmit}>

            {/* Email label */}
            <label
              className="anim-label text-3xl font-['Madimi_One'] uppercase"
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
                w-full mt-2 mb-6 h-12 rounded-lg
                bg-red-100 font-bold
                backdrop-blur-sm px-4 text-black
                transition-all duration-200
              "
              style={{ animationDelay: "0.6s" }}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password label */}
            <label
              className="anim-label text-3xl font-['Madimi_One'] uppercase"
              style={{ animationDelay: "0.68s" }}
            >
              Password
            </label>

            {/* Password input */}
            <input
              type="password"
              value={password}
              className="
                anim-input
                input-focus-ring
                w-full mt-2 mb-3 h-12 rounded-lg
                bg-red-100 font-bold
                backdrop-blur-sm px-4 text-black
                transition-all duration-200
              "
              style={{ animationDelay: "0.72s" }}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Forgot password */}
            <Link to="/forgot-password">
            <div
              className="
                anim-row
                text-right text-sm mb-6
                font-['Merriweather'] uppercase
                cursor-pointer
                hover:text-red-300
                transition-colors duration-200
              "
              style={{ animationDelay: "0.78s" }}
            >
              Forgot Password?
            </div>
            </Link>

            {/* Sign In button */}
            <button
              className="
                anim-btn
                btn-signin
                w-[320px] h-14
                bg-red-300
                text-black
                rounded-[45px]
                text-3xl
                font-['Metal_Mania']
                uppercase
                mx-auto block
              "
              style={{ animationDelay: "0.84s" }}
              type="submit"
            >
              Sign In
            </button>
          </form>

          {/* Register link */}
          <Link to="/register">
            <div
              className="
                anim-row
                text-center mt-6
                font-['Merriweather'] uppercase
                hover:text-red-300
                transition-colors duration-200
                cursor-pointer
              "
              style={{ animationDelay: "0.9s" }}
            >
              Don't have an account?{" "}
              <span className="font-black">Register</span>
            </div>
          </Link>

          {/* Divider */}
          <div
            className="anim-row flex items-center my-6"
            style={{ animationDelay: "0.96s" }}
          >
            <div className="flex-1 h-[1px] bg-white" />
            <span className="px-4 font-['Rubik_Mono_One']">OR</span>
            <div className="flex-1 h-[1px] bg-white" />
          </div>

          {/* Google button */}
          <button
            className="
              anim-btn
              btn-google
              w-full flex items-center justify-center gap-3
              text-white text-2xl
              font-['Mirza'] uppercase
              cursor-pointer
            "
            style={{ animationDelay: "1.02s" }}
            onClick={() => gooleLogin()}
          >
            <img
              src="./Icons/google.png"
              alt="google"
              className="w-8 h-8 transition-transform duration-200 hover:rotate-12"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;