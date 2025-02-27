import React from 'react';
import { BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Filter, ChevronDown, Download } from 'lucide-react';
import StatCard from '../ui/StatCard';

const Analytics = () => {
  // Données pour le graphique à barres
  const barChartData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 85 },
    { month: 'Mar', value: 53 },
    { month: 'Apr', value: 90 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 58 },
    { month: 'Jul', value: 92 },
    { month: 'Aug', value: 80 },
  ];
  
  // Données pour la répartition des sources de trafic
  const trafficSources = [
    { name: 'Direct', percentage: 30, color: '#4f46e5' },
    { name: 'Social', percentage: 25, color: '#8b5cf6' },
    { name: 'Referral', percentage: 20, color: '#ec4899' },
    { name: 'Organic', percentage: 15, color: '#f97316' },
    { name: 'Email', percentage: 10, color: '#10b981' },
  ];
  
  // Données pour le tableau des pages populaires
  const popularPages = [
    { id: 1, page: '/accueil', views: 4872, unique: 3942, bounceRate: '32%', avgTime: '3:12' },
    { id: 2, page: '/produits', views: 3742, unique: 3214, bounceRate: '28%', avgTime: '2:57' },
    { id: 3, page: '/blog', views: 2918, unique: 2487, bounceRate: '45%', avgTime: '4:06' },
    { id: 4, page: '/contact', views: 1834, unique: 1612, bounceRate: '24%', avgTime: '1:35' },
    { id: 5, page: '/a-propos', views: 1253, unique: 1046, bounceRate: '38%', avgTime: '2:23' },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BarChart3 size={24} />} 
          title="Visiteurs Totaux" 
          value="15,483" 
          description="+12.5% depuis le dernier mois" 
          color="blue" 
        />
        <StatCard 
          icon={<PieChart size={24} />} 
          title="Taux de Conversion" 
          value="3.2%" 
          description="+0.5% depuis le dernier mois" 
          color="green" 
        />
        <StatCard 
          icon={<ArrowUpRight size={24} />} 
          title="Taux de Rebond" 
          value="42%" 
          description="-3% depuis le dernier mois" 
          color="yellow" 
        />
        <StatCard 
          icon={<ArrowDownRight size={24} />} 
          title="Durée Moyenne" 
          value="2:47" 
          description="+0:12 depuis le dernier mois" 
          color="purple" 
        />
      </div>
      
      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique à barres */}
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Visiteurs Mensuels</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                <Filter size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                <Download size={18} />
              </button>
            </div>
          </div>
          
          <div className="relative h-72">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Lignes horizontales de la grille */}
              {[0, 1, 2, 3, 4].map((line) => (
                <line 
                  key={`grid-h-${line}`}
                  x1="40" 
                  y1={50 * line} 
                  x2="400" 
                  y2={50 * line} 
                  stroke="#f0f0f0" 
                  strokeWidth="1"
                />
              ))}
              
              {/* Labels de l'axe Y */}
              {['0', '25', '50', '75', '100'].map((label, i) => (
                <text 
                  key={`y-label-${label}`}
                  x="30" 
                  y={200 - i * 50} 
                  fontSize="10" 
                  fill="#999"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {label}
                </text>
              ))}
              
              {/* Labels de l'axe X et barres */}
              {barChartData.map((item, i) => (
                <g key={`bar-${item.month}`}>
                  <text 
                    x={60 + i * 45} 
                    y="210" 
                    fontSize="10" 
                    fill="#999"
                    textAnchor="middle"
                  >
                    {item.month}
                  </text>
                  
                  <rect
                    x={50 + i * 45}
                    y={200 - (item.value / 100) * 200}
                    width="20"
                    height={(item.value / 100) * 200}
                    fill="#8b5cf6"
                    rx="2"
                  />
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <div>
              <span className="font-medium text-gray-700">15,483</span> visiteurs totaux
            </div>
            <div className="flex items-center text-green-600">
              <ArrowUpRight size={16} className="mr-1" />
              <span>12.5% depuis le dernier mois</span>
            </div>
          </div>
        </div>
        
        {/* Sources de trafic */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Sources de Trafic</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronDown size={20} />
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {trafficSources.map((source, index) => {
                  // Calculer les positions pour le graphique circulaire
                  let cumulativePercentage = trafficSources
                    .slice(0, index)
                    .reduce((sum, src) => sum + src.percentage, 0);
                  let startAngle = (cumulativePercentage / 100) * 2 * Math.PI;
                  let endAngle = ((cumulativePercentage + source.percentage) / 100) * 2 * Math.PI;
                  
                  // Coordonnées pour l'arc
                  let x1 = 50 + 40 * Math.sin(startAngle);
                  let y1 = 50 - 40 * Math.cos(startAngle);
                  let x2 = 50 + 40 * Math.sin(endAngle);
                  let y2 = 50 - 40 * Math.cos(endAngle);
                  
                  // Drapeau pour déterminer si l'arc est supérieur à 180 degrés
                  let largeArcFlag = source.percentage > 50 ? 1 : 0;
                  
                  return (
                    <path
                      key={`pie-${source.name}`}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={source.color}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            {trafficSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 inline-block rounded-full mr-2" 
                    style={{ backgroundColor: source.color }}
                  ></span>
                  <span>{source.name}</span>
                </div>
                <span className="font-medium">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tableau des pages populaires */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Pages les Plus Populaires</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="py-2 px-3 pr-8 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
              <Download size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Page</th>
                <th className="pb-3 font-medium text-right">Vues</th>
                <th className="pb-3 font-medium text-right">Visiteurs Uniques</th>
                <th className="pb-3 font-medium text-right">Taux de Rebond</th>
                <th className="pb-3 font-medium text-right">Temps Moyen</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {popularPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-indigo-600">{page.page}</td>
                  <td className="py-3 text-right">{page.views.toLocaleString()}</td>
                  <td className="py-3 text-right">{page.unique.toLocaleString()}</td>
                  <td className="py-3 text-right">{page.bounceRate}</td>
                  <td className="py-3 text-right">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-gray-500">
            Affichage de 1 à 5 sur 24 entrées
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Précédent</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;