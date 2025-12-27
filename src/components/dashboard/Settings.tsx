import React, { useState } from 'react';
import type { Theme } from '../../types';
import { 
  Globe,
  Mail,
  Shield,
  Bell,
  Save,
  Upload
} from 'lucide-react';

interface SettingsProps {
  theme: Theme;
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  const [settings, setSettings] = useState({
    siteName: 'Neverland Studio',
    siteTagline: 'Transforming Ideas Into Reality',
    contactEmail: 'contact@neverlandstudio.com',
    socialLinks: {
      facebook: 'https://facebook.com/neverlandstudio',
      twitter: 'https://twitter.com/neverlandstudio',
      instagram: 'https://instagram.com/neverlandstudio',
      linkedin: 'https://linkedin.com/company/neverlandstudio'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true
    },
    maintenance: {
      enabled: false,
      message: 'We are currently performing maintenance. Please check back soon.'
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            Settings
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
            Configure your website settings
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
            ${isDark 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30' 
              : 'bg-stone-900 text-white hover:bg-stone-800'}
          `}
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className={`
        p-6 rounded-2xl
        ${isDark 
          ? 'bg-gray-900/50 border border-gray-800' 
          : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-500/20' : 'bg-stone-900/10'}`}>
            <Globe className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-stone-900'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              General Settings
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              Basic site configuration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className={`
                w-full px-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                focus:outline-none
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
              Site Tagline
            </label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) => setSettings({...settings, siteTagline: e.target.value})}
              className={`
                w-full px-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                focus:outline-none
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
              Site Logo
            </label>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-stone-100'
              }`}>
                <Globe className={`w-10 h-10 ${isDark ? 'text-gray-600' : 'text-stone-400'}`} />
              </div>
              <button className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors
                ${isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}
              `}>
                <Upload className="w-4 h-4" />
                Upload Logo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div className={`
        p-6 rounded-2xl
        ${isDark 
          ? 'bg-gray-900/50 border border-gray-800' 
          : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Mail className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Contact Information
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              Contact details and social links
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              className={`
                w-full px-4 py-2 rounded-xl transition-colors
                ${isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                  : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                focus:outline-none
              `}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, facebook: e.target.value}
                })}
                className={`
                  w-full px-4 py-2 rounded-xl transition-colors
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                    : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                  focus:outline-none
                `}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Twitter
              </label>
              <input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, twitter: e.target.value}
                })}
                className={`
                  w-full px-4 py-2 rounded-xl transition-colors
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                    : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                  focus:outline-none
                `}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, instagram: e.target.value}
                })}
                className={`
                  w-full px-4 py-2 rounded-xl transition-colors
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                    : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                  focus:outline-none
                `}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.socialLinks.linkedin}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, linkedin: e.target.value}
                })}
                className={`
                  w-full px-4 py-2 rounded-xl transition-colors
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                    : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                  focus:outline-none
                `}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`
        p-6 rounded-2xl
        ${isDark 
          ? 'bg-gray-900/50 border border-gray-800' 
          : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <Bell className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Notifications
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              Manage notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Email Notifications
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                Receive updates via email
              </p>
            </div>
            <input 
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, emailNotifications: e.target.checked}
              })}
              className="w-5 h-5 rounded accent-amber-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Push Notifications
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                Get instant notifications
              </p>
            </div>
            <input 
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, pushNotifications: e.target.checked}
              })}
              className="w-5 h-5 rounded accent-amber-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Weekly Report
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
                Receive weekly analytics report
              </p>
            </div>
            <input 
              type="checkbox"
              checked={settings.notifications.weeklyReport}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, weeklyReport: e.target.checked}
              })}
              className="w-5 h-5 rounded accent-amber-500"
            />
          </label>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className={`
        p-6 rounded-2xl
        ${isDark 
          ? 'bg-gray-900/50 border border-gray-800' 
          : 'bg-white border border-stone-200 shadow-lg'}
      `}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
            <Shield className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Maintenance Mode
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
              Enable maintenance mode for site updates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-stone-900'}`}>
                Enable Maintenance Mode
              </p>
            </div>
            <input 
              type="checkbox"
              checked={settings.maintenance.enabled}
              onChange={(e) => setSettings({
                ...settings,
                maintenance: {...settings.maintenance, enabled: e.target.checked}
              })}
              className="w-5 h-5 rounded accent-red-500"
            />
          </label>

          {settings.maintenance.enabled && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
                Maintenance Message
              </label>
              <textarea
                value={settings.maintenance.message}
                onChange={(e) => setSettings({
                  ...settings,
                  maintenance: {...settings.maintenance, message: e.target.value}
                })}
                rows={3}
                className={`
                  w-full px-4 py-2 rounded-xl transition-colors resize-none
                  ${isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-amber-400' 
                    : 'bg-stone-50 border border-stone-200 text-stone-900 focus:border-stone-400'}
                  focus:outline-none
                `}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
