import React from 'react';
import { MessageCircle } from 'lucide-react';

const Messages = () => {
  const messages = [
    { id: 1, sender: 'Alice', content: 'Salut, comment vas-tu ?', time: '10:45' },
    { id: 2, sender: 'Bob', content: 'Nouveau rapport disponible', time: '09:15' },
    { id: 3, sender: 'Claire', content: 'Réunion annulée', time: '08:30' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <MessageCircle className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-800">Messages récents</h3>
        </div>
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="flex items-start border-b border-gray-100 pb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <span className="text-indigo-600 font-medium">{msg.sender[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{msg.sender}</p>
                <p className="text-sm text-gray-600">{msg.content}</p>
              </div>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Messages;