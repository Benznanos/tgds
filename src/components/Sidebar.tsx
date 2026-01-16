import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Sparkles, label: 'AI Insights', path: '/ai-insights' },
  { icon: FileText, label: 'Documents', path: '/documents' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col" style={{ background: 'var(--gradient-sidebar)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">TJ</span>
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-semibold text-sm">TJDCS</h1>
            <p className="text-sidebar-foreground/60 text-xs">Dental Care Service</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link to="/settings" className="sidebar-nav-item">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Link>
        <button className="sidebar-nav-item w-full text-left">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;