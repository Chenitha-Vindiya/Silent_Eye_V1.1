import { Shield, Settings } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  return (
    <header className="glass-dark sticky top-0 z-50 p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <Shield className="text-blue-400 w-5 h-5" />
          <h1 className="text-lg font-semibold" data-testid="app-title">SecureHome</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span 
              className={`status-indicator ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
              data-testid="connection-status"
            />
            <span className="text-xs text-slate-400">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <button 
            className="p-2 rounded-lg glass hover:bg-white/20 transition-all"
            data-testid="button-settings"
          >
            <Settings className="text-slate-300 w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
