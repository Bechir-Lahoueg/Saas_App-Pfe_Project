import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [creds, setCreds]   = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    // Function to get cookie value by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const accessToken = getCookie('accessToken');
    const subdomain = getCookie('subdomain');
    
    if (accessToken && subdomain) {
      // User is already logged in, redirect to dashboard
      window.location.href = `http://${subdomain}.127.0.0.1.nip.io:5173/dashboard`;
    }
  }, []);

  const handleChange = e => {
    setCreds(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:8888/auth/tenant/login',
        creds,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      const {
        accessToken,
        refreshToken,
        tenant: { firstName, lastName, subdomain }
      } = res.data;

      // Build a cookie string that shares across *.127.0.0.1.nip.io
      const cookieOpts = [
        'Domain=.127.0.0.1.nip.io',
        'Path=/',
        'SameSite=Lax'
      ].join('; ');

      // Persist tokens & user info in cookies
      document.cookie = `accessToken=${accessToken}; ${cookieOpts}`;
      document.cookie = `refreshToken=${refreshToken}; ${cookieOpts}`;
      document.cookie = `userFirstName=${encodeURIComponent(firstName)}; ${cookieOpts}`;
      document.cookie = `userLastName=${encodeURIComponent(lastName)}; ${cookieOpts}`;
      document.cookie = `subdomain=${subdomain}; ${cookieOpts}`;

      // Configure axios for API calls (still sends Auth header)
      axios.defaults.baseURL                = 'http://localhost:8888';
      axios.defaults.withCredentials        = true;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      axios.defaults.headers.common['X-Tenant-ID']    = subdomain;

      // Redirect to the tenant's subdomain dashboard
      window.location.href = `http://${subdomain}.127.0.0.1.nip.io:5173/dashboard`;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full translate-y-1/4 -translate-x-1/4"></div>
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400 rounded-full -translate-x-1/4"></div>

      {/* Login card */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>
        <p className="text-center text-gray-600 mb-6">
          Veuillez entrer votre email et votre mot de passe pour continuer
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={creds.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Mot de passe :
            </label>
            <input
              type="password"
              id="password"
              value={creds.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;