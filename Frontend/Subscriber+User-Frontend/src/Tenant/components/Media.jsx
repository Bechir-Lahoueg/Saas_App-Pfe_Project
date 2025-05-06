import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useDropzone } from "react-dropzone";

const MediaManager = () => {
  const [medias, setMedias] = useState({
    logo: [],
    banner: [],
    video: [],
    photo: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("logo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeMediaType, setActiveMediaType] = useState("all");

  // Animation values
  const opacity = useMotionValue(1);

  // Récupérer tous les médias au chargement
  useEffect(() => {
    fetchAllMedia();
  }, []);

  // Reset preview when file or type changes
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // Dropzone setup
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);

        // Validation du type de fichier
        if (selectedType === "video" && !file.type.startsWith("video/")) {
          showError("Veuillez sélectionner un fichier vidéo");
          return;
        }

        if (selectedType !== "video" && !file.type.startsWith("image/")) {
          showError("Veuillez sélectionner une image");
          return;
        }

        setError("");
      }
    },
    [selectedType]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: selectedType === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    noClick: true,
  });

  // Récupérer tous les médias et les organiser par type
  const fetchAllMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/schedule/media");

      // Organiser par type
      const mediaByType = {
        logo: [],
        banner: [],
        video: [],
        photo: [],
      };

      response.data.forEach((media) => {
        if (mediaByType[media.mediaType]) {
          mediaByType[media.mediaType].push(media);
        }
      });

      setMedias(mediaByType);
    } catch (err) {
      showError("Erreur lors du chargement des médias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 5000);
  };

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Validation du type de fichier
      if (selectedType === "video" && !file.type.startsWith("video/")) {
        showError("Veuillez sélectionner un fichier vidéo");
        return;
      }

      if (selectedType !== "video" && !file.type.startsWith("image/")) {
        showError("Veuillez sélectionner une image");
        return;
      }

      setError("");
    }
  };

  // Upload du fichier
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      showError("Veuillez sélectionner un fichier");
      return;
    }

    setLoading(true);
    setError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("mediaType", selectedType);

    try {
      await axios.post("/schedule/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Message de succès plus détaillé
      const mediaTypeName =
        selectedType === "logo"
          ? "Logo"
          : selectedType === "banner"
          ? "Bannière"
          : selectedType === "video"
          ? "Vidéo"
          : "Photo";

      showSuccess(
        `${mediaTypeName} téléchargé avec succès! Vous pouvez le voir dans la bibliothèque de médias.`
      );

      // Ajoutez une notification permanente plus visible
      const notificationDiv = document.createElement("div");
      notificationDiv.className =
        "fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg z-50 animate-bounce";
      notificationDiv.innerHTML = `
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">${mediaTypeName} enregistré dans la bibliothèque</p>
          </div>
        </div>
      `;
      document.body.appendChild(notificationDiv);

      // Retirer la notification après 5 secondes
      setTimeout(() => {
        notificationDiv.classList.add("fade-out");
        setTimeout(() => document.body.removeChild(notificationDiv), 1000);
      }, 5000);

      setSelectedFile(null);
      setPreview(null);
      document.getElementById("file-input").value = "";

      // Rafraîchir les médias
      fetchAllMedia();

      // Passer automatiquement à l'onglet gallery pour voir le média téléchargé
      setTimeout(() => {
        setActiveTab("gallery");
        setActiveMediaType(selectedType);
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || "Erreur lors du téléchargement");
      } else {
        showError("Erreur lors du téléchargement");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ajoutez cette fonction pour une confirmation de suppression plus visuelle
  const confirmDelete = async (id, type) => {
    // Créer un élément modal de confirmation personnalisé
    const modalContainer = document.createElement("div");
    modalContainer.className =
      "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm";

    modalContainer.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full transform transition-all">
        <div class="flex items-center mb-4">
          <div class="bg-red-100 p-2 rounded-full mr-3">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Confirmation de suppression</h3>
        </div>
        <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce(tte) ${type.toLowerCase()} ? Cette action est définitive.</p>
        <div class="flex space-x-3 justify-end">
          <button id="cancel-delete" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
            Annuler
          </button>
          <button id="confirm-delete" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors shadow-sm">
            Supprimer
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    return new Promise((resolve) => {
      document.getElementById("cancel-delete").addEventListener("click", () => {
        document.body.removeChild(modalContainer);
        resolve(false);
      });

      document
        .getElementById("confirm-delete")
        .addEventListener("click", () => {
          document.body.removeChild(modalContainer);
          resolve(true);
        });
    });
  };

  // Remplacez votre fonction handleDelete par celle-ci
  const handleDelete = async (id, type) => {
    const confirmed = await confirmDelete(id, type);

    if (confirmed) {
      try {
        setLoading(true);
        await axios.delete(`/schedule/media/${id}`);
        showSuccess(`${type} supprimé avec succès`);

        // Si on est sur l'onglet d'upload et qu'on vient de supprimer le type qu'on avait sélectionné
        // on réinitialise le formulaire
        if (
          activeTab === "upload" &&
          ((selectedType === "logo" && type === "Logo") ||
            (selectedType === "banner" && type === "Bannière") ||
            (selectedType === "video" && type === "Vidéo"))
        ) {
          setSelectedFile(null);
          setPreview(null);
        }

        fetchAllMedia();
      } catch (err) {
        showError("Erreur lors de la suppression du média");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Afficher un média selon son type
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

  const getEmptyStateMessage = () => {
    if (activeMediaType === "all") {
      return "Aucun média disponible";
    }
    return `Aucun ${mediaTypeLabels[activeMediaType].toLowerCase()} disponible`;
  };

  // Ajoutez ou modifiez cette partie dans votre select de type de média (dans le form d'upload)

  // D'abord, ajoutez une fonction pour vérifier les médias existants
  const mediaExists = (type) => {
    return medias[type] && medias[type].length > 0;
  };

  // Ensuite, modifiez votre sélecteur de type de média:

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

        {/* Loader overlay */}
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-1 mr-2">
                    <svg
                      className="h-4 w-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Aperçu</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    document.getElementById("file-input").value = "";
                  }}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Annuler la sélection
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center border border-gray-200">
                {selectedType === "video" ? (
                  <video className="max-h-72 rounded shadow-md" controls>
                    <source src={preview} type={selectedFile.type} />
                  </video>
                ) : (
                  <motion.img
                    src={preview}
                    alt="Preview"
                    className="max-h-72 rounded shadow-md object-contain"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-400"
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
                {selectedFile &&
                  `${selectedFile.name} - ${(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Area */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg mb-6 backdrop-blur-sm"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg mb-6 backdrop-blur-sm"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content with glass morphism */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upload")}
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
              onClick={() => setActiveTab("gallery")}
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
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white"
                >
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Ajouter un média
                    </h2>
                  </div>

                  <form onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de média
                        </label>
                        <div className="relative">
                          <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-blue-300"
                          >
                            {/* Toujours afficher tous les types de médias */}
                            <option value="logo">Logo</option>
                            <option value="banner">Bannière</option>
                            <option value="video">Vidéo</option>
                            <option value="photo">
                              Photos ({medias.photo?.length || 0}/5)
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

                        {/* Message d'information si média existant - avec bouton de suppression restauré */}
                        {(selectedType === "logo" && mediaExists("logo")) ||
                        (selectedType === "banner" && mediaExists("banner")) ||
                        (selectedType === "video" && mediaExists("video")) ? (
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
                                  Remplacement de{" "}
                                  {selectedType === "logo"
                                    ? "logo"
                                    : selectedType === "banner"
                                    ? "bannière"
                                    : "vidéo"}
                                </h3>
                                <p className="text-xs text-amber-600 mt-1">
                                  Vous avez déjà un(e){" "}
                                  {selectedType === "logo"
                                    ? "logo"
                                    : selectedType === "banner"
                                    ? "bannière"
                                    : "vidéo"}{" "}
                                  actif(ve). Le téléchargement d'un nouveau
                                  fichier remplacera l'existant.
                                </p>
                                <div className="mt-2 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab("gallery")}
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
                                    onClick={() => {
                                      if (
                                        selectedType === "logo" &&
                                        medias.logo[0]
                                      ) {
                                        handleDelete(medias.logo[0].id, "Logo");
                                      } else if (
                                        selectedType === "banner" &&
                                        medias.banner[0]
                                      ) {
                                        handleDelete(
                                          medias.banner[0].id,
                                          "Bannière"
                                        );
                                      } else if (
                                        selectedType === "video" &&
                                        medias.video[0]
                                      ) {
                                        handleDelete(
                                          medias.video[0].id,
                                          "Vidéo"
                                        );
                                      }
                                    }}
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
                        ) : (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="text-sm font-medium text-blue-800 mb-1">
                              Recommandations
                            </h3>
                            <p className="text-xs text-blue-600">
                              {selectedType === "logo" &&
                                "Format: PNG ou SVG avec fond transparent. Taille recommandée: 200x80px"}
                              {selectedType === "banner" &&
                                "Format: JPG ou PNG haute résolution. Taille recommandée: 1920x480px"}
                              {selectedType === "video" &&
                                "Format: MP4, WebM. Durée maximale recommandée: 1 minute"}
                              {selectedType === "photo" &&
                                `Format: JPG ou PNG haute résolution. Aspect ratio de 16:9 recommandé. (${
                                  medias.photo?.length || 0
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
                          {...getRootProps()}
                          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                            isDragActive
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 border-dashed"
                          } rounded-lg hover:border-blue-400 transition-colors duration-200 cursor-pointer group`}
                        >
                          <div className="space-y-2 text-center">
                            <svg
                              className={`mx-auto h-12 w-12 ${
                                isDragActive ? "text-blue-500" : "text-gray-400"
                              } group-hover:text-blue-500 transition-colors duration-200`}
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
                                {isDragActive
                                  ? "Déposez le fichier ici"
                                  : "Glisser-déposer un fichier ici ou"}
                              </p>
                              <button
                                type="button"
                                onClick={open}
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors duration-200"
                              >
                                Parcourir les fichiers
                              </button>
                              <input
                                {...getInputProps()}
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

                    {/* Preview */}
                    <AnimatePresence>
                      {preview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="flex items-center mb-2">
                            <div className="bg-green-100 rounded-full p-1 mr-2">
                              <svg
                                className="h-4 w-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              Aperçu
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 flex justify-center border border-gray-200">
                            {selectedType === "video" ? (
                              <video
                                className="max-h-72 rounded shadow-md"
                                controls
                              >
                                <source
                                  src={preview}
                                  type={selectedFile.type}
                                />
                              </video>
                            ) : (
                              <motion.img
                                src={preview}
                                alt="Preview"
                                className="max-h-72 rounded shadow-md object-contain"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
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
                            {selectedFile &&
                              `${selectedFile.name} - ${(
                                selectedFile.size /
                                1024 /
                                1024
                              ).toFixed(2)} MB`}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !selectedFile}
                        className={`w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-lg transition-all duration-300 relative overflow-hidden
                          ${
                            loading || !selectedFile
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
                          }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Téléchargement...
                          </span>
                        ) : (
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
                        )}

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
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Gallery filters */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-white/80">
                    <div className="flex overflow-x-auto scrollbar-hide">
                      <button
                        onClick={() => setActiveMediaType("all")}
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
                            onClick={() => setActiveMediaType(type)}
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
                  <AnimatePresence mode="wait">
                    {activeMediaType === "all" ||
                    activeMediaType === "logo" ||
                    activeMediaType === "banner" ? (
                      <motion.div
                        key="logo-banner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {/* Logo */}
                        {(activeMediaType === "all" ||
                          activeMediaType === "logo") && (
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
                              {medias.logo.length > 0 && (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                  Actif
                                </span>
                              )}
                            </div>

                            <div className="bg-white/80 rounded-lg p-6 flex items-center justify-center min-h-[180px] border border-gray-100 shadow-inner">
                              {medias.logo.length > 0 ? (
                                <div className="flex flex-col items-center">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                    }}
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm"
                                  >
                                    {renderMedia(medias.logo[0])}
                                  </motion.div>
                                  <button
                                    onClick={() =>
                                      handleDelete(medias.logo[0].id, "Logo")
                                    }
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
                                    onClick={() => {
                                      setActiveTab("upload");
                                      setSelectedType("logo");
                                    }}
                                    className="mt-3 text-blue-500 text-sm hover:text-blue-700 hover:underline"
                                  >
                                    Ajouter un logo
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Bannière */}
                        {(activeMediaType === "all" ||
                          activeMediaType === "banner") && (
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
                              {medias.banner.length > 0 && (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                  Active
                                </span>
                              )}
                            </div>

                            <div className="bg-white/80 rounded-lg p-4 flex items-center justify-center min-h-[180px] border border-gray-100 shadow-inner">
                              {medias.banner.length === 0 ? (
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
                                    onClick={() => {
                                      setActiveTab("upload");
                                      setSelectedType("banner");
                                    }}
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
                                    {renderMedia(medias.banner[0])}
                                  </motion.div>
                                  <div className="flex justify-between items-center mt-4">
                                    <p className="text-xs text-gray-500">
                                      Ajouté le{" "}
                                      {new Date(
                                        medias.banner[0].createdAt || Date.now()
                                      ).toLocaleDateString()}
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          medias.banner[0].id,
                                          "Bannière"
                                        )
                                      }
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
                        )}
                      </motion.div>
                    ) : null}

                    {/* Vidéo */}
                    {(activeMediaType === "all" ||
                      activeMediaType === "video") && (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                          {medias.video.length > 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              Active
                            </span>
                          )}
                        </div>

                        <div className="bg-white/80 rounded-lg p-6 flex items-center justify-center border border-gray-100 shadow-inner">
                          {medias.video.length > 0 ? (
                            <div className="w-full max-w-3xl mx-auto">
                              <div className="rounded-lg overflow-hidden shadow-md">
                                {renderMedia(medias.video[0])}
                              </div>
                              <div className="flex justify-center mt-5">
                                <button
                                  onClick={() =>
                                    handleDelete(medias.video[0].id, "Vidéo")
                                  }
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
                            </div>
                          ) : (
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
                                onClick={() => {
                                  setActiveTab("upload");
                                  setSelectedType("video");
                                }}
                                className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                              >
                                Ajouter une vidéo
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Photos */}
                    {(activeMediaType === "all" ||
                      activeMediaType === "photo") && (
                      <motion.div
                        key="photos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                                medias.photo.length > 0
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {medias.photo.length}/5
                            </span>
                            {medias.photo.length < 5 && (
                              <button
                                onClick={() => {
                                  setActiveTab("upload");
                                  setSelectedType("photo");
                                }}
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
                          {medias.photo.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {medias.photo.map((photo) => (
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
                                      onClick={() =>
                                        handleDelete(photo.id, "Photo")
                                      }
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
                                onClick={() => {
                                  setActiveTab("upload");
                                  setSelectedType("photo");
                                }}
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                              >
                                Ajouter des photos
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Empty state */}
                    {Object.values(medias).every((arr) => arr.length === 0) &&
                      activeMediaType === "all" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white/70 backdrop-blur-sm rounded-xl p-10 shadow-md flex flex-col items-center justify-center text-center border border-gray-100"
                        >
                          <svg
                            className="w-20 h-20 text-gray-300 mb-4"
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
                          <h3 className="text-xl font-medium text-gray-700 mb-2">
                            Aucun média disponible
                          </h3>
                          <p className="text-gray-500 max-w-md mb-6">
                            Commencez par ajouter un logo, une bannière, des
                            photos ou une vidéo pour personnaliser votre espace.
                          </p>
                          <button
                            onClick={() => setActiveTab("upload")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                          >
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Ajouter votre premier média
                          </button>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
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

export default MediaManager;
