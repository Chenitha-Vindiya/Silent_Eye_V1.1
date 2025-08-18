import { Settings as SettingsIcon, Shield, Bell, Thermometer, Zap, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import Header from '@/components/dashboard/header';
import BottomNavigation from '@/components/dashboard/bottom-navigation';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { settings, updateSettings } = useWebSocket();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState({
    systemArmed: true,
    autoLights: true,
    dailyReminder: true,
    alertBuzzer: true,
    temperatureThreshold: 30,
    gasThreshold: 500,
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        systemArmed: settings.systemArmed,
        autoLights: settings.autoLights,
        dailyReminder: settings.dailyReminder,
        alertBuzzer: settings.alertBuzzer,
        temperatureThreshold: settings.temperatureThreshold,
        gasThreshold: settings.gasThreshold,
      });
    }
  }, [settings]);

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings Saved",
      description: "Your security settings have been updated.",
    });
  };

  const handleToggle = (key: keyof typeof localSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThresholdChange = (key: 'temperatureThreshold' | 'gasThreshold', value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header isConnected={true} />
      
      <main className="p-4 max-w-md mx-auto space-y-4 pb-20">
        <div className="glass rounded-xl p-4">
          <h1 className="text-xl font-bold flex items-center mb-4">
            <SettingsIcon className="text-blue-400 mr-2 w-5 h-5" />
            Security Settings
          </h1>
          
          <button 
            onClick={handleSaveSettings}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center mb-4"
            data-testid="button-save-settings"
          >
            <Save className="mr-2 w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* System Security */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold flex items-center mb-3">
            <Shield className="text-green-400 mr-2 w-4 h-4" />
            System Security
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">System Armed</div>
                <div className="text-xs text-slate-400">Master security system control</div>
              </div>
              <div 
                className={`toggle-switch ${localSettings.systemArmed ? 'active' : ''}`}
                onClick={() => handleToggle('systemArmed')}
                data-testid="toggle-system-armed"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Alert Buzzer</div>
                <div className="text-xs text-slate-400">Sound alerts for security breaches</div>
              </div>
              <div 
                className={`toggle-switch ${localSettings.alertBuzzer ? 'active' : ''}`}
                onClick={() => handleToggle('alertBuzzer')}
                data-testid="toggle-alert-buzzer"
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold flex items-center mb-3">
            <Bell className="text-blue-400 mr-2 w-4 h-4" />
            Automation
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Automatic Lights</div>
                <div className="text-xs text-slate-400">Turn on lights for motion (6PM-6AM)</div>
              </div>
              <div 
                className={`toggle-switch ${localSettings.autoLights ? 'active' : ''}`}
                onClick={() => handleToggle('autoLights')}
                data-testid="toggle-auto-lights"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Daily Reminder</div>
                <div className="text-xs text-slate-400">11AM security check notification</div>
              </div>
              <div 
                className={`toggle-switch ${localSettings.dailyReminder ? 'active' : ''}`}
                onClick={() => handleToggle('dailyReminder')}
                data-testid="toggle-daily-reminder"
              />
            </div>
          </div>
        </div>

        {/* Sensor Thresholds */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold flex items-center mb-3">
            <Thermometer className="text-orange-400 mr-2 w-4 h-4" />
            Alert Thresholds
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">Temperature Alert</div>
                <span className="text-blue-400 font-bold" data-testid="text-temp-threshold">
                  {localSettings.temperatureThreshold}°C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="40"
                value={localSettings.temperatureThreshold}
                onChange={(e) => handleThresholdChange('temperatureThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                data-testid="slider-temperature"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>20°C</span>
                <span>40°C</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">Gas Level Alert</div>
                <span className="text-red-400 font-bold" data-testid="text-gas-threshold">
                  {localSettings.gasThreshold} ppm
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={localSettings.gasThreshold}
                onChange={(e) => handleThresholdChange('gasThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                data-testid="slider-gas"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>200 ppm</span>
                <span>1000 ppm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="glass rounded-xl p-4">
          <h3 className="font-semibold flex items-center mb-3">
            <Zap className="text-yellow-400 mr-2 w-4 h-4" />
            Device Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Firmware Version</span>
              <span data-testid="text-firmware">v2.1.3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Device ID</span>
              <span className="font-mono text-xs" data-testid="text-device-id">ESP32-SH001</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Last Update</span>
              <span data-testid="text-last-update">2 hours ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">WiFi Signal</span>
              <span className="text-green-400" data-testid="text-wifi-signal">Strong (-42 dBm)</span>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
