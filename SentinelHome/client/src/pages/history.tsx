import { BarChart3, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/dashboard/header';
import BottomNavigation from '@/components/dashboard/bottom-navigation';

export default function History() {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'motion' | 'power' | 'alerts'>('temperature');

  const periods = [
    { value: '24h' as const, label: '24 Hours' },
    { value: '7d' as const, label: '7 Days' },
    { value: '30d' as const, label: '30 Days' },
  ];

  const metrics = [
    { value: 'temperature' as const, label: 'Temperature', icon: '🌡️', color: 'text-blue-400' },
    { value: 'motion' as const, label: 'Motion Events', icon: '🏃', color: 'text-purple-400' },
    { value: 'power' as const, label: 'Power Usage', icon: '⚡', color: 'text-yellow-400' },
    { value: 'alerts' as const, label: 'Security Alerts', icon: '🔔', color: 'text-red-400' },
  ];

  // Mock data for demonstration
  const getStatsForMetric = (metric: string, period: string) => {
    const baseStats = {
      temperature: { current: 22.5, change: +1.2, unit: '°C' },
      motion: { current: 8, change: -2, unit: 'events' },
      power: { current: 340, change: +15, unit: 'mA' },
      alerts: { current: 3, change: -1, unit: 'alerts' },
    };
    
    return baseStats[metric as keyof typeof baseStats];
  };

  const stats = getStatsForMetric(selectedMetric, selectedPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header isConnected={true} />
      
      <main className="p-4 max-w-md mx-auto space-y-4 pb-20">
        <div className="glass rounded-xl p-4">
          <h1 className="text-xl font-bold flex items-center mb-4">
            <BarChart3 className="text-blue-400 mr-2 w-5 h-5" />
            Historical Data
          </h1>
          
          {/* Period selector */}
          <div className="flex space-x-2 mb-4">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                data-testid={`period-${period.value}`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Current stats */}
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="text-slate-400 mr-2 w-4 h-4" />
                <span className="text-sm">Period Summary</span>
              </div>
              <span className="text-xs text-slate-400">Last {selectedPeriod}</span>
            </div>
          </div>
        </div>

        {/* Metric selector */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Select Metric</h3>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedMetric === metric.value
                    ? 'bg-blue-500/20 border border-blue-400'
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
                data-testid={`metric-${metric.value}`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{metric.icon}</span>
                  <span className={`text-xs ${metric.color}`}>
                    {metric.label.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-medium">{metric.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected metric details */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <span className="text-lg mr-2">{metrics.find(m => m.value === selectedMetric)?.icon}</span>
              {metrics.find(m => m.value === selectedMetric)?.label}
            </h3>
            <span className="text-xs text-slate-400">Last {selectedPeriod}</span>
          </div>

          {/* Current value and trend */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold" data-testid="text-metric-current">
                  {stats.current} {stats.unit}
                </div>
                <div className="flex items-center text-sm">
                  {stats.change > 0 ? (
                    <TrendingUp className="text-green-400 mr-1 w-4 h-4" />
                  ) : (
                    <TrendingDown className="text-red-400 mr-1 w-4 h-4" />
                  )}
                  <span className={stats.change > 0 ? 'text-green-400' : 'text-red-400'}>
                    {stats.change > 0 ? '+' : ''}{stats.change} {stats.unit}
                  </span>
                  <span className="text-slate-400 ml-1">from last period</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mock chart area */}
          <div className="bg-slate-800/50 rounded-lg p-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <Activity className="mx-auto w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-400">Chart visualization</p>
              <p className="text-xs text-slate-500">Real implementation would show trend graph</p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold mb-3">Period Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-400" data-testid="text-stat-max">
                {(stats.current * 1.2).toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Peak Value</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-400" data-testid="text-stat-avg">
                {(stats.current * 0.9).toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Average</div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
