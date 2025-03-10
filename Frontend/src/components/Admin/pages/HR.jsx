import React from 'react';
import { Users } from 'lucide-react';

const HR = () => {
  const teamMembers = [
    { id: 1, name: 'Jean Dupont', role: 'Développeur', status: 'Actif' },
    { id: 2, name: 'Marie Curie', role: 'Designer', status: 'Actif' },
    { id: 3, name: 'Paul Martin', role: 'Manager', status: 'Inactif' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Équipe</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Users className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-800">Membres de l'équipe</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Rôle</th>
                <th className="pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="py-3 text-sm text-gray-800 font-medium">{member.name}</td>
                  <td className="py-3 text-sm text-gray-600">{member.role}</td>
                  <td className="py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Actif'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {member.status}
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

export default HR;