import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-content bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">1871+</p>
          <p className="text-sm text-gray-500">Utilisateur inscrit</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">20+</p>
          <p className="text-sm text-gray-500">Adhérent</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">19+</p>
          <p className="text-sm text-gray-500">Site Crée</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Rapports</h3>
          {/* Placeholder pour le graphique */}
          <div className="h-64 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Graphique ici (ex. Recharts)</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Les Membres Vérifier</h3>
          <div className="h-64 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Donut Chart ici (80% Vérifié)</p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Abonné récent</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Tracking #</th>
              <th className="py-2">Adhérent Name</th>
              <th className="py-2">Adresse</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">#05</td>
              <td className="py-2">Houssem Krifi</td>
              <td className="py-2">089 Kush Green Apt. 448</td>
              <td className="py-2">17 Feb 2025</td>
              <td className="py-2 text-green-500">Vérifié</td>
            </tr>
            {/* Ajoute d'autres lignes ici */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;