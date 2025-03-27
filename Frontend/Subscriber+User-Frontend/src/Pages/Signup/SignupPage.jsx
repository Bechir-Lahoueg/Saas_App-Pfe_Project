import React from 'react';

const SignupPage = () => {
  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Formes d'arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full translate-y-1/4 -translate-x-1/4"></div>
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-400 rounded-full -translate-x-1/4"></div>
      
      {/* Carte d'inscription */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10">
        <h2 className="text-2xl font-semibold text-center mb-2">Créer un compte</h2>
        
        <p className="text-center text-gray-600 mb-6 text-sm">
          Créer un compte pour continuer
        </p>
        
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Address Email :</label>
            <input 
              type="email" 
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
              placeholder="esteban_schiller@gmail.com"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-700 mb-1">Nom d'utilisateur</label>
            <input 
              type="text" 
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
              placeholder="Nom d'utilisateur"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company" className="block text-sm text-gray-700 mb-1">Nom de l'entreprise</label>
            <input 
              type="text" 
              id="company"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
              placeholder="Nom de l'entreprise"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Mot de passe</label>
              <a href="#" className="text-sm text-gray-500">Mot de passe oublié ?</a>
            </div>
            <input 
              type="password" 
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="• • • • • •"
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">J'accepte les termes et conditions</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            S'inscrire
          </button>
          
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">Vous avez déjà un compte ? </span>
            <a href="#" className="text-sm text-blue-500 font-medium">Se Connecter</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;