import { History, CheckCircle, Camera, Thermometer } from 'lucide-react';
import type { ActivityLog } from '@/lib/types';

interface RecentActivityProps {
  activities: ActivityLog[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getIcon = (iconClass: string) => {
    if (iconClass.includes('check-circle')) return CheckCircle;
    if (iconClass.includes('camera')) return Camera;
    if (iconClass.includes('thermometer')) return Thermometer;
    return CheckCircle;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <History className="text-slate-400 mr-2 w-4 h-4" />
          Recent Activity
        </h3>
        <button 
          className="text-xs text-blue-400 hover:text-blue-300"
          data-testid="button-view-all"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-2">
        {activities.slice(0, 3).map((activity) => {
          const Icon = getIcon(activity.icon);
          const iconColor = getIconColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-center p-2 bg-slate-800/30 rounded-lg">
              <Icon className={`${iconColor} mr-3 text-sm w-4 h-4`} />
              <div className="flex-1">
                <div className="text-sm" data-testid={`text-activity-${activity.id}`}>
                  {activity.message}
                </div>
                <div className="text-xs text-slate-400" data-testid={`time-activity-${activity.id}`}>
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center text-slate-400 py-4">
            <div className="text-sm">No recent activity</div>
          </div>
        )}
      </div>
    </div>
  );
}
