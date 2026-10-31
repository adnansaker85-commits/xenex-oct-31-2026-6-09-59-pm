import { useState } from 'react';
import { Search, MessageCircle, MoreVertical, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function InboxScreen() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const mockChats = [
    { id: '1', name: 'Alex Rivera', lastMsg: 'See you at the event! 🚀', time: '2m ago', unread: 2, photo: 'https://picsum.photos/seed/alex/100/100' },
    { id: '2', name: 'Sarah Chen', lastMsg: 'The design looks amazing!', time: '15m ago', unread: 0, photo: 'https://picsum.photos/seed/sarah/100/100' },
    { id: '3', name: 'Jordan Smith', lastMsg: 'Did you check the new update?', time: '1h ago', unread: 0, photo: 'https://picsum.photos/seed/jordan/100/100' },
    { id: '4', name: 'Elena Vance', lastMsg: 'Let\'s catch up soon!', time: '3h ago', unread: 1, photo: 'https://picsum.photos/seed/elena/100/100' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-128px)] md:h-[calc(100vh-64px)]">
      <div className="bg-white border border-zinc-200 rounded-[2.5rem] h-full flex overflow-hidden shadow-sm">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-zinc-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black tracking-tighter text-black flex items-center gap-2">
                Messages <Sparkles className="w-5 h-5 text-black" />
              </h1>
              <button className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search messages..." className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none text-black" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {mockChats.map((chat) => (
              <button key={chat.id} onClick={() => setActiveChat(chat.id)} className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 group ${activeChat === chat.id ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}>
                <div className="relative">
                  <img src={chat.photo} alt={chat.name} className="w-12 h-12 rounded-2xl object-cover border border-zinc-200" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 text-left space-y-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-bold truncate ${activeChat === chat.id ? 'text-black' : 'text-zinc-700'}`}>{chat.name}</h3>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate font-medium">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-lg shadow-sm">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-zinc-50/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-zinc-500 hover:text-black">
                    <MessageCircle className="w-5 h-5 rotate-180" />
                  </button>
                  <img src={mockChats.find(c => c.id === activeChat)?.photo} alt="Active chat" className="w-10 h-10 rounded-xl object-cover border border-zinc-200" />
                  <div>
                    <h3 className="font-bold text-black">{mockChats.find(c => c.id === activeChat)?.name}</h3>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online</p>
                  </div>
                </div>
                <button className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="flex justify-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-100 px-4 py-1 rounded-full border border-zinc-200">Today</span>
                </div>
                
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-white border border-zinc-200 p-4 rounded-3xl rounded-tl-none space-y-1 shadow-sm">
                    <p className="text-sm text-zinc-700 leading-relaxed">Hey! How have you been? I saw your latest post, it was amazing! 🌟</p>
                    <p className="text-[10px] text-zinc-400 font-bold text-right uppercase">10:42 AM</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-black p-4 rounded-3xl rounded-tr-none space-y-1 shadow-md">
                    <p className="text-sm text-white font-medium leading-relaxed">Thanks Alex! I've been working on it for a while. Let's catch up soon! 👋</p>
                    <p className="text-[10px] text-zinc-400 font-bold text-right uppercase">10:45 AM</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-black focus:border-black transition-all outline-none text-black" />
                  </div>
                  <button className="bg-black text-white p-4 rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-md group">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-12 text-center">
              <div className="w-24 h-24 bg-zinc-100 rounded-[2rem] flex items-center justify-center border border-zinc-200 shadow-sm">
                <MessageCircle className="w-10 h-10 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black tracking-tight">Your Inbox</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Select a conversation from the sidebar to start chatting with your friends.</p>
              </div>
              <button className="bg-black text-white font-bold px-8 py-3 rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-md">
                New Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
