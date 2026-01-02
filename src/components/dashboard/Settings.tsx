import React, { useState, useEffect } from 'react';
import type { Theme } from '../../types';
import { Save, Globe, Mail, Shield, Database, Bell, Wrench } from 'lucide-react';
import { showSuccess, showError } from '../common/ModernNotification';
import apiService from '../../services/apiService';

interface SettingsProps {
  theme: Theme;
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  // Maintenance mode state
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    is_active: false,
    title: 'Website Under Maintenance',
    message: 'We are currently performing scheduled maintenance. We will be back soon!',
    estimated_time: '',
    allowed_ips: [] as string[],
  });
  const [newIp, setNewIp] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Load maintenance settings on mount
  useEffect(() => {
    if (activeTab === 'maintenance') {
      loadMaintenanceSettings();
    }
  }, [activeTab]);

  const loadMaintenanceSettings = async () => {
    try {
      const response = await apiService.get('/admin/maintenance');
      if (response.data.success) {
        setMaintenanceSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load maintenance settings:', error);
    }
  };

  const handleMaintenanceToggle = async () => {
    setLoading(true);
    try {
      const response = await apiService.put('/admin/maintenance', {
        ...maintenanceSettings,
        is_active: !maintenanceSettings.is_active,
      });
      
      if (response.data.success) {
        setMaintenanceSettings(response.data.data);
        showSuccess(
          'Success',
          `Maintenance mode ${response.data.data.is_active ? 'activated' : 'deactivated'}`
        );
      }
    } catch (error) {
      showError('Error', 'Failed to toggle maintenance mode');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceSave = async () => {
    setLoading(true);
    try {
      const response = await apiService.put('/admin/maintenance', maintenanceSettings);
      
      if (response.data.success) {
        setMaintenanceSettings(response.data.data);
        showSuccess('Success', 'Maintenance settings updated successfully');
      }
    } catch (error) {
      showError('Error', 'Failed to update maintenance settings');
    } finally {
      setLoading(false);
    }
  };

  const addAllowedIp = () => {
    if (newIp && !maintenanceSettings.allowed_ips.includes(newIp)) {
      setMaintenanceSettings({
        ...maintenanceSettings,
        allowed_ips: [...maintenanceSettings.allowed_ips, newIp],
      });
      setNewIp('');
    }
  };

  const removeAllowedIp = (ip: string) => {
    setMaintenanceSettings({
      ...maintenanceSettings,
      allowed_ips: maintenanceSettings.allowed_ips.filter(i => i !== ip),
    });
  };

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

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Maintenance Mode
                </h3>
                
                {/* Maintenance Mode Toggle */}
                <div className={`p-4 rounded-lg border ${
                  maintenanceSettings.is_active 
                    ? 'bg-red-500/10 border-red-500' 
                    : isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Maintenance Mode Status
                      </h4>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {maintenanceSettings.is_active 
                          ? '⚠️ Website is currently in maintenance mode' 
                          : '✓ Website is running normally'}
                      </p>
                    </div>
                    <button
                      onClick={handleMaintenanceToggle}
                      disabled={loading}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        maintenanceSettings.is_active ? 'bg-red-500' : 'bg-slate-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          maintenanceSettings.is_active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Maintenance Settings */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Maintenance Title
                    </label>
                    <input
                      type="text"
                      value={maintenanceSettings.title}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, title: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Maintenance Message
                    </label>
                    <textarea
                      value={maintenanceSettings.message}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, message: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Estimated Time (Optional)
                    </label>
                    <input
                      type="text"
                      value={maintenanceSettings.estimated_time || ''}
                      onChange={(e) => setMaintenanceSettings({ ...maintenanceSettings, estimated_time: e.target.value })}
                      placeholder="e.g., 2 hours, until 10:00 AM"
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  {/* Allowed IPs */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Allowed IPs (Bypass Maintenance)
                    </label>
                    <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      These IPs can access the website even during maintenance mode
                    </p>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Enter IP address (e.g., 192.168.1.1)"
                        className={`flex-1 px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      <button
                        onClick={addAllowedIp}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {maintenanceSettings.allowed_ips.length > 0 && (
                      <div className="space-y-2">
                        {maintenanceSettings.allowed_ips.map((ip) => (
                          <div
                            key={ip}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                          >
                            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {ip}
                            </span>
                            <button
                              onClick={() => removeAllowedIp(ip)}
                              className="text-red-500 hover:text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button for Maintenance */}
                  <button
                    onClick={handleMaintenanceSave}
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Maintenance Settings'}
                  </button>
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

          {activeTab !== 'general' && activeTab !== 'email' && activeTab !== 'maintenance' && (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {tabs.find(t => t.id === activeTab)?.label} settings will be implemented here
              </p>
            </div>
          )}

          {/* Save Button - Only for general and email tabs */}
          {(activeTab === 'general' || activeTab === 'email') && (
            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
