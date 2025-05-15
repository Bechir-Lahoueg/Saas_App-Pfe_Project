import React from "react";
import { motion } from "framer-motion";

const StaticMedia = () => {
  // Données statiques pour la démonstration
  const staticMedias = {
    logo: [
      {
        id: 1,
        url: "https://placehold.co/200x80/e9f0ff/2563eb?text=Logo&font=open-sans",
        mediaType: "logo",
        createdAt: "2023-05-10T10:30:00.000Z"
      }
    ],
    banner: [
      {
        id: 2,
        url: "https://placehold.co/1920x480/f0f8ff/3b82f6?text=Banner+Image&font=open-sans",
        mediaType: "banner",
        createdAt: "2023-05-11T14:20:00.000Z"
      }
    ],
    video: [],
    photo: [
      {
        id: 3,
        url: "https://placehold.co/800x600/f5f3ff/6d28d9?text=Photo+1&font=open-sans",
        mediaType: "photo",
        createdAt: "2023-05-12T09:40:00.000Z"
      },
      {
        id: 4,
        url: "https://placehold.co/800x600/f0fdf4/16a34a?text=Photo+2&font=open-sans",
        mediaType: "photo",
        createdAt: "2023-05-12T09:45:00.000Z"
      },
      {
        id: 5,
        url: "https://placehold.co/800x600/fef2f2/dc2626?text=Photo+3&font=open-sans",
        mediaType: "photo",
        createdAt: "2023-05-12T09:50:00.000Z"
      }
    ]
  };

  // État statique pour la démonstration
  const activeTab = "gallery"; // 'upload' ou 'gallery'
  const activeMediaType = "all"; // 'all', 'logo', 'banner', 'video', 'photo'
  const selectedType = "logo"; // Pour le formulaire d'ajout
  
  // Fonctions de rendu
  const renderMedia = (media) => {
    if (media.mediaType === "video") {
      return (
        <video
          className="w-full h-auto rounded-lg shadow-lg"
          controls
          key={media.id}
        >
          <source src={media.url} type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      );
    } else {
      return (
        <img
          src={media.url}
          alt={media.mediaType}
          className={`
            ${media.mediaType === "logo" ? "max-h-32 object-contain" : ""}
            ${media.mediaType === "banner" ? "w-full h-56 object-cover" : ""}
            ${media.mediaType === "photo" ? "h-56 w-full object-cover" : ""}
            rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]
          `}
          key={media.id}
        />
      );
    }
  };

  const mediaTypeLabels = {
    logo: "Logo",
    banner: "Bannière",
    video: "Vidéo",
    photo: "Photo",
    all: "Tous",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-3xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-blue-600/5 to-indigo-600/5 rounded-3xl transform -rotate-1"></div>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 pb-1">
            Gestionnaire de médias
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gérez tous vos médias en un seul endroit pour une expérience
            utilisateur optimale
          </p>
        </motion.div>

        {/* Main content with glass morphism */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-8 font-medium transition-all duration-300 ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Ajouter un média
              </span>
            </button>
            <button
              className={`py-4 px-8 font-medium transition-all duration-300 ${
                activeTab === "gallery"
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Bibliothèque de médias
              </span>
            </button>
          </div>

          <div className="p-8">
            {/* Upload Form */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white"
              >
                <div className="flex items-center mb-6">
                  <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Ajouter un média
                  </h2>
                </div>

                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de média
                      </label>
                      <div className="relative">
                        <select
                          value={selectedType}
                          className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-blue-300"
                        >
                          <option value="logo">Logo</option>
                          <option value="banner">Bannière</option>
                          <option value="video">Vidéo</option>
                          <option value="photo">
                            Photos ({staticMedias.photo?.length || 0}/5)
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Message d'information si média existant */}
                      {selectedType === "logo" && staticMedias.logo.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 overflow-hidden"
                        >
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <div>
                              <h3 className="text-sm font-medium text-amber-800">
                                Remplacement de logo
                              </h3>
                              <p className="text-xs text-amber-600 mt-1">
                                Vous avez déjà un logo actif. Le téléchargement d'un nouveau
                                fichier remplacera l'existant.
                              </p>
                              <div className="mt-2 flex space-x-2">
                                <button
                                  type="button"
                                  className="text-xs flex items-center text-amber-700 hover:text-amber-900"
                                >
                                  <svg
                                    className="w-3.5 h-3.5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  Voir l'actuel
                                </button>
                                <button
                                  type="button"
                                  className="text-xs flex items-center text-red-600 hover:text-red-800"
                                >
                                  <svg
                                    className="w-3.5 h-3.5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Supprimer l'actuel
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {selectedType !== "logo" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">
                            Recommandations
                          </h3>
                          <p className="text-xs text-blue-600">
                            {selectedType === "banner" &&
                              "Format: JPG ou PNG haute résolution. Taille recommandée: 1920x480px"}
                            {selectedType === "video" &&
                              "Format: MP4, WebM. Durée maximale recommandée: 1 minute"}
                            {selectedType === "photo" &&
                              `Format: JPG ou PNG haute résolution. Aspect ratio de 16:9 recommandé. (${
                                staticMedias.photo?.length || 0
                              }/5 photos)`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fichier
                      </label>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200 cursor-pointer group"
                      >
                        <div className="space-y-2 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex flex-col items-center text-sm text-gray-600">
                            <p className="text-center mb-2">
                              Glisser-déposer un fichier ici ou
                            </p>
                            <button
                              type="button"
                              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors duration-200"
                            >
                              Parcourir les fichiers
                            </button>
                            <input
                              id="file-input"
                              name="file-input"
                              className="sr-only"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {selectedType === "video"
                              ? "MP4, WebM, Ogg"
                              : "PNG, JPG, GIF jusqu'à 10MB"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      className="w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Télécharger
                      </span>

                      {/* Hover effect */}
                      <span className="absolute inset-0 h-full w-full bg-white/20 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-center rounded-xl transition-all duration-300"></span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Media Gallery */}
            {activeTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Gallery filters */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-white/80">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    <button
                      className={`py-3 px-6 whitespace-nowrap transition-all duration-200 ${
                        activeMediaType === "all"
                          ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 font-medium border-b-2 border-blue-500"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Tous les médias
                    </button>
                    {Object.keys(mediaTypeLabels)
                      .filter((key) => key !== "all")
                      .map((type) => (
                        <button
                          key={type}
                          className={`py-3 px-6 whitespace-nowrap transition-all duration-200 ${
                            activeMediaType === type
                              ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 font-medium border-b-2 border-blue-500"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {mediaTypeLabels[type]}s
                        </button>
                      ))}
                  </div>
                </div>

                {/* Gallery content */}
                <motion.div
                  key="logo-banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Logo */}
                  <motion.div
                    className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-white/50 relative overflow-hidden"
                    whileHover={{ translateY: -5 }}
                  >
                    {/* Background decoration */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-50 rounded-full opacity-60"></div>

                    <div className="flex justify-between items-center mb-5 relative">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        Logo
                      </h2>
                      {staticMedias.logo.length > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Actif
                        </span>
                      )}
                    </div>

                    <div className="bg-white/80 rounded-lg p-6 flex items-center justify-center min-h-[180px] border border-gray-100 shadow-inner">
                      {staticMedias.logo.length > 0 ? (
                        <div className="flex flex-col items-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                            }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm"
                          >
                            {renderMedia(staticMedias.logo[0])}
                          </motion.div>
                          <button
                            className="mt-5 px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 flex items-center shadow-sm hover:shadow"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-500 mt-2">
                            Aucun logo téléchargé
                          </p>
                          <button
                            className="mt-3 text-blue-500 text-sm hover:text-blue-700 hover:underline"
                          >
                            Ajouter un logo
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Bannière */}
                  <motion.div
                    className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-white/50 relative overflow-hidden"
                    whileHover={{ translateY: -5 }}
                  >
                    {/* Background decoration */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-50 rounded-full opacity-60"></div>

                    <div className="flex justify-between items-center mb-5 relative">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                          />
                        </svg>
                        Bannière
                      </h2>
                      {staticMedias.banner.length > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Active
                        </span>
                      )}
                    </div>

                    <div className="bg-white/80 rounded-lg p-4 flex items-center justify-center min-h-[180px] border border-gray-100 shadow-inner">
                      {staticMedias.banner.length === 0 ? (
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                          </svg>
                          <p className="text-gray-500 mt-2">
                            Aucune bannière téléchargée
                          </p>
                          <button
                            className="mt-3 text-blue-500 text-sm hover:text-blue-700 hover:underline"
                          >
                            Ajouter une bannière
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                            }}
                          >
                            {renderMedia(staticMedias.banner[0])}
                          </motion.div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-xs text-gray-500">
                              Ajouté le{" "}
                              {new Date(
                                staticMedias.banner[0].createdAt
                              ).toLocaleDateString()}
                            </p>
                            <button
                              className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 flex items-center shadow-sm hover:shadow"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                          <div className="flex items-center mt-2 bg-gray-50 p-3 rounded-lg">
                            <svg
                              className="w-5 h-5 text-indigo-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs text-gray-600">
                              Pour changer de bannière, supprimez
                              d'abord celle-ci puis ajoutez-en une
                              nouvelle.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Vidéo */}
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-white/50 relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-red-50 rounded-full opacity-60"></div>

                  <div className="flex justify-between items-center mb-5 relative">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Vidéo promotionnelle
                    </h2>
                    {staticMedias.video.length > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Active
                      </span>
                    )}
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 flex items-center justify-center border border-gray-100 shadow-inner">
                    <div className="text-center py-10">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-500 mt-3">
                        Aucune vidéo téléchargée
                      </p>
                      <button
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                      >
                        Ajouter une vidéo
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Photos */}
                <motion.div
                  key="photos"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl border border-white/50 relative overflow-hidden mt-6"
                >
                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-50 rounded-full opacity-60"></div>

                  <div className="flex justify-between items-center mb-5 relative">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Galerie photo
                    </h2>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center ${
                          staticMedias.photo.length > 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {staticMedias.photo.length}/5
                      </span>
                      {staticMedias.photo.length < 5 && (
                        <button
                          className="text-xs flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Ajouter
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 border border-gray-100 shadow-inner">
                    {staticMedias.photo.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staticMedias.photo.map((photo) => (
                          <motion.div
                            key={photo.id}
                            className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-gray-200 to-gray-100 p-1"
                            whileHover={{ scale: 1.03 }}
                            layout
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                            {renderMedia(photo)}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                              <button
                                className="bg-red-600 text-white rounded-full p-2.5 transform hover:scale-110 transition-transform duration-200 shadow-lg"
                                aria-label="Supprimer la photo"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <svg
                          className="w-16 h-16 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 mt-3">
                          Aucune photo téléchargée
                        </p>
                        <button
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                        >
                          Ajouter des photos
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Utilisez des médias de haute qualité pour une meilleure
            présentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaticMedia;