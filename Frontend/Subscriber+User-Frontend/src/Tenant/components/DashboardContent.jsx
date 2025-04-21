import React from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  User, 
  ChevronRight as ChevronsRight, 
  Building,
  MoreHorizontal
} from 'lucide-react';

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
  const COLORS = ['#4f46e5', '#fcd34d'];

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

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <User className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">1871+</h3>
            <p className="text-xs text-gray-500">Utilisateur inscrit dans la plateforme</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <ChevronsRight className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">20+</h3>
            <p className="text-xs text-gray-500">Adhérent</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <Building className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">19+</h3>
            <p className="text-xs text-gray-500">Site Cree</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {/* Line Chart */}
        <div className="col-span-1 md:col-span-3 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Rapports</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={2} 
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: '#4f46e5', stroke: '#fff', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-indigo-600 text-white text-lg font-semibold px-4 py-2 rounded shadow-md">
                175
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
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
        <div className="col-span-1 md:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Les Membres Verifier</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
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
                <div className="text-2xl font-bold text-gray-800">80%</div>
                <div className="text-xs text-gray-500">Transactions</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-700">Verifier</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-sm text-gray-700">Non Verifier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Subscribers Table */}
        <div className="col-span-1 md:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Abonné récent</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Tracking ID</th>
                  <th className="pb-3 font-medium">Abonnant Name</th>
                  <th className="pb-3 font-medium">Adresse</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-100">
                    <td className="py-3 text-sm text-gray-800">{sub.id}</td>
                    <td className="py-3 text-sm text-gray-800 font-medium">{sub.name}</td>
                    <td className="py-3 text-sm text-gray-600">{sub.address}</td>
                    <td className="py-3 text-sm text-gray-600">{sub.date}</td>
                    <td className="py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-600 font-medium">
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
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Taches à faire</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-800">{task.label}</span>
                </div>
                <div className="w-6 h-6">
                  {task.priority === 'high' && <div className="w-full h-full rounded-full bg-yellow-400"></div>}
                  {task.priority === 'medium' && <div className="w-full h-full rounded-full bg-blue-400"></div>}
                  {task.priority === 'low' && <div className="w-full h-full rounded-full bg-green-400"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;