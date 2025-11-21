import React from 'react'; // NOSONAR
import { Moon, Sun } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch'; // NOSONAR

interface AppSettings {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface AppearanceTabContentProps {
  appSettings: AppSettings;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppearanceTabContent: React.FC<AppearanceTabContentProps> = ({ appSettings, onThemeChange, onSettingsChange }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Display Settings</h3>
        <p className="text-sm text-slate-400 mt-1">Customize theme and notification preferences.</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-300">Theme</label>
          <div className="relative flex w-full p-1 mt-2 bg-gray-800 rounded-lg border border-gray-700">
            {/* --- OPTIMASI: Mengganti framer-motion dengan transisi CSS --- */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gray-700 shadow-sm rounded-md transition-transform duration-300 ease-in-out ${appSettings.theme === 'dark' ? 'translate-x-full' : 'translate-x-0'}`}
            />
            {/* ----------------------------------------------------------- */}
            <button onClick={() => onThemeChange('light')} className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors">
                <Sun className={`w-5 h-5 transition-colors ${appSettings.theme === 'light' ? 'text-yellow-400' : 'text-slate-400'}`} />
                <span className={appSettings.theme === 'light' ? 'text-white' : 'text-slate-400'}>Light</span>
            </button>
            <button onClick={() => onThemeChange('dark')} className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors">
                <Moon className={`w-5 h-5 transition-colors ${appSettings.theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className={appSettings.theme === 'dark' ? 'text-white' : 'text-slate-400'}>Dark</span>
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Notifications</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <div>
                  <p className="font-medium text-slate-200">Email Notifications</p>
              </div>
              <ToggleSwitch id="emailNotifications" name="emailNotifications" checked={appSettings.emailNotifications} onChange={onSettingsChange} />
            </div>
            <div className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <div>
                  <p className="font-medium text-slate-200">Push Notifications</p>
              </div>
              <ToggleSwitch id="pushNotifications" name="pushNotifications" checked={appSettings.pushNotifications} onChange={onSettingsChange} />
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};