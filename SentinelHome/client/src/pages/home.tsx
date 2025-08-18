import { useWebSocket } from '@/hooks/use-websocket';
import Header from '@/components/dashboard/header';
import SystemStatus from '@/components/dashboard/system-status';
import MotionDetection from '@/components/dashboard/motion-detection';
import Environment from '@/components/dashboard/environment';
import CameraSystem from '@/components/dashboard/camera-system';
import SecurityPerimeter from '@/components/dashboard/security-perimeter';
import AutomationControls from '@/components/dashboard/automation-controls';
import PowerManagement from '@/components/dashboard/power-management';
import RecentActivity from '@/components/dashboard/recent-activity';
import BottomNavigation from '@/components/dashboard/bottom-navigation';

export default function Home() {
  const { isConnected, sensors, settings, activities, updateSettings } = useWebSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header isConnected={isConnected} />
      
      <main className="p-4 max-w-md mx-auto space-y-4 pb-20">
        <SystemStatus 
          sensors={sensors} 
          settings={settings} 
          onToggleSystemArm={(armed) => updateSettings({ systemArmed: armed })}
        />
        
        <MotionDetection sensors={sensors} />
        
        <Environment sensors={sensors} />
        
        <CameraSystem />
        
        <SecurityPerimeter sensors={sensors} />
        
        <AutomationControls 
          settings={settings}
          onUpdateSettings={updateSettings}
        />
        
        <PowerManagement sensors={sensors} />
        
        <RecentActivity activities={activities} />
      </main>
      
      <BottomNavigation />
    </div>
  );
}
