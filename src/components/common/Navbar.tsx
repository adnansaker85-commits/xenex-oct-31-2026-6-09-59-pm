import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, User, LogOut } from 'lucide-react';
import { logout } from '../../api/auth/firebaseAuth';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: User, label: 'Profile', path: `/profile/${user?.uid}` },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 border-r border-zinc-200 bg-white flex-col p-6 z-50">
        <Link to="/" className="text-2xl font-black text-black mb-10 tracking-tighter">
          XENEX
        </Link>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-black text-white font-medium'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-200">
          <button
            onClick={() => logout()}
            className="flex items-center gap-4 p-3 w-full rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <Link to="/" className="text-xl font-black text-black tracking-tighter">
          XENEX
        </Link>
        <button onClick={() => logout()} className="p-2 text-zinc-500 hover:text-red-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 border-t border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-200 ${
              isActive(item.path) ? 'text-black' : 'text-zinc-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </>
  );
}
