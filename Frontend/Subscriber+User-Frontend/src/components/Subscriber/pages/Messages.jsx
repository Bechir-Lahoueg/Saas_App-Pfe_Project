import React from 'react';
import { Send, Mic, Smile, Paperclip } from 'lucide-react';

const ChatApp = () => {
  const chats = [
    { 
      id: 'Ope', 
      lastMessage: 'Are you coming to chat tomorrow?',
      time: '3:45 PM',
      active: true,
      unread: false
    },
    { 
      id: 'Bambam', 
      lastMessage: 'Are you coming to chat tomorrow?',
      time: '2:30 PM',
      active: false,
      unread: true
    },
    { 
      id: 'Lucia', 
      lastMessage: 'I miss you dear, when are you coming to see me?',
      time: '1:15 PM',
      active: false,
      unread: true
    },
    { 
      id: 'Mijan', 
      lastMessage: 'How are you doing?',
      time: '12:45 PM',
      active: false,
      unread: false
    },
    { 
      id: 'Chi', 
      lastMessage: 'I have you called then?',
      time: '11:20 AM',
      active: false,
      unread: false
    },
    { 
      id: 'Chison', 
      lastMessage: 'My brother is the best, he my helper.',
      time: '10:05 AM',
      active: false,
      unread: false
    },
    { 
      id: 'Afa', 
      lastMessage: 'Lastly, I want a meeting by 3pm. Okay, thanks!',
      time: '9:30 AM',
      active: false,
      unread: false
    }
  ];

  const activeChat = chats.find(chat => chat.active);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Messages</h2>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer ${chat.active ? 'bg-gray-100' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full mr-3 flex items-center justify-center ${chat.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className="text-white font-semibold">{chat.id[0]}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{chat.id}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <span className="text-white font-semibold">{activeChat.id[0]}</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{activeChat.id}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="flex mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <span className="text-white font-semibold">{activeChat.id[0]}</span>
            </div>
            <div className="flex-1">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-800">{activeChat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">{activeChat.time}</span>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-200 flex items-center space-x-3">
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <Smile size={20} />
          </button>
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <Paperclip size={20} />
          </button>
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Type something..." 
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <Send size={20} />
          </button>
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;