import { Camera } from 'lucide-react';
import { useState } from 'react';

export default function CameraSystem() {
  const [lastSnapshot, setLastSnapshot] = useState('2 min ago');

  const handleCaptureSnapshot = () => {
    // In a real implementation, this would trigger the ESP32-CAM
    setLastSnapshot('Just now');
    setTimeout(() => setLastSnapshot('1 min ago'), 60000);
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Camera className="text-indigo-400 mr-2 w-4 h-4" />
          Camera System
        </h3>
        <button 
          className="px-3 py-1 bg-indigo-500 rounded-md text-xs font-medium hover:bg-indigo-600 transition-colors"
          onClick={handleCaptureSnapshot}
          data-testid="button-capture"
        >
          Capture
        </button>
      </div>
      <div className="space-y-3">
        <div className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-center h-32 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop" 
            alt="Latest security camera snapshot" 
            className="w-full h-full object-cover rounded-md opacity-80"
            data-testid="img-camera-feed"
          />
          <div className="absolute top-2 right-2 bg-red-500 text-xs px-2 py-1 rounded font-medium animate-pulse">
            LIVE
          </div>
          <div 
            className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded"
            data-testid="text-camera-timestamp"
          >
            {lastSnapshot}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Last Motion:</span>
          <span data-testid="text-last-motion">No recent activity</span>
        </div>
      </div>
    </div>
  );
}
