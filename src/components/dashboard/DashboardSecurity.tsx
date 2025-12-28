import React from 'react';
import type { Theme } from '../../types';
import { Shield, Check, X, AlertTriangle } from 'lucide-react';

interface DashboardSecurityProps {
  theme: Theme;
}

const DashboardSecurity: React.FC<DashboardSecurityProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const securityChecks = [
    { name: 'HTTPS Enabled', status: 'pass', message: 'SSL certificate valid' },
    { name: '2FA Available', status: 'pass', message: 'Two-factor authentication enabled' },
    { name: 'Password Policy', status: 'pass', message: 'Strong password requirements active' },
    { name: 'API Rate Limiting', status: 'warn', message: 'Consider implementing stricter limits' },
    { name: 'SQL Injection Protection', status: 'pass', message: 'Parameterized queries in use' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Security Dashboard
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Monitor security status and vulnerabilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Security Score', value: '92%', color: 'green' },
          { label: 'Vulnerabilities', value: '1', color: 'yellow' },
          { label: 'Last Scan', value: '2 hours ago', color: 'blue' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <Shield className="w-8 h-8 text-green-500 mb-3" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Security Checks
        </h3>
        <div className="space-y-4">
          {securityChecks.map((check, idx) => (
            <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              {check.status === 'pass' ? (
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{check.name}</h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSecurity;
