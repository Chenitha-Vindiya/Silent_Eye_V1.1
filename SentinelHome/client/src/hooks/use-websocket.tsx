import { useEffect, useState, useRef, useCallback } from 'react';
import type { SensorReading, SystemSettings, ActivityLog, DashboardData } from '@/lib/types';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnected(false);
      
      // Retry connection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, []);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'initial_data':
        const data = message.payload as DashboardData;
        setSensors(data.sensors || []);
        setSettings(data.settings);
        setActivities(data.activities || []);
        break;

      case 'sensor_update':
        const sensorUpdate = message.payload as SensorReading;
        setSensors(prev => {
          const filtered = prev.filter(s => s.sensorType !== sensorUpdate.sensorType);
          return [...filtered, sensorUpdate];
        });
        break;

      case 'settings_update':
        const settingsUpdate = message.payload as SystemSettings;
        setSettings(settingsUpdate);
        break;

      case 'activity_update':
        const activityUpdate = message.payload as ActivityLog;
        setActivities(prev => [activityUpdate, ...prev.slice(0, 19)]);
        break;

      case 'pong':
        // Handle ping/pong for connection health
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    sendMessage({
      type: 'settings_update',
      payload: newSettings,
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    
    // Send ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'ping', payload: {} });
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, sendMessage]);

  return {
    isConnected,
    sensors,
    settings,
    activities,
    lastUpdate,
    updateSettings,
    sendMessage,
  };
}
