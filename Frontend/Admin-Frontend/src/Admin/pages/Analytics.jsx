import React from 'react';
import { BarChart, PieChart, ArrowUpRight, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    { id: 1, title: 'Utilisateurs', value: '2,845', change: '+12.5%', icon: <Users size={24} className="text-blue-600" /> },
    { id: 2, title: 'Ventes', value: '1,257', change: '+8.3%', icon: <ShoppingCart size={24} className="text-green-600" /> },
    { id: 3, title: 'Revenus', value: '24,500€', change: '+15.2%', icon: <DollarSign size={24} className="text-purple-600" /> }
  ];

  const performanceData = [
    { produit: 'Produit A', ventes: 486, revenus: 12500 },
    { produit: 'Produit B', ventes: 352, revenus: 8750 },
    { produit: 'Produit C', ventes: 219, revenus: 5475 },
    { produit: 'Produit D', ventes: 184, revenus: 4600 }
  ];

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tableau de bord analytique</h2>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
              </div>
              {metric.icon}
            </div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-green-600 font-medium flex items-center">
                {metric.change}
                <ArrowUpRight size={16} className="ml-1" />
              </span>
              <span className="text-gray-500 ml-2">vs mois précédent</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance des produits */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <BarChart className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-lg font-medium text-gray-800">Performance des produits</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="pb-2 font-medium">Produit</th>
                  <th className="pb-2 font-medium">Ventes</th>
                  <th className="pb-2 font-medium">Revenus</th>
                  <th className="pb-2 font-medium">Tendance</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm font-medium text-gray-800">{item.produit}</td>
                    <td className="py-3 text-sm text-gray-600">{item.ventes}</td>
                    <td className="py-3 text-sm text-gray-600">{item.revenus}€</td>
                    <td className="py-3">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${(item.ventes / 500) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Répartition des sources */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <PieChart className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-lg font-medium text-gray-800">Sources de trafic</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Recherche organique</span>
                <span className="text-sm text-gray-600">42%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Réseaux sociaux</span>
                <span className="text-sm text-gray-600">28%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Trafic direct</span>
                <span className="text-sm text-gray-600">18%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Campagnes email</span>
                <span className="text-sm text-gray-600">12%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;