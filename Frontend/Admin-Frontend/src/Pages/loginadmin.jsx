import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; 
import { 
  User, Lock, LogIn, 
  ShieldCheck, RotateCw, 
  Shield, Settings, Layers
} from 'lucide-react';

// Simple JWT parser to extract payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Échec d\'analyse du JWT', e);
    return {};
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);

  // Animation pour le logo
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:8888/auth/admin/login', { email, password });
      const { accessToken } = data;

      // Decode JWT to extract expiration + name
      const payload = parseJwt(accessToken);
      const exp = payload.exp;
      const name = payload.name || '';

      // Store token, its expiration (seconds) and the admin name
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('accessTokenExp', exp.toString());
      localStorage.setItem('name', name);

      navigate('/dashbord');
    } catch (err) {
      setError('Email ou mot de passe invalide');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Animated Logo */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Motif de fond */}
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white opacity-5"
                  style={{
                    width: `${Math.random() * 100 + 20}px`,
                    height: `${Math.random() * 100 + 20}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center z-10">
            {/* Logo animé multi-couches */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10 relative"
            >
              <div className="relative w-64 h-64">
                {/* Cercle externe */}
                <motion.div
                  animate={{ rotate: rotation }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
                </motion.div>
                
                {/* Icône centrale */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white rounded-full p-4 shadow-2xl">
                    <Shield size={80} className="text-blue-600" />
                  </div>
                </motion.div>
                
                {/* Éléments orbitaux */}
                <motion.div
                  animate={{ rotate: -rotation * 2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Settings 
                      size={36}
                      className="absolute text-white"
                      style={{ 
                        transform: 'translate(120px, 0px)'
                      }} 
                    />
                    
                    <Layers 
                      size={28}
                      className="absolute text-white"
                      style={{ 
                        transform: 'translate(-80px, 60px)'
                      }} 
                    />
                    
                    <ShieldCheck 
                      size={32}
                      className="absolute text-white"
                      style={{ 
                        transform: 'translate(-40px, -100px)'
                      }} 
                    />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Administration Sécurisée
            </motion.h1>
            
            <motion.p 
              className="text-blue-100 text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Connectez-vous pour accéder à votre espace d'administration et gérer votre application
            </motion.p>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ 
                  rotateY: [0, 180, 360],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-lg"
              >
                <ShieldCheck size={40} className="text-white" />
              </motion.div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Bienvenue
            </h2>
            <p className="text-center text-gray-500 mb-8">Connectez-vous à votre espace administrateur</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 bg-gray-50"
                    placeholder="admin@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de Passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 font-medium shadow-md"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                      <RotateCw className="h-5 w-5 text-blue-300 animate-spin" />
                    ) : (
                      <LogIn className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                    )}
                  </span>
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;