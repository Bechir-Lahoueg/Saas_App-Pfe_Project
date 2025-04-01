import React from 'react';
import { FileText, Search, Filter, Download, ArrowUpDown } from 'lucide-react';

const Invoices = () => {
  const invoices = [
    { 
      id: 'INV-2025-001', 
      client: 'Entreprise ABC', 
      date: '02/03/2025', 
      montant: '1,250.00€', 
      statut: 'Payée',
      statutColor: 'bg-green-100 text-green-600'
    },
    { 
      id: 'INV-2025-002', 
      client: 'Société XYZ', 
      date: '28/02/2025', 
      montant: '3,750.00€', 
      statut: 'En attente',
      statutColor: 'bg-yellow-100 text-yellow-600'
    },
    { 
      id: 'INV-2025-003', 
      client: 'Groupe 123', 
      date: '15/02/2025', 
      montant: '875.50€', 
      statut: 'Payée',
      statutColor: 'bg-green-100 text-green-600'
    },
    { 
      id: 'INV-2025-004', 
      client: 'Client Particulier', 
      date: '10/02/2025', 
      montant: '2,340.00€', 
      statut: 'En retard',
      statutColor: 'bg-red-100 text-red-600'
    },
    { 
      id: 'INV-2025-005', 
      client: 'Entreprise QRS', 
      date: '05/02/2025', 
      montant: '1,820.75€', 
      statut: 'Payée',
      statutColor: 'bg-green-100 text-green-600'
    }
  ];

  const stats = [
    { title: 'Total des factures', value: '10,036.25€' },
    { title: 'En attente', value: '3,750.00€' },
    { title: 'En retard', value: '2,340.00€' }
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestion des Factures</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <FileText size={16} className="mr-2" />
          Nouvelle Facture
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Rechercher une facture..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 flex items-center">
              <Filter size={16} className="mr-2" />
              Filtrer
            </button>
            <button className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 flex items-center">
              <ArrowUpDown size={16} className="mr-2" />
              Trier
            </button>
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Numéro</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{invoice.montant}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${invoice.statutColor}`}>
                      {invoice.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <Download size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          Affichage de 5 factures sur 24 factures
        </div>
      </div>
    </div>
  );
};

export default Invoices;