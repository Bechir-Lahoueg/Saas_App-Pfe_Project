import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration d'axios avec l'URL de base
axios.defaults.baseURL = 'http://localhost:8888';

const GestionCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // États pour le formulaire
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Charger les catégories au chargement du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Récupérer toutes les catégories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/auth/category/getall');
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.log('Réponse non attendue:', response.data);
        setCategories([]);
        setError("Format de données incorrect");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setCategories([]);
      setError("Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  };

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Créer un FormData pour envoyer les données multipart
      const formData = new FormData();
      const categoryData = JSON.stringify({
        categoryName,
        description
      });
      formData.append("category", new Blob([categoryData], { type: 'application/json' }));
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Configuration pour la requête multipart
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditing) {
        // Mise à jour d'une catégorie existante
        await axios.put(`/auth/category/update/${editId}`, formData, config);
        setSuccessMessage('Catégorie modifiée avec succès');
      } else {
        // Création d'une nouvelle catégorie
        await axios.post('/auth/category/create', formData, config);
        setSuccessMessage('Catégorie ajoutée avec succès');
      }

      // Réinitialiser le formulaire
      resetForm();
      
      // Actualiser la liste
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de l'opération:", err);
      setError(isEditing ? "Erreur lors de la modification de la catégorie" : "Erreur lors de la création de la catégorie");
    }
  };

  // Préparer la modification d'une catégorie
  const handleEdit = (category) => {
    setCategoryName(category.categoryName);
    setDescription(category.description);
    setEditId(category.id);
    setIsEditing(true);
    
    // Réinitialiser l'image sélectionnée mais définir l'aperçu si une image existe
    setSelectedImage(null);
    setImagePreview(category.imageUrl || null);
    
    // Scroll vers le formulaire
    document.querySelector('.category-form').scrollIntoView({ behavior: 'smooth' });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  // Préparer la suppression d'une catégorie
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  // Supprimer une catégorie
  const deleteCategory = async () => {
    try {
      await axios.delete(`/auth/category/delete/${categoryToDelete.id}`);
      setShowDeleteConfirm(false);
      setSuccessMessage('Catégorie supprimée avec succès');
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de la catégorie");
    }
  };

  // Masquer les messages après un délai
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Gestion des catégories</h1>

      {/* Messages de notification */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow mb-6 flex justify-between items-center"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
        
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow mb-6 flex justify-between items-center"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire d'ajout/modification */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="category-form bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className={`${isEditing ? 'bg-yellow-50' : 'bg-blue-50'} px-6 py-4 border-b`}>
              <h2 className={`text-xl font-semibold ${isEditing ? 'text-yellow-700' : 'text-blue-700'}`}>
                {isEditing ? "Modifier une catégorie" : "Ajouter une catégorie"}
              </h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nom de la catégorie"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="3"
                    placeholder="Description de la catégorie"
                    required
                  ></textarea>
                </div>

                {/* Champ d'upload d'image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col rounded-lg border-2 border-dashed w-full h-32 p-2 group text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                        {!imagePreview ? (
                          <>
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm mt-1">Cliquez ou glissez une image ici</p>
                          </>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img
                              src={imagePreview}
                              alt="Prévisualisation"
                              className="h-full max-w-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className={`flex-1 ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center justify-center`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isEditing ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      )}
                    </svg>
                    {isEditing ? "Modifier" : "Ajouter"}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 shadow-sm flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Liste des catégories */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-indigo-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-indigo-700">Liste des catégories</h2>
                <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                  {categories.length} {categories.length > 1 ? 'catégories' : 'catégorie'}
                </span>
              </div>
            </div>

            <div className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <motion.tr 
                          key={category.id || Math.random()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {category.imageUrl ? (
                              <img 
                                src={category.imageUrl} 
                                alt={category.categoryName}
                                className="h-16 w-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                              />
                            ) : (
                              <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                            <div className="text-xs text-gray-500">ID: {category.id}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="text-sm text-gray-900 line-clamp-2">{category.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                              </button>
                              <button
                                onClick={() => confirmDelete(category)}
                                className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune catégorie disponible</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par ajouter une nouvelle catégorie.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10 overflow-hidden"
            >
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h3 className="text-xl font-bold text-red-700">Confirmer la suppression</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold">"{categoryToDelete?.categoryName}"</span> ?
                  </p>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  Cette action est irréversible et supprimera définitivement la catégorie et ses données associées.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={deleteCategory}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionCategories;