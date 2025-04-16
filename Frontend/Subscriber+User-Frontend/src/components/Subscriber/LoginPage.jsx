import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8888/auth/tenant/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const data = await response.json();

      // Stockage séparé dans localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('darkMode', JSON.stringify(data.darkMode));
      localStorage.setItem('userFirstName', data.tenant.firstName);
      localStorage.setItem('userLastName', data.tenant.lastName);
      localStorage.setItem('userBusinessName', data.tenant.businessName);


      // Redirection
      navigate('/dashbord');

    } catch (err) {
      setError(err.message);
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
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email :</label>
            <input 
              type="email" 
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
              placeholder="esteban_schiller@gmail.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Mot de passe</label>
              <a href="/forgot-password" className="text-sm text-gray-500">Mot de passe oublié?</a>
            </div>
            <input 
              type="password" 
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="••••••••••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Se souvenir du mot de passe</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button 
            type="button" 
            className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
