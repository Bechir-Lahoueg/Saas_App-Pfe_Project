import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../Landing/Components/Footer";
import Navbar from "../../Landing/Components/Navbar";

// Quick-and-dirty JWT parser (no external deps)
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

// Read cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Set cookie (shared across *.127.0.0.1.nip.io)
function setCookie(name, val) {
  document.cookie = [
    `${name}=${encodeURIComponent(val)}`,
    "Domain=.127.0.0.1.nip.io",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

const LoginPage = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  // If already have a token, decode and go straight to dashboard
  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      // Add entrance animation class after component mounts
      setTimeout(() => {
        setAnimationClass("animate-fade-in");
      }, 100);
      return;
    }

    const payload = parseJwt(token);
    if (payload && payload.subdomain) {
      // set up axios defaults again (in case)
      axios.defaults.baseURL = "http://localhost:8888";
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["X-Tenant-ID"] = payload.subdomain;

      // redirect
      window.location.href = `http://${payload.subdomain}.127.0.0.1.nip.io:5173/dashboard`;
    }
  }, []);

  const handleChange = (e) => {
    setCreds((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8888/auth/tenant/login",
        creds,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { accessToken } = res.data;
      // parse subdomain from token itself
      const payload = parseJwt(accessToken);
      const subdomain = payload?.subdomain;

      if (!subdomain) {
        throw new Error("No subdomain in token payload");
      }

      // persist token in cookie
      setCookie("accessToken", accessToken);

      // configure axios defaults
      axios.defaults.baseURL = "http://localhost:8888";
      axios.defaults.withCredentials = true;
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios.defaults.headers.common["X-Tenant-ID"] = subdomain;

      // redirect to tenant subdomain dashboard
      window.location.href = `http://${subdomain}.127.0.0.1.nip.io:5173/dashboard`;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
    // Typically would redirect to OAuth endpoint
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
      <Navbar />
      
      {/* Main content with horizontal layout */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-8">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-blue-100 rounded-full animate-float opacity-40"></div>
          <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-indigo-100 rounded-full animate-float-delay opacity-30"></div>
          <div className="absolute bottom-1/4 left-2/3 w-72 h-72 bg-blue-50 rounded-full animate-float-slow opacity-50"></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-sky-100 rounded-full animate-pulse opacity-40"></div>
        </div>
        
        {/* Modern horizontal card with glass effect */}
        <div className={`relative flex flex-col md:flex-row bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-6xl z-10 overflow-hidden ${animationClass}`}>
          
          {/* Left side - Branding section */}
          <div className="md:w-5/12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-8 md:p-12 flex flex-col justify-between text-white">
            <div className="mb-auto flex flex-col items-center">
              {/* Animated Calendar SVG Logo */}
              <div className="w-40 h-40 mb-8 animate-float-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="drop-shadow-xl">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  
                  {/* Base calendar shape */}
                  <rect x="70" y="80" width="372" height="352" rx="20" fill="url(#grad1)" filter="url(#shadow)" className="animate-pulse-slow" />
                  
                  {/* Calendar header */}
                  <rect x="70" y="80" width="372" height="70" rx="20" fill="#3b82f6" className="animate-glow" />
                  <rect x="70" y="140" width="372" height="10" fill="#2563eb" />
                  
                  {/* Calendar grid lines */}
                  <line x1="162" y1="150" x2="162" y2="432" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  <line x1="254" y1="150" x2="254" y2="432" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  <line x1="346" y1="150" x2="346" y2="432" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  
                  <line x1="70" y1="227" x2="442" y2="227" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  <line x1="70" y1="304" x2="442" y2="304" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  <line x1="70" y1="381" x2="442" y2="381" stroke="rgba(219,234,254,0.6)" strokeWidth="3" />
                  
                  {/* Calendar elements */}
                  <circle cx="120" cy="190" r="20" fill="#3b82f6" className="animate-float-reverse" />
                  <circle cx="300" cy="265" r="25" fill="#6366f1" className="animate-float-slow" />
                  <circle cx="390" cy="345" r="22" fill="#4f46e5" className="animate-float" />
                  
                  {/* Check mark */}
                  <path d="M310 265 L290 285 L275 270" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-draw" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold mb-2 text-center">PlanifyGo</h1>
              <p className="text-blue-100 text-lg text-center">Simplifiez vos réservations et gérez votre emploi du temps efficacement.</p>
            </div>
            
            {/* Decorative elements */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300/20 rounded-full blur-lg"></div>
              </div>
              <p className="text-sm text-blue-100 mt-8">© 2025 PlanifyGo. All rights reserved.</p>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="md:w-7/12 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Connexion</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={creds.email}
                      onChange={handleChange}
                      className="pl-12 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      placeholder="nom@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <a href="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
                      Mot de passe oublié?
                    </a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={creds.password}
                      onChange={handleChange}
                      className="pl-12 pr-12 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-1 hover:shadow-xl ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">Ou</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.814-2.814A9.996 9.996 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.814-2.814A9.996 9.996 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                        fill="#34A853"
                        clipPath="polygon(6.545 16.5, 16.545 16.5, 16.545 19, 6.545 19)"
                      />
                      <path
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.814-2.814A9.996 9.996 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                        fill="#FBBC05"
                        clipPath="polygon(2.543 7.0, 9.545 7.0, 9.545 17, 2.543 17)"
                      />
                      <path
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.814-2.814A9.996 9.996 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                        fill="#EA4335"
                        clipPath="polygon(2.543 7.0, 9.545 7.0, 9.545 12, 2.543 12)"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">Continuer avec Google</span>
                  </button>
                </div>
              </form>
              
              
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-delay {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes float-logo {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(2deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.7; }
        }
        
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2) drop-shadow(0 0 5px rgba(255,255,255,0.7)); }
        }
        
        @keyframes draw {
          0% { stroke-dasharray: 60; stroke-dashoffset: 60; }
          70% { stroke-dasharray: 60; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 60; stroke-dashoffset: 0; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 9s ease-in-out infinite;
        }
        
        .animate-float-logo {
          animation: float-logo 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-draw {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw 3s ease-in-out forwards infinite;
          animation-delay: 1s;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;