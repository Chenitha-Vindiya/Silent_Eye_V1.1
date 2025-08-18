import { AlertTriangle, Bell, Shield, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/header';
import BottomNavigation from '@/components/dashboard/bottom-navigation';

interface Alert {
  id: string;
  type: 'motion' | 'temperature' | 'gas' | 'door' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all');

  useEffect(() => {
    // Simulate some alerts
    setAlerts([
      {
        id: '1',
        type: 'motion',
        severity: 'medium',
        message: 'Motion detected at front entrance',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: false,
      },
      {
        id: '2',
        type: 'temperature',
        severity: 'low',
        message: 'Temperature slightly elevated (28°C)',
        timestamp: new Date(Date.now() - 1800000),
        acknowledged: true,
      },
      {
        id: '3',
        type: 'door',
        severity: 'high',
        message: 'Front door opened outside armed hours',
        timestamp: new Date(Date.now() - 3600000),
        acknowledged: false,
      },
    ]);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'motion': return '🏃';
      case 'temperature': return '🌡️';
      case 'gas': return '💨';
      case 'door': return '🚪';
      case 'system': return '⚙️';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header isConnected={true} />
      
      <main className="p-4 max-w-md mx-auto space-y-4 pb-20">
        <div className="glass rounded-xl p-4">
          <h1 className="text-xl font-bold flex items-center mb-4">
            <Bell className="text-blue-400 mr-2 w-5 h-5" />
            Security Alerts
          </h1>
          
          {/* Filter buttons */}
          <div className="flex space-x-2 mb-4">
            {(['all', 'active', 'acknowledged'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                data-testid={`filter-${filterType}`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Active alerts count */}
          <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="text-yellow-400 mr-2 w-4 h-4" />
              <span className="text-sm">Active Alerts</span>
            </div>
            <span className="text-xl font-bold text-yellow-400" data-testid="text-active-count">
              {alerts.filter(a => !a.acknowledged).length}
            </span>
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center">
              <Shield className="mx-auto w-12 h-12 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-green-400 mb-2">All Clear!</h3>
              <p className="text-slate-400">No alerts to display</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`glass rounded-xl p-4 ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{getTypeIcon(alert.type)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      {alert.acknowledged && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full ml-2">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-1" data-testid={`alert-message-${alert.id}`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-400" data-testid={`alert-time-${alert.id}`}>
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-1 bg-blue-500 hover:bg-blue-600 rounded text-xs transition-colors"
                        data-testid={`button-acknowledge-${alert.id}`}
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 bg-red-500 hover:bg-red-600 rounded text-xs transition-colors"
                      data-testid={`button-dismiss-${alert.id}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
