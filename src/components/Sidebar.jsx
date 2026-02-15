import { LayoutDashboard, Users, Video, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve user data for RBAC and identity display
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'viewer'] },
    { name: 'Admin Panel', path: '/admin/users', icon: Users, roles: ['admin'] },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
          <Video className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">StreamSafe</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
      </nav>

      {/* User Identity & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-2xl mb-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-600 uppercase">
              {user?.username?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-blue-500" />
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{user?.role}</p>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 truncate font-mono uppercase">Org: {user?.organizationId}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all active:scale-95"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;