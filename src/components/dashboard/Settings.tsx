import React, { useState } from 'react';
import type { Theme } from '../../types';
import { Save, Globe, Mail, Shield, Database, Bell } from 'lucide-react';
import { showSuccess } from '../common/ModernNotification';

interface SettingsProps {
  theme: Theme;
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleSave = () => {
    showSuccess('Settings Saved', 'Your settings have been updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Settings
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Configure your application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className={`lg:col-span-1 p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className={`lg:col-span-3 p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  General Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Neverland Studio"
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Tagline
                    </label>
                    <input
                      type="text"
                      defaultValue="Creative Digital Solutions"
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="info@neverlandstudio.com"
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Email Configuration
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Configure SMTP settings for outgoing emails
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      defaultValue="587"
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Encryption
                    </label>
                    <select className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}>
                      <option>TLS</option>
                      <option>SSL</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'email' && (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {tabs.find(t => t.id === activeTab)?.label} settings will be implemented here
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}">
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
