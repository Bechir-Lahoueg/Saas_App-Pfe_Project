import React from 'react';
import { Pencil, Trash2, X, UserPlus, RefreshCw, CheckCircle, XCircle, Phone, Mail, 
  Users, User, Search, AlertTriangle, Calendar, ChevronDown } from 'lucide-react';

// Données statiques des employés pour la démo
const staticEmployees = [
  {
    id: 1,
    firstName: "Sophie",
    lastName: "Durand",
    email: "sophie.durand@example.com",
    phone: "+216 98 765 432",
    status: "ACTIVE",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    firstName: "Thomas",
    lastName: "Martin",
    email: "thomas.martin@example.com",
    phone: "+216 95 123 456",
    status: "ACTIVE",
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    firstName: "Emma",
    lastName: "Petit",
    email: "emma.petit@example.com",
    phone: "+216 92 876 543",
    status: "INACTIVE",
    imageUrl: null
  },
  {
    id: 4,
    firstName: "Lucas",
    lastName: "Bernard",
    email: "lucas.bernard@example.com",
    phone: "+216 93 234 567",
    status: "ACTIVE",
    imageUrl: "https://randomuser.me/api/portraits/men/4.jpg"
  }
];

const StaticEmployees = () => {
  // Fonction pour obtenir les initiales
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  // Fonction pour générer une couleur d'avatar cohérente
  const getAvatarColor = (id) => {
    const colors = [
      'from-pink-400 to-purple-500',
      'from-cyan-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-teal-400 to-emerald-500',
      'from-fuchsia-400 to-purple-500',
      'from-amber-400 to-red-500'
    ];
    
    const idStr = String(id || '');
    const hash = idStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Fonction pour obtenir la classe de statut
  const getStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
      case 'INACTIVE':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Changé le bg de wrapper pour s'assurer qu'il fonctionne en mode sombre
    <div className="bg-slate-50 white:bg-slate-900 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header Card */}
        <div className="mb-6 bg-white white:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestion des Talents
                </h1>
                <p className="text-indigo-100 opacity-80">
                  Gérez efficacement votre équipe en quelques clics
                </p>
              </div>
              <div className="hidden md:flex space-x-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white flex items-center">
                  <Users size={18} className="mr-2" />
                  <span className="font-medium">{staticEmployees.length} employés</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white flex items-center">
                  <User size={18} className="mr-2" />
                  <span className="font-medium">{staticEmployees.filter(e => e.status === 'ACTIVE').length} disponible</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Panel - J'ai corrigé les classes d'arrière-plan ici */}
          <div className="p-4 bg-white white:bg-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 white:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un employé..."
                className="pl-10 w-full bg-gray-50 white:bg-slate-700 border border-gray-200 white:border-slate-700 rounded-xl py-2 px-4 text-slate-800 white:text-slate-200 outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select 
                className="bg-gray-50 white:bg-slate-700 border border-gray-200 white:border-slate-700 rounded-xl py-2 px-4 text-slate-800 white:text-slate-200 outline-none" 
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ACTIVE">Disponible</option>
                <option value="INACTIVE">Indisponible</option>
              </select>
              
              <button
                className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 flex items-center"
              >
                <UserPlus size={18} className="mr-2" /> Nouvel employé
              </button>
              
              <button 
                className="p-2 rounded-xl border border-gray-200 white:border-slate-700 hover:bg-gray-50 white:hover:bg-slate-700 text-gray-600 white:text-gray-300"
                title="Rafraîchir les données"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Employee Form - Corrigé les classes d'arrière-plan */}
        <div id="employeeForm" className="mb-6">
          <div className="p-8 rounded-2xl shadow-lg bg-white white:bg-slate-800">
            <h3 className="text-xl font-bold mb-6 flex items-center text-slate-800 white:text-slate-200">
              <UserPlus size={20} className="mr-2 text-indigo-600" />
              Ajouter un nouvel employé
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="w-full border border-gray-300 white:border-slate-600 rounded-xl px-4 py-3 bg-white white:bg-slate-700 text-slate-800 white:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    placeholder="Nom"
                    className="w-full border border-gray-300 white:border-slate-600 rounded-xl px-4 py-3 bg-white white:bg-slate-700 text-slate-800 white:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1 flex items-center">
                    <Mail size={14} className="mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 white:border-slate-600 rounded-xl px-4 py-3 bg-white white:bg-slate-700 text-slate-800 white:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1 flex items-center">
                    <Phone size={14} className="mr-1" /> Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    className="w-full border border-gray-300 white:border-slate-600 rounded-xl px-4 py-3 bg-white white:bg-slate-700 text-slate-800 white:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1">
                  Photo de profil
                </label>
                <div className="mt-1 flex items-center space-x-5">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white">
                      <span className="font-bold text-xl">NN</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="relative cursor-pointer bg-white white:bg-slate-700 py-2 px-4 border border-gray-300 white:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 white:text-gray-300 hover:bg-gray-50 white:hover:bg-slate-600 focus:outline-none">
                      <span>Changer de photo</span>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 white:text-gray-300 mb-1">
                  Statut
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="cursor-pointer border border-green-500 bg-green-50 white:bg-green-900/20 ring-2 ring-green-500 rounded-xl p-4 flex items-center"
                  >
                    <CheckCircle size={24} className="mr-3 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800 white:text-gray-200">Disponible</p>
                      <p className="text-xs text-gray-500 white:text-gray-400">L'employé est en activité</p>
                    </div>
                  </div>
                  
                  <div 
                    className="cursor-pointer border border-gray-300 white:border-slate-600 hover:bg-gray-50 white:hover:bg-slate-700 rounded-xl p-4 flex items-center"
                  >
                    <XCircle size={24} className="mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 white:text-gray-200">Indisponible</p>
                      <p className="text-xs text-gray-500 white:text-gray-400">L'employé est en pause</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl border border-gray-300 white:border-slate-600 text-gray-700 white:text-gray-300 hover:bg-gray-100 white:hover:bg-slate-700 flex items-center"
                >
                  <X className="mr-2" size={18} /> Annuler
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 flex items-center"
                >
                  <UserPlus className="mr-2" size={18} /> Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Employee List - Corrigé les classes d'arrière-plan */}
        <div className="bg-white white:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 white:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 white:text-gray-200 flex items-center">
              <Users size={20} className="mr-2 text-indigo-600" />
              Liste des employés 
              <span className="ml-2 text-sm bg-indigo-100 white:bg-indigo-900/30 text-indigo-700 white:text-indigo-300 px-2 py-1 rounded-full">
                {staticEmployees.length} employés
              </span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 white:bg-slate-700">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 white:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 white:hover:bg-slate-600">
                    <div className="flex items-center">
                      Employé
                      <ChevronDown size={16} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 white:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 white:hover:bg-slate-600">
                    <div className="flex items-center">
                      Contact
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 white:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 white:hover:bg-slate-600">
                    <div className="flex items-center">
                      Statut
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 white:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staticEmployees.map((emp, index) => (
                  <tr 
                    key={emp.id} 
                    className={`group hover:bg-indigo-50 white:hover:bg-indigo-900/20 ${index % 2 === 0 ? 'bg-white white:bg-slate-800' : 'bg-gray-50 white:bg-slate-700/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl overflow-hidden shadow-sm transform transition-transform group-hover:scale-110">
                          {emp.imageUrl ? (
                            <img
                              src={emp.imageUrl}
                              alt={`${emp.firstName} ${emp.lastName}`}
                              className="h-12 w-12 object-cover"
                            />
                          ) : (
                            <div className={`h-12 w-12 bg-gradient-to-br ${getAvatarColor(emp.id)} text-white flex items-center justify-center`}>
                              <span className="font-bold text-lg">
                                {getInitials(emp.firstName, emp.lastName)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-semibold text-gray-900 white:text-gray-200 group-hover:text-indigo-700 white:group-hover:text-indigo-400">
                            {emp.firstName} {emp.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="flex items-center mb-1 text-sm">
                          <Mail size={14} className="mr-2 text-indigo-400" /> 
                          <a href="#" className="text-gray-700 white:text-gray-300 hover:text-indigo-600 white:hover:text-indigo-400">
                            {emp.email}
                          </a>
                        </span>
                        {emp.phone && (
                          <span className="flex items-center text-sm">
                            <Phone size={14} className="mr-2 text-green-400" /> 
                            <a href="#" className="text-gray-700 white:text-gray-300 hover:text-green-600 white:hover:text-green-400">
                              {emp.phone}
                            </a>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(emp.status)}`}>
                        {emp.status === 'ACTIVE' ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        className="text-amber-600 hover:text-amber-900 bg-amber-50 white:bg-amber-900/20 hover:bg-amber-100 white:hover:bg-amber-900/30 p-2 rounded-lg inline-flex items-center justify-center"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 bg-red-50 white:bg-red-900/20 hover:bg-red-100 white:hover:bg-red-900/30 p-2 rounded-lg inline-flex items-center justify-center"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer with additional information */}
          <div className="border-t border-gray-200 white:border-slate-700 p-4 text-sm text-gray-500 white:text-gray-400 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-indigo-400" /> 
                <span>Dernière mise à jour: {new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="hidden md:flex items-center">
                <CheckCircle size={14} className="mr-1 text-green-500" /> 
                <span>{staticEmployees.filter(e => e.status === 'ACTIVE').length} disponible</span>
              </div>
              
              <div className="hidden md:flex items-center">
                <XCircle size={14} className="mr-1 text-gray-500" /> 
                <span>{staticEmployees.filter(e => e.status === 'INACTIVE').length} indisponible</span>
              </div>
            </div>
            
            <div>
              <button 
                className="text-indigo-500 hover:text-indigo-700 white:text-indigo-400 white:hover:text-indigo-300 flex items-center"
              >
                Retour en haut
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button (mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 pulsingButton"
        >
          <UserPlus size={24} />
        </button>
      </div>

      <style jsx>{`
        .pulsingButton {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default StaticEmployees;