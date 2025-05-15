import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  UserCircle,
  Camera,
  Loader,
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
import { getCookie } from "./ConfigurationDashboard/authUtils";

const TenantProfilePage = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // New state for tabs
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const tenantId = getCookie("tenantId");
  const subdomain = getCookie("subdomain");

  // Configuration d'axios
  const API_URL = "http://localhost:8888/auth";

  // Récupérer les informations du tenant au chargement
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/tenant/get/${tenantId}`);
        setTenant(response.data);
        setError(null);
      } catch (err) {
        setError(
          "Erreur lors du chargement des données: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenantData();
    } else {
      setError("Impossible de déterminer l'identifiant du tenant");
      setLoading(false);
    }
  }, [tenantId]);

  // Initialiser le formulaire avec les données du tenant
  useEffect(() => {
    if (tenant) {
      setFormData({
        firstName: tenant.firstName || "",
        lastName: tenant.lastName || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        businessName: tenant.businessName || "",
        address: tenant.address || "",
        city: tenant.city || "",
        zipcode: tenant.zipcode || "",
        country: tenant.country || "",
        password: "",
      });
    }
  }, [tenant]);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumettre le formulaire de mise à jour
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    // Validation de base
    if (!formData.email) {
      setError("L'email est obligatoire");
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setSaving(true);
    setError(null);

    // Préparer les données à envoyer
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    // Assurez-vous que le nom de l'entreprise n'est pas modifié
    dataToSend.businessName = tenant.businessName;

    try {
      const response = await axios.put(
        `${API_URL}/tenant/update/${tenantId}`,
        dataToSend
      );

      setTenant(response.data);
      setSuccess("Informations mises à jour avec succès!");
      setIsEditing(false);
    } catch (err) {
      setError(
        "Erreur lors de la mise à jour: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  // Déclencher le sélecteur de fichier
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Gérer la sélection d'une image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.match("image.*")) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    // Validation de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Envoyer l'image au serveur
  const handleUploadImage = async () => {
    if (!fileInputRef.current.files[0]) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);

    try {
      const response = await axios.post(
        `${API_URL}/tenant/upload-profile-image/${tenant.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTenant(response.data);
      setSuccess("Photo de profil mise à jour avec succès!");
      setImagePreview(null);
      fileInputRef.current.value = "";
    } catch (err) {
      setError(
        "Erreur lors de l'upload: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  // Annuler la modification
  const handleCancelUpload = () => {
    setImagePreview(null);
    setError(null);
    fileInputRef.current.value = "";
  };

  // Annuler la modification des informations
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: tenant.firstName || "",
      lastName: tenant.lastName || "",
      email: tenant.email || "",
      phone: tenant.phone || "",
      businessName: tenant.businessName || "",
      address: tenant.address || "",
      city: tenant.city || "",
      zipcode: tenant.zipcode || "",
      country: tenant.country || "",
      password: "",
    });
  };

  // Fonction pour envoyer la demande de réinitialisation de mot de passe par email
  const handleSendResetPasswordEmail = async () => {
    if (!tenant?.email) {
      setError("Aucune adresse email associée à ce compte");
      return;
    }

    setResetPasswordLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8888/auth/tenant/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: tenant.email }),
        }
      );

      if (response.ok) {
        setResetPasswordSent(true);
        setSuccess(
          "Un email de réinitialisation a été envoyé à votre adresse email."
        );
      } else {
        // Tenter de lire le message d'erreur JSON
        try {
          const data = await response.json();
          setError(
            data ||
              "Une erreur est survenue lors de l'envoi de l'email de réinitialisation"
          );
        } catch (e) {
          setError(
            "Une erreur est survenue lors de l'envoi de l'email de réinitialisation"
          );
        }
      }
    } catch (error) {
      setError("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation:",
        error
      );
    } finally {
      setResetPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">
          Chargement des paramètres...
        </p>
      </div>
    );
  }

  if (error && !tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {tenant?.profileImageUrl ? (
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

        {/* Notification de succès */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <div className="ml-auto">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => setSuccess(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setError(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings navigation and content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar navigation */}
          <div className="w-full md:w-64">
            <nav className="bg-white rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left py-3 px-4 flex items-center ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span>Profil</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("company")}
                    className={`w-full text-left py-3 px-4 flex items-center ${
                      activeTab === "company"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Building className="w-5 h-5 mr-3" />
                    <span>Entreprise</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-left py-3 px-4 flex items-center ${
                      activeTab === "security"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
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

          {/* Right content area */}
          <div className="flex-1">
            {/* Profile tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Photo de profil
                  </h2>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Image actuelle ou prévisualisation */}
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-center shadow-inner border border-gray-200">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Prévisualisation"
                            className="w-full h-full object-cover"
                          />
                        ) : tenant?.profileImageUrl ? (
                          <img
                            src={tenant.profileImageUrl}
                            alt={`${tenant.businessName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-24 h-24 text-gray-300" />
                        )}
                      </div>

                      <button
                        onClick={handleImageClick}
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
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {imagePreview ? (
                        <div className="flex flex-col space-y-3">
                          <p className="text-sm text-gray-600">
                            Cliquez sur "Enregistrer" pour appliquer la nouvelle
                            photo
                          </p>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={handleUploadImage}
                              disabled={uploading}
                              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {uploading ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin mr-2" />
                                  Enregistrement...
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Enregistrer
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCancelUpload}
                              disabled={uploading}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={handleImageClick}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                          >
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
                            {tenant.firstName || "Non spécifié"}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Nom
                          </h3>
                          <p className="text-base text-gray-900">
                            {tenant.lastName || "Non spécifié"}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Email
                          </h3>
                          <p className="text-base text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            {tenant.email || "Non spécifié"}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Téléphone
                          </h3>
                          <p className="text-base text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-blue-500" />
                            {tenant.phone || "Non spécifié"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier mes informations
                      </button>
                    </div>
                  ) : (
                    <form className="animate-fade-in">
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
                            value={formData.firstName}
                            onChange={handleInputChange}
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
                            value={formData.lastName}
                            onChange={handleInputChange}
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
                            value={formData.email}
                            onChange={handleInputChange}
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
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmitUpdate}
                          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          {saving ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Company tab */}
            {activeTab === "company" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Building className="mr-2 w-5 h-5 text-blue-600" />
                    Informations de l'entreprise
                  </h2>

                  {!isEditing ? (
                    <div>
                      <div className="bg-blue-50 p-5 mb-6 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          Votre domaine
                        </h3>
                        <div className="flex items-center">
                          <code className="text-base text-blue-900 bg-white px-3 py-1 rounded border border-blue-200">
                            {tenant.subdomain}.planifygo.com
                          </code>
                          <span className="ml-3 px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                            Actif
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-blue-700">
                          Pour modifier le sous-domaine, veuillez contacter
                          notre support.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Nom de l'entreprise
                          </h3>
                          <p className="text-base text-gray-900 font-medium">
                            {tenant.businessName || "Non spécifié"}
                          </p>
                          <p className="mt-2 text-xs text-blue-700">
                            Pour modifier le nom de l'entreprise, veuillez
                            contacter notre support.
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Adresse
                          </h3>
                          <p className="text-base text-gray-900 flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500 mt-1 flex-shrink-0" />
                            <span>
                              {tenant.address || "Non spécifié"}
                              {tenant.address && (
                                <>
                                  <br />
                                  {tenant.zipcode} {tenant.city}
                                  {tenant.country && <>, {tenant.country}</>}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier l'adresse de l'entreprise
                      </button>
                    </div>
                  ) : (
                    <form className="animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="businessName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nom de l'entreprise *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            id="businessName"
                            value={formData.businessName}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                          />
                          <p className="mt-1 text-xs text-amber-600 font-medium">
                            Pour modifier le nom de l'entreprise, merci de
                            contacter le support.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="subdomain"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Sous-domaine
                          </label>
                          <input
                            type="text"
                            name="subdomain"
                            id="subdomain"
                            value={tenant.subdomain}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                          />
                          <p className="mt-1 text-xs text-amber-600 font-medium">
                            Pour modifier le sous-domaine, merci de contacter le
                            support.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Adresse
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Ville
                          </label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Pays
                          </label>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="zipcode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Code postal
                          </label>
                          <input
                            type="text"
                            name="zipcode"
                            id="zipcode"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmitUpdate}
                          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          {saving ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Security tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Lock className="mr-2 w-5 h-5 text-blue-600" />
                    Sécurité du compte
                  </h2>

                  {/* Option 1: Réinitialiser par email (méthode recommandée) */}
                  <div className="max-w-md mb-8">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Mail className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Méthode recommandée : Réinitialisation par email
                          </p>
                        </div>
                      </div>
                    </div>

                    {!resetPasswordSent ? (
                      <div>
                        <p className="mb-4 text-sm text-gray-600">
                          Un lien de réinitialisation sera envoyé à votre
                          adresse email: <strong>{tenant?.email}</strong>
                        </p>
                        <button
                          onClick={handleSendResetPasswordEmail}
                          disabled={resetPasswordLoading}
                          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {resetPasswordLoading ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Envoyer un lien de réinitialisation
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              Email envoyé ! Veuillez vérifier votre boîte de
                              réception et suivre les instructions.
                            </p>
                            <button
                              onClick={() => setResetPasswordSent(false)}
                              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Renvoyer l'email
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 my-6 pt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      Sessions actives
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Settings className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Session actuelle
                            </p>
                            <p className="text-xs text-gray-500">
                              Dernière activité: Maintenant
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfilePage;