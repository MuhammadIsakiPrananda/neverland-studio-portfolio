import React from 'react';
import type { Theme } from '../../types';
import { Monitor, Smartphone, Tablet, MapPin, Clock } from 'lucide-react';

interface DashboardSessionsProps {
  theme: Theme;
}

const DashboardSessions: React.FC<DashboardSessionsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const sessions = [
    { id: 1, device: 'Desktop', browser: 'Chrome', location: 'Jakarta, Indonesia', ip: '192.168.1.1', active: true, lastActive: '2 minutes ago' },
    { id: 2, device: 'Mobile', browser: 'Safari', location: 'Bandung, Indonesia', ip: '192.168.1.2', active: false, lastActive: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Active Sessions
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage your active login sessions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map(session => (
          <div key={session.id} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {session.device === 'Desktop' ? <Monitor className="w-8 h-8 text-blue-500" /> : <Smartphone className="w-8 h-8 text-green-500" />}
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.browser} on {session.device}</h3>
                  <div className={`mt-2 space-y-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {session.location} • {session.ip}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {session.lastActive}
                    </div>
                  </div>
                </div>
              </div>
              {session.active && <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">Active</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSessions;
