import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, X, UserPlus, RefreshCw, CheckCircle, XCircle, Phone, Mail, 
  Users, User, Search, AlertTriangle, Calendar, ChevronDown } from 'lucide-react';

function getCookie(name) {
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

const HR = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Démarrer avec loading=true
  const [error, setError] = useState(null);
  const [newEmp, setNewEmp] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    status: 'ACTIVE',
    imageUrl: 'https://via.placeholder.com/150'
  });
  const [editingEmp, setEditingEmp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  // Add these state variables at the top with your other state declarations
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Axios config & initial load ─────────────────────────────────
  useEffect(() => {
    const token = getCookie("accessToken");
    const tenant = getCookie("subdomain");

    axios.defaults.baseURL = "http://localhost:8888";
    axios.defaults.withCredentials = true;
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (tenant) axios.defaults.headers.common["X-Tenant-ID"] = tenant;

    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter and sort employees whenever dependencies change
    let results = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(emp => 
        emp.firstName?.toLowerCase().includes(term) || 
        emp.lastName?.toLowerCase().includes(term) || 
        emp.email?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'ALL') {
      results = results.filter(emp => emp.status === filterStatus);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle string comparison separately
      if (sortField === 'firstName' || sortField === 'lastName' || sortField === 'email') {
        fieldA = fieldA?.toLowerCase() || '';
        fieldB = fieldB?.toLowerCase() || '';
      }
        
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredEmployees(results);
  }, [employees, searchTerm, filterStatus, sortField, sortDirection]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/schedule/employee/getall');
      setEmployees(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les employés");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handlers ────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    if (editingEmp) {
      setEditingEmp(emp => ({ ...emp, [field]: value }));
    } else {
      setNewEmp(ne => ({ ...ne, [field]: value }));
    }
  };

  const startEdit = emp => {
    setEditingEmp({ ...emp });
    setNewEmp({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE' });
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      const element = document.getElementById('employeeForm');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const cancelEdit = () => {
    setEditingEmp(null);
    setNewEmp({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE' });
    if (!employees.length) setShowForm(true);
    else setShowForm(false);
  };

  const saveEmployee = async e => {
    e.preventDefault();
    if (isSubmitting) return; // Empêche double clic
    setIsSubmitting(true);
    try {
      if (editingEmp) {
        await axios.put(`/schedule/employee/update/${editingEmp.id}`, editingEmp);
        setEmployees(es => es.map(x => x.id === editingEmp.id ? editingEmp : x));
        cancelEdit();
      } else {
        // Créer l'employé avec l'URL par défaut d'abord
        const { data } = await axios.post(`/schedule/employee/create`, newEmp);

        // Si une image est sélectionnée, l'uploader après création
        if (selectedImage) {
          const formData = new FormData();
          formData.append('image', selectedImage);

          const uploadResponse = await axios.post(`/schedule/employee/upload-image/${data.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          setEmployees(es => [...es.filter(e => e.id !== data.id), uploadResponse.data]);
        } else {
          setEmployees(es => [...es, data]);
        }

        setNewEmp({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE', imageUrl: 'https://via.placeholder.com/150' });
        setSelectedImage(null);
        setImagePreview(null);
        if (employees.length) setShowForm(false);
      }
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l'enregistrement");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteEmployee = (id) => {
    setShowConfirmDelete(id);
  };

  const deleteEmployee = async id => {
    try {
      await axios.delete(`/schedule/employee/delete/${id}`);
      setEmployees(es => es.filter(x => x.id !== id));
      setShowConfirmDelete(null);
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la suppression");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSort = (field) => {
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  // Generate a consistent random color based on employee ID
  const getAvatarColor = (id) => {
    const colors = [
      'from-pink-400 to-purple-500',
      'from-cyan-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-teal-400 to-emerald-500',
      'from-fuchsia-400 to-purple-500',
      'from-amber-400 to-red-500'
    ];
    
    // Generate a simple hash of the ID to pick a consistent color
    const idStr = String(id || '');
    const hash = idStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Add this function with your other handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError("Veuillez sélectionner une image valide");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }
    
    setSelectedImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Add these functions with your other handlers
  const uploadEmployeeImage = async (employeeId) => {
    if (!selectedImage) return;
    
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await axios.post(`/schedule/employee/upload-image/${employeeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update employees list with new data
      setEmployees(emps => emps.map(emp => 
        emp.id === employeeId ? response.data : emp
      ));
      
      // Reset image state
      setSelectedImage(null);
      setImagePreview(null);
      
      setError(null);
      // Show success message
      alert("Image téléchargée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeEmployeeImage = async (employeeId) => {
    try {
      setUploadingImage(true);
      
      const response = await axios.delete(`/schedule/employee/remove-image/${employeeId}`);
      
      // Update employees list with new data
      setEmployees(emps => emps.map(emp => 
        emp.id === employeeId ? response.data : emp
      ));
      
      setError(null);
      alert("Image supprimée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-indigo-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la gestion des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  <span className="font-medium">{employees.length} employés</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-white flex items-center">
                  <User size={18} className="mr-2" />
                  <span className="font-medium">{employees.filter(e => e.status === 'ACTIVE').length} disponible</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Panel */}
          <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <select 
                className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ACTIVE">Disponible</option>
                <option value="INACTIVE">Indisponible</option>
              </select>
              
              <button
                onClick={() => { setShowForm(prev => !prev); setEditingEmp(null); }}
                className={`px-4 py-2 rounded-xl font-medium text-white flex items-center transition-colors ${
                  showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                }`}
              >
                {showForm ? (
                  <>
                    <X size={18} className="mr-2" /> Annuler
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" /> Nouvel employé
                  </>
                )}
              </button>
              
              <button 
                onClick={fetchEmployees}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                title="Rafraîchir les données"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-white border-l-4 border-red-500 p-4 mb-6 rounded-xl shadow animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div id="employeeForm" className={`mb-6 transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className={`p-8 rounded-2xl shadow-lg ${editingEmp ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              {editingEmp ? 
                <Pencil size={20} className="mr-2 text-amber-600" /> : 
                <UserPlus size={20} className="mr-2 text-indigo-600" />
              }
              {editingEmp ? `Modifier ${editingEmp.firstName} ${editingEmp.lastName}` : 'Ajouter un nouvel employé'}
            </h3>
            
            <form onSubmit={saveEmployee} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={editingEmp?.firstName ?? newEmp.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={editingEmp?.lastName ?? newEmp.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail size={14} className="mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={editingEmp?.email ?? newEmp.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone size={14} className="mr-1" /> Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={editingEmp?.phone ?? newEmp.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <div className="mt-1 flex items-center space-x-5">
                  <div className="flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover border border-gray-300"
                      />
                    ) : editingEmp?.imageUrl ? (
                      <img
                        src={editingEmp.imageUrl}
                        alt={`${editingEmp.firstName} ${editingEmp.lastName}`}
                        className="h-24 w-24 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${editingEmp ? getAvatarColor(editingEmp.id) : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white`}>
                        <span className="font-bold text-xl">
                          {editingEmp 
                            ? getInitials(editingEmp.firstName, editingEmp.lastName) 
                            : getInitials(newEmp.firstName, newEmp.lastName) || 'NN'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="relative cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                      <span>Changer de photo</span>
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                    
                    {(imagePreview || editingEmp?.imageUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (editingEmp?.imageUrl && !imagePreview) {
                            if (confirm('Voulez-vous supprimer cette image ?')) {
                              removeEmployeeImage(editingEmp.id);
                            }
                          } else {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }
                        }}
                        className="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        Supprimer la photo
                      </button>
                    )}
                    
                    {selectedImage && editingEmp && (
                      <button
                        type="button"
                        onClick={() => uploadEmployeeImage(editingEmp.id)}
                        disabled={uploadingImage}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                      >
                        {uploadingImage ? 'Téléchargement...' : 'Télécharger'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`cursor-pointer border rounded-xl p-4 flex items-center ${
                      (editingEmp?.status ?? newEmp.status) === 'ACTIVE' 
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleChange('status', 'ACTIVE')}
                  >
                    <CheckCircle 
                      size={24} 
                      className={`mr-3 ${(editingEmp?.status ?? newEmp.status) === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}`} 
                    />
                    <div>
                      <p className="font-medium">Disponible</p>
                      <p className="text-xs text-gray-500">L'employé est en activité</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`cursor-pointer border rounded-xl p-4 flex items-center ${
                      (editingEmp?.status ?? newEmp.status) === 'INACTIVE' 
                        ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-500' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleChange('status', 'INACTIVE')}
                  >
                    <XCircle 
                      size={24} 
                      className={`mr-3 ${(editingEmp?.status ?? newEmp.status) === 'INACTIVE' ? 'text-gray-500' : 'text-gray-400'}`} 
                    />
                    <div>
                      <p className="font-medium">Indisponible</p>
                      <p className="text-xs text-gray-500">L'employé est en pause</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                {editingEmp && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                  >
                    <X className="mr-2" size={18} /> Annuler
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-medium text-white flex items-center transition-colors ${
                    editingEmp
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {editingEmp ? (
                    <>
                      <CheckCircle className="mr-2" size={18} /> Mettre à jour
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2" size={18} /> {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Users size={20} className="mr-2 text-indigo-600" />
              Liste des employés 
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {filteredEmployees.length} / {employees.length}
              </span>
            </h3>
          </div>
          
          {employees.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-indigo-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <UserPlus size={32} className="text-indigo-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun employé trouvé</h3>
              <p className="text-gray-500 mb-6">Ajoutez votre premier employé pour commencer</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-colors"
              >
                <UserPlus className="mr-2 inline-block" size={18} /> Ajouter un employé
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-amber-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <Search size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-500">Essayez avec d'autres termes de recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lastName')}
                    >
                      <div className="flex items-center">
                        Employé
                        {sortField === 'lastName' && (
                          <ChevronDown size={16} className={`ml-1 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Contact
                        {sortField === 'email' && (
                          <ChevronDown size={16} className={`ml-1 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Statut
                        {sortField === 'status' && (
                          <ChevronDown size={16} className={`ml-1 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr 
                      key={emp.id} 
                      className={`group hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
                            <div className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {emp.firstName} {emp.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center mb-1 text-sm">
                            <Mail size={14} className="mr-2 text-indigo-400" /> 
                            <a href={`mailto:${emp.email}`} className="text-gray-700 hover:text-indigo-600 transition-colors">
                              {emp.email}
                            </a>
                          </span>
                          {emp.phone && (
                            <span className="flex items-center text-sm">
                              <Phone size={14} className="mr-2 text-green-400" /> 
                              <a href={`tel:${emp.phone}`} className="text-gray-700 hover:text-green-600 transition-colors">
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
                          onClick={() => startEdit(emp)}
                          className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Modifier"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteEmployee(emp.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
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
          )}
          
          {/* Footer with additional information */}
          {employees.length > 0 && (
            <div className="border-t border-gray-200 p-4 text-sm text-gray-500 flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-indigo-400" /> 
                  <span>Dernière mise à jour: {new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="hidden md:flex items-center">
                  <CheckCircle size={14} className="mr-1 text-green-500" /> 
                  <span>{employees.filter(e => e.status === 'ACTIVE').length} disponible</span>
                </div>
                
                <div className="hidden md:flex items-center">
                  <XCircle size={14} className="mr-1 text-gray-500" /> 
                  <span>{employees.filter(e => e.status === 'INACTIVE').length} indisponible</span>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={() => document.body.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center"
                >
                  Retour en haut
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation dialogs */}
      {showConfirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
              <AlertTriangle size={20} className="mr-2" />
              Confirmer la suppression
            </h3>
            <p className="mb-6">
              {(() => {
                const emp = employees.find(e => e.id === showConfirmDelete);
                return `Êtes-vous sûr de vouloir supprimer ${emp?.firstName || ''} ${emp?.lastName || ''} ? Cette action est irréversible.`;
              })()}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteEmployee(showConfirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating action button (mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => { setShowForm(prev => !prev); setEditingEmp(null); }}
          className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all ${
            showForm 
              ? 'bg-gray-600 rotate-45'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 pulsingButton'
          }`}
        >
          {showForm ? <X size={24} /> : <UserPlus size={24} />}
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

export default HR;