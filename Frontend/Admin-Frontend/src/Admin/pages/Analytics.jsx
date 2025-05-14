import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Grid, Calendar, Users, Award, Search, Loader, AlertTriangle, 
  TrendingUp, Filter, RefreshCw, ChevronRight, ExternalLink, Check, X, Info
} from 'lucide-react';

export default function Analytics() {
  const [categories, setCategories] = useState([]);
  const [categoryRanking, setCategoryRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' ou 'detail'

  // Colors for charts - Palette cohérente
  const COLORS = ['#4F46E5', '#7C3AED', '#DB2777', '#EA580C', '#FBBF24', '#10B981', '#06B6D4', '#6366F1'];
  const GRADIENTS = [
    ['#4F46E5', '#818CF8'], // Indigo
    ['#7C3AED', '#A78BFA'], // Violet
    ['#DB2777', '#F472B6'], // Rose
    ['#EA580C', '#FB923C'], // Orange
    ['#FBBF24', '#FDE68A'], // Amber
    ['#10B981', '#6EE7B7'], // Emerald
    ['#06B6D4', '#67E8F9'], // Cyan
    ['#6366F1', '#A5B4FC']  // Indigo clair
  ];
  
  useEffect(() => {
    // Get auth token from cookies or localStorage
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:8888';
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch data
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rankingResponse, categoriesResponse] = await Promise.all([
        axios.get('/auth/category/ranking'),
        axios.get('/auth/category/getall')
      ]);
      
      setCategoryRanking(rankingResponse.data);
      setCategories(categoriesResponse.data);
      
      // Set first category as selected by default if available
      if (categoriesResponse.data.length > 0) {
        setSelectedCategory(categoriesResponse.data[0]);
      }
      
      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Impossible de charger les données des catégories. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total tenants across all categories
  const totalTenants = categories.reduce((sum, cat) => sum + (cat.tenants?.length || 0), 0);
  
  // Calculate average tenants per category
  const avgTenantsPerCategory = totalTenants / (categories.length || 1);
  
  // Find category with most tenants
  const mostPopularCategory = categories.length > 0 
    ? categories.reduce((prev, current) => 
        (prev.tenants?.length > current.tenants?.length) ? prev : current)
    : null;
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(cat => 
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Growth data for illustration - à remplacer par des données réelles si disponibles
  const growthData = [
    { name: 'Jan', value: 20 },
    { name: 'Fév', value: 35 },
    { name: 'Mar', value: 30 },
    { name: 'Avr', value: 45 },
    { name: 'Mai', value: 55 },
    { name: 'Juin', value: 50 },
  ];

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setViewMode('detail');
  };

  // Return to dashboard from detail view
  const backToDashboard = () => {
    setViewMode('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="relative h-20 w-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          </div>
          <p className="text-2xl font-medium text-indigo-900 mb-2">Chargement</p>
          <p className="text-gray-500">Récupération et analyse des données des catégories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-xl border border-red-100">
          <div className="bg-red-100 p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchData} 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 shadow-md transition-all transform hover:-translate-y-1 flex items-center mx-auto"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg animate-slide-in flex items-center">
          <div className="bg-green-100 p-1 rounded-full mr-3">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-green-800">Données chargées avec succès</p>
          <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-green-500 hover:text-green-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page header with gradient text */}
      <div className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analyse des Catégories
        </h1>
        <p className="text-gray-600">
          Visualisation et analyse des données de catégories et leurs locataires
        </p>
      </div>

      {viewMode === 'dashboard' ? (
        // DASHBOARD VIEW
        <>
          {/* Action bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Rechercher une catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">Filtrer</span>
                </button>
                
                <button 
                  onClick={fetchData}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap flex-grow sm:flex-grow-0"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-b-4 border-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total des catégories</p>
                  <h3 className="text-3xl font-bold text-gray-900">{categories.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-indigo-100">
                  <Grid className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div className="h-1 bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-b-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total des locataires</p>
                  <h3 className="text-3xl font-bold text-gray-900">{totalTenants}</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{Math.round(Math.random() * 15)}% ce mois
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div className="h-1 bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-b-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Moyenne locataires/catégorie</p>
                  <h3 className="text-3xl font-bold text-gray-900">{avgTenantsPerCategory.toFixed(1)}</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index < Math.round(avgTenantsPerCategory) ? 'bg-green-500' : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-b-4 border-rose-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Catégorie populaire</p>
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {mostPopularCategory?.categoryName || "N/A"}
                  </h3>
                  {mostPopularCategory && (
                    <p className="text-sm text-gray-500 mt-1">
                      {mostPopularCategory.tenants?.length || 0} locataires
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-rose-100">
                  <Award className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div className="h-1 bg-rose-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto">
            {/* Left column - Charts */}
            <div className="lg:col-span-2">
              {/* Category ranking chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Nombre de locataires par catégorie
                  </h2>
                  <div className="text-sm text-gray-500">
                    Mise à jour: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryRanking}
                      margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                    >
                      <defs>
                        {GRADIENTS.map((gradient, index) => (
                          <linearGradient 
                            key={`gradient-${index}`} 
                            id={`colorBar${index}`} 
                            x1="0" y1="0" x2="0" y2="1"
                          >
                            <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.8}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="categoryName" 
                        angle={-45} 
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#4B5563', fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: '#4B5563' }}
                        label={{ 
                          value: 'Nombre de locataires', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: '#4B5563' }
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} locataires`, ""]}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '10px'
                        }}
                      />
                      <Bar 
                        dataKey="tenantCount" 
                        name="Locataires" 
                        radius={[4, 4, 0, 0]}
                      >
                        {categoryRanking.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#colorBar${index % GRADIENTS.length})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category distribution pie chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Distribution des locataires
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryRanking}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={30}
                          fill="#8884d8"
                          dataKey="tenantCount"
                          nameKey="categoryName"
                          label={({ percent }) => 
                            percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                          }
                        >
                          {categoryRanking.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => {
                            return [
                              `${value} locataires`, 
                              props.payload.categoryName
                            ];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {categoryRanking.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-center text-xs">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-gray-800 truncate">{item.categoryName}</span>
                        </li>
                      ))}
                    </ul>
                    {categoryRanking.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">+ {categoryRanking.length - 4} autres catégories</p>
                    )}
                  </div>
                </div>

                {/* Growth trend chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Évolution des inscriptions
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#4B5563', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#4B5563' }} />
                        <Tooltip 
                          formatter={(value) => [`${value} locataires`, "Inscriptions"]}
                          contentStyle={{ 
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '10px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4F46E5" 
                          fillOpacity={1} 
                          fill="url(#colorGrowth)" 
                          name="Locataires"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Category list */}
            <div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Liste des catégories
                  </h2>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {filteredCategories.length}
                  </span>
                </div>
                
                {filteredCategories.length > 0 ? (
                  <div className="max-h-[600px] overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                      {filteredCategories.map((category) => (
                        <li 
                          key={category.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="p-4 flex items-center space-x-4">
                            {category.imageUrl ? (
                              <img 
                                src={category.imageUrl} 
                                alt={category.categoryName} 
                                className="h-14 w-14 rounded-lg object-cover shadow-sm"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Grid className="h-7 w-7" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 mb-1">
                                {category.categoryName}
                              </p>
                              <div className="flex items-center">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Users className="h-3.5 w-3.5 mr-1" />
                                  <span>{category.tenants?.length || 0} locataires</span>
                                </div>
                              </div>
                              {category.description && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-gray-100 p-4 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">Aucune catégorie trouvée</p>
                    <p className="text-gray-500 text-sm mb-4">Essayez d'autres termes de recherche</p>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium"
                    >
                      Effacer la recherche
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        // DETAIL VIEW
        <>
          {selectedCategory && (
            <div className="max-w-7xl mx-auto mb-8">
              <div className="mb-6">
                <button 
                  onClick={backToDashboard}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour au tableau de bord
                </button>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-blue-500">
                    {selectedCategory.imageUrl && (
                      <img 
                        src={selectedCategory.imageUrl}
                        alt={selectedCategory.categoryName}
                        className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl font-bold text-white drop-shadow-sm mb-1">
                        {selectedCategory.categoryName}
                      </h2>
                      <div className="flex items-center">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                          {selectedCategory.tenants?.length || 0} locataires
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {selectedCategory.description && (
                      <div className="mb-8 bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2 text-indigo-500" />
                          Description
                        </h3>
                        <p className="text-gray-800">{selectedCategory.description}</p>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-600" />
                      Locataires de cette catégorie
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {selectedCategory.tenants?.length || 0}
                      </span>
                    </h3>
                    
                    {selectedCategory.tenants?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCategory.tenants.map((tenant) => (
                          <div 
                            key={tenant.id} 
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="p-4">
                              <div className="flex items-center space-x-4">
                                {tenant.profileImageUrl ? (
                                  <img 
                                    src={tenant.profileImageUrl} 
                                    alt={`${tenant.firstName} ${tenant.lastName}`}
                                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
                                  />
                                ) : (
                                  <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold">
                                    {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center mb-1">
                                    <h4 className="text-lg font-medium text-gray-900 truncate">
                                      {tenant.firstName} {tenant.lastName}
                                    </h4>
                                    {tenant.enabled && (
                                      <span className="ml-2 inline-flex items-center justify-center w-3 h-3 bg-green-500 rounded-full"></span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-2 truncate">
                                    {tenant.email}
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-2 items-center">
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                                      {tenant.businessName || "Sans Entreprise"}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-md">
                                      {tenant.subdomain}.planifygo.com
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                                <div className="text-xs text-gray-500">
                                  <p>{tenant.city}, {tenant.country}</p>
                                  <p>{tenant.phone}</p>
                                </div>
                                
                                <a 
                                  href={`http://${tenant.subdomain}.127.0.0.1.nip.io:5173/reservation`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors text-sm"
                                >
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  Visiter
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
                        <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-medium mb-2">Aucun locataire dans cette catégorie</p>
                        <p className="text-gray-500 text-sm mb-4">Cette catégorie n'a pas encore de locataires enregistrés.</p>
                        <button 
                          onClick={backToDashboard}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Revenir au tableau de bord
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Style definitions */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}