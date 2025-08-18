import { Lightbulb, Bell, Volume2, Wand2 } from 'lucide-react';
import type { SystemSettings } from '@/lib/types';

interface AutomationControlsProps {
  settings: SystemSettings | null;
  onUpdateSettings: (settings: Partial<SystemSettings>) => void;
}

export default function AutomationControls({ settings, onUpdateSettings }: AutomationControlsProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Wand2 className="text-purple-400 mr-2 w-4 h-4" />
          Automation
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center">
            <Lightbulb className="text-yellow-400 mr-3 w-4 h-4" />
            <div>
              <div className="font-medium text-sm">Auto Lights</div>
              <div className="text-xs text-slate-400">6PM - 6AM Motion</div>
            </div>
          </div>
          <div 
            className={`toggle-switch ${settings?.autoLights ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ autoLights: !settings?.autoLights })}
            data-testid="toggle-auto-lights"
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center">
            <Bell className="text-blue-400 mr-3 w-4 h-4" />
            <div>
              <div className="font-medium text-sm">Daily Reminder</div>
              <div className="text-xs text-slate-400">11AM Security Check</div>
            </div>
          </div>
          <div 
            className={`toggle-switch ${settings?.dailyReminder ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ dailyReminder: !settings?.dailyReminder })}
            data-testid="toggle-daily-reminder"
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center">
            <Volume2 className="text-red-400 mr-3 w-4 h-4" />
            <div>
              <div className="font-medium text-sm">Alert Buzzer</div>
              <div className="text-xs text-slate-400">2 min duration</div>
            </div>
          </div>
          <div 
            className={`toggle-switch ${settings?.alertBuzzer ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ alertBuzzer: !settings?.alertBuzzer })}
            data-testid="toggle-alert-buzzer"
          />
        </div>
      </div>
    </div>
  );
}
