import React from "react";
import {
  UserCircle,
  Camera,
  Check,
  X,
  Edit,
  Save,
  Settings,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
} from "lucide-react";

const TenantProfilePageStatic = () => {
  // Données statiques pour simuler le tenant
  const tenant = {
    id: "123",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    businessName: "Entreprise Dupont",
    address: "123 Rue de la République",
    city: "Paris",
    zipcode: "75001",
    country: "France",
    subdomain: "dupont",
    profileImageUrl: null,
  };

  // Valeurs statiques pour les états
  const isEditing = false;
  const imagePreview = null;
  const resetPasswordSent = false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Paramètres de votre compte</h1>
              <p className="mt-2 text-blue-100">
                Gérez les informations de votre entreprise et personnalisez
                votre profil
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="relative">
                {tenant.profileImageUrl ? (
                  <img
                    src={tenant.profileImageUrl}
                    alt={tenant.businessName}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/20 border-4 border-white shadow-md">
                    <UserCircle className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-xl">{tenant.businessName}</h2>
                <p className="text-blue-100">
                  {tenant.subdomain}.planifygo.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings navigation and content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar navigation */}
          <div className="w-full md:w-64">
            <nav className="bg-white rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                <li>
                  <button className="w-full text-left py-3 px-4 flex items-center bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                    <User className="w-5 h-5 mr-3" />
                    <span>Profil</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left py-3 px-4 flex items-center text-gray-700 hover:bg-gray-50">
                    <Building className="w-5 h-5 mr-3" />
                    <span>Entreprise</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left py-3 px-4 flex items-center text-gray-700 hover:bg-gray-50">
                    <Lock className="w-5 h-5 mr-3" />
                    <span>Sécurité</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Help card */}
            <div className="mt-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Besoin d'aide ?
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                Notre équipe d'assistance est disponible pour vous aider avec
                vos paramètres.
              </p>
              <a
                href="/support"
                className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded inline-block transition-colors"
              >
                Contacter le support
              </a>
            </div>
          </div>

          {/* Right content area - Profile tab */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Photo de profil
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Image actuelle ou prévisualisation */}
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-center shadow-inner border border-gray-200">
                      <UserCircle className="w-24 h-24 text-gray-300" />
                    </div>

                    <button
                      className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
                      title="Modifier la photo"
                    >
                      <Camera size={20} />
                    </button>
                  </div>

                  {/* Contrôles pour la modification d'image */}
                  <div className="mt-4 md:mt-0">
                    <input
                      type="file"
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="flex flex-col space-y-3">
                        <p className="text-sm text-gray-600">
                          Cliquez sur "Enregistrer" pour appliquer la nouvelle
                          photo
                        </p>
                        <div className="flex items-center space-x-3">
                          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm">
                            <Check className="w-4 h-4 mr-2" />
                            Enregistrer
                          </button>
                          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm">
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier la photo
                        </button>
                        <p className="mt-2 text-xs text-gray-500">
                          Format recommandé: JPG, PNG. Taille maximale: 5 Mo
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="mr-2 w-5 h-5 text-blue-600" />
                  Informations personnelles
                </h2>

                {!isEditing ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Prénom
                        </h3>
                        <p className="text-base text-gray-900">
                          {tenant.firstName}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Nom
                        </h3>
                        <p className="text-base text-gray-900">
                          {tenant.lastName}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Email
                        </h3>
                        <p className="text-base text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-blue-500" />
                          {tenant.email}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Téléphone
                        </h3>
                        <p className="text-base text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-blue-500" />
                          {tenant.phone}
                        </p>
                      </div>
                    </div>

                    <button className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier mes informations
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={tenant.firstName}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={tenant.lastName}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={tenant.email}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={tenant.phone}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        Annuler
                      </button>
                      <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfilePageStatic;