import React, { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useAppearanceState = () => {
  const [appSettings, setAppSettings] = useState({
    theme: (localStorage.getItem('theme') as Theme) || 'dark',
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(appSettings.theme === 'dark' ? 'light' : 'dark');
    root.classList.add(appSettings.theme);
    localStorage.setItem('theme', appSettings.theme);
  }, [appSettings.theme]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAppSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleThemeChange = (theme: Theme) => {
    setAppSettings(p => ({ ...p, theme }));
  };

  return { appSettings, handleSettingsChange, handleThemeChange };
};