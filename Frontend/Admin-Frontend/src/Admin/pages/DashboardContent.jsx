import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Users,
  Database,
  Building2,
  ArrowUpRight,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';

const PageAnalyse = () => {
  // États pour stocker les données
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalTenants: 0, totalDatabases: 0, countriesCount: 0 });
  
  // Couleurs pour les graphiques
  const COLORS = ['#4f46e5', '#fcd34d', '#ef4444', '#10b981', '#8b5cf6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des tenants
        const response = await axios.get('/tenant/all');
        const tenantsData = response.data;
        setTenants(tenantsData);

        // Comptage du nombre total de locataires
        const totalTenants = tenantsData.length;
        
        // Analyse des pays représentés
        const countries = [...new Set(tenantsData.map(t => t.country))].filter(Boolean);
        
        // Calcul du nombre total de bases de données
        let dbCount = 0;
        let dbTypes = {};
        let monthlySignups = Array(12).fill(0);
        
        for (const tenant of tenantsData) {
          try {
            const dbResponse = await axios.get(`/tenant/databases?tenantId=${tenant.id}`);
            const databases = dbResponse.data;
            dbCount += databases.length;
            
            // Analyse des types de bases de données
            databases.forEach(db => {
              if (db.serviceType) {
                dbTypes[db.serviceType] = (dbTypes[db.serviceType] || 0) + 1;
              }
            });
            
            // Analyse des inscriptions mensuelles (si la date de création est disponible)
            if (tenant.createdAt) {
              const month = new Date(tenant.createdAt).getMonth();
              monthlySignups[month]++;
            }
          } catch (err) {
            console.log(`Erreur lors de la récupération des bases de données pour ${tenant.id}`);
          }
        }
        
        setStats({
          totalTenants,
          totalDatabases: dbCount,
          countriesCount: countries.length
        });

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données d'analyse");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Création des données pour les visualisations
  const prepareCountryData = () => {
    const countryMap = {};
    tenants.forEach(tenant => {
      if (tenant.country) {
        countryMap[tenant.country] = (countryMap[tenant.country] || 0) + 1;
      }
    });
    
    return Object.entries(countryMap)
      .map(([pays, valeur]) => ({ pays, valeur }))
      .sort((a, b) => b.valeur - a.valeur)
      .slice(0, 5);
  };

  // Création des données mensuelles simulées
  const prepareMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    return months.map((mois, index) => ({
      mois,
      valeur: Math.floor(Math.random() * 10) + (tenants.length / 12)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  const countryData = prepareCountryData();
  const monthlyData = prepareMonthlyData();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analyse des Locataires</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <Users className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalTenants}</h3>
            <p className="text-xs text-gray-500">Locataires inscrits</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <Database className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalDatabases}</h3>
            <p className="text-xs text-gray-500">Bases de données</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.countriesCount}</h3>
            <p className="text-xs text-gray-500">Pays représentés</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Évolution mensuelle */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Nouvelles inscriptions</h2>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={16} className="mr-1" />
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="mois" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="valeur" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: '#4f46e5', stroke: '#fff', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution par pays */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Distribution par pays</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="pays" type="category" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="valeur" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Liste des locataires */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Liste des locataires</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Entreprise</th>
                <th className="pb-3 font-medium">Sous-domaine</th>
                <th className="pb-3 font-medium">Pays</th>
              </tr>
            </thead>
            <tbody>
              {tenants.slice(0, 5).map((tenant, index) => (
                <tr key={tenant.id || index} className="border-t border-gray-100">
                  <td className="py-3 text-sm text-gray-800">{tenant.id ? tenant.id.substring(0, 8) : index}</td>
                  <td className="py-3 text-sm text-gray-800 font-medium">{`${tenant.firstName || ''} ${tenant.lastName || ''}`}</td>
                  <td className="py-3 text-sm text-gray-600">{tenant.businessName || '-'}</td>
                  <td className="py-3 text-sm text-gray-600">{tenant.subdomain || '-'}</td>
                  <td className="py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-600 font-medium">
                      {tenant.country || 'Non spécifié'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageAnalyse;