import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { realtimeService } from '../../services/realtimeService';

interface RealtimeIndicatorProps {
  theme: 'dark' | 'light';
}

export default function RealtimeIndicator({ theme }: RealtimeIndicatorProps) {
  const isDark = theme === 'dark';
  const [status, setStatus] = useState<string>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToStatus((newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'connected') {
        setLastUpdate(new Date());
      }
    });

    // Update last update time every second
    const interval = setInterval(() => {
      const statsUpdate = realtimeService.getLastUpdateTime('stats');
      if (statsUpdate) {
        setLastUpdate(statsUpdate);
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const getTimeAgo = () => {
    if (!lastUpdate) return 'Never';
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const statusConfig = {
    connected: {
      icon: Wifi,
      text: 'Live',
      color: isDark ? 'text-green-400' : 'text-green-600',
      bg: isDark ? 'bg-green-500/20' : 'bg-green-100',
      pulse: 'animate-pulse',
    },
    connecting: {
      icon: Clock,
      text: 'Connecting',
      color: isDark ? 'text-yellow-400' : 'text-yellow-600',
      bg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      pulse: 'animate-pulse',
    },
    disconnected: {
      icon: WifiOff,
      text: 'Offline',
      color: isDark ? 'text-red-400' : 'text-red-600',
      bg: isDark ? 'bg-red-500/20' : 'bg-red-100',
      pulse: '',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color} ${config.pulse}`} />
      <div className="flex flex-col">
        <span className={`text-xs font-semibold ${config.color}`}>
          {config.text}
        </span>
        {status === 'connected' && (
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {getTimeAgo()}
          </span>
        )}
      </div>
    </div>
  );
}
