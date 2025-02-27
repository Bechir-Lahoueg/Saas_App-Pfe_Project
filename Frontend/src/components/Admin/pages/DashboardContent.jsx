import React from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardContent = ({ sidebarExpanded }) => {
  // Données fictives pour le graphique linéaire
  const lineData = [
    { name: '10am', value: 30 },
    { name: '11am', value: 20 },
    { name: '12pm', value: 40 },
    { name: '01pm', value: 28 },
    { name: '02pm', value: 48 },
    { name: '03pm', value: 35 },
    { name: '04pm', value: 45 },
    { name: '05pm', value: 55 },
    { name: '06pm', value: 48 },
    { name: '07pm', value: 55 },
  ];

  // Données pour le graphique circulaire
  const pieData = [
    { name: 'Verifier', value: 80 },
    { name: 'Non Verifier', value: 20 },
  ];
  const COLORS = ['#3b82f6', '#fcd34d'];

  // Données pour la liste des abonnés récents
  const subscribers = [
    { id: 826, name: 'Hossain Kaff', address: '999 Keith Street Apt, #48', date: '14 Feb 2023', status: 'Verifier' },
    { id: 605, name: 'Sami abd', address: '999 Keith Street Apt, #48', date: '14 Feb 2023', status: 'Verifier' },
    { id: 907, name: 'Argen yesn', address: '999 Keith Street Apt, #48', date: '14 Feb 2023', status: 'Verifier' },
    { id: 608, name: 'Sofaware Jad', address: '999 Keith Street Apt, #48', date: '14 Feb 2023', status: 'Verifier' },
  ];

  // Données pour les tâches à faire
  const tasks = [
    { label: 'Verifier et AA', priority: 'high' },
    { label: 'Longue lecture', priority: 'medium' },
    { label: 'Reseaux Sikh', priority: 'low' },
  ];

  // Gestion de la marge en fonction de l'état du sidebar
  const sidebarWidth = sidebarExpanded ? 'md:ml-72' : 'md:ml-20';

  return (
    <div className={`flex-1 p-6 bg-gray-50 overflow-auto ${sidebarWidth} transition-all duration-300 ease-in-out`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <div className="text-blue-500">
              <i className="lucide user"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">1871+</h3>
            <p className="text-xs text-gray-500">Utilisateur inscrit dans la plateforme</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <div className="text-yellow-500">
              <i className="lucide chevrons-right"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">20+</h3>
            <p className="text-xs text-gray-500">Adhérent</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <div className="text-red-500">
              <i className="lucide building"></i>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">19+</h3>
            <p className="text-xs text-gray-500">Site Cree</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {/* Line Chart */}
        <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Rapports</h2>
            <button className="text-gray-400">
              <i className="lucide more-horizontal"></i>
            </button>
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-gray-900 text-white text-lg font-semibold px-4 py-2 rounded">
                175
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>10am</span>
            <span>11am</span>
            <span>12pm</span>
            <span>01pm</span>
            <span>02pm</span>
            <span>03pm</span>
            <span>04pm</span>
            <span>05pm</span>
            <span>06pm</span>
            <span>07pm</span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Les Membres Verifier</h2>
            <button className="text-gray-400">
              <i className="lucide more-horizontal"></i>
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold">80%</div>
                <div className="text-xs text-gray-500">Transactions</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Verifier</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-sm">Non Verifier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Subscribers Table */}
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Abonné récent</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Abonnant Name</th>
                  <th className="pb-3">Adresse</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-100">
                    <td className="py-3 text-sm">{sub.id}</td>
                    <td className="py-3 text-sm">{sub.name}</td>
                    <td className="py-3 text-sm">{sub.address}</td>
                    <td className="py-3 text-sm">{sub.date}</td>
                    <td className="py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-500">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Taches à faire</h2>
            <button className="text-gray-400">
              <i className="lucide more-horizontal"></i>
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <span className="text-sm">{task.label}</span>
                </div>
                <div className="w-6 h-6">
                  {task.priority === 'high' && <div className="w-full h-full rounded-full bg-yellow-400"></div>}
                  {task.priority === 'medium' && <div className="w-full h-full rounded-full bg-yellow-400"></div>}
                  {task.priority === 'low' && <div className="w-full h-full rounded-full bg-yellow-400"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;