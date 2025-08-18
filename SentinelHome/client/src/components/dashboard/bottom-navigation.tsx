import { Home, Bell, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', testId: 'nav-home' },
    { path: '/alerts', icon: Bell, label: 'Alerts', testId: 'nav-alerts' },
    { path: '/history', icon: BarChart3, label: 'History', testId: 'nav-history' },
    { path: '/settings', icon: Settings, label: 'Settings', testId: 'nav-settings' },
  ];

  return (
    <nav className="glass-dark fixed bottom-0 left-0 right-0 p-4">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button 
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                data-testid={item.testId}
              >
                <Icon className="text-lg w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
