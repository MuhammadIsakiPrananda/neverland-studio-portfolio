import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { Save, Loader, Mail, ShoppingBag } from 'lucide-react';

// Komponen Toggle Switch yang bisa digunakan kembali
const ToggleSwitch = ({ id, label, description, checked, onChange }: { id: string, label: string, description: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <label htmlFor={id} className="font-medium text-white cursor-pointer">{label}</label>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
    </label>
  </div>
);

export const NotificationsTabContent: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    comments: true,
    mentions: true,
    newFollowers: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    productUpdates: true,
    reminders: false,
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications({ ...emailNotifications, [e.target.name]: e.target.checked });
  };

  const handlePushChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushNotifications({ ...pushNotifications, [e.target.name]: e.target.checked });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Di sini Anda bisa menambahkan notifikasi sukses
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <SettingsCard
        title="Email Notifications"
        description="Decide which emails you'd like to receive."
        icon={<Mail className="w-5 h-5 text-slate-400" />}
        footer={
          <div className="flex justify-end">
            <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span className="font-semibold">{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        }
      >
        <div className="divide-y divide-slate-800">
          <ToggleSwitch id="comments" label="Comments" description="Get notified when someone comments on your posts." checked={emailNotifications.comments} onChange={handleEmailChange} />
          <ToggleSwitch id="mentions" label="Mentions" description="Get notified when someone mentions you." checked={emailNotifications.mentions} onChange={handleEmailChange} />
          <ToggleSwitch id="newFollowers" label="New Followers" description="Get notified when a new user follows you." checked={emailNotifications.newFollowers} onChange={handleEmailChange} />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Push Notifications"
        description="Set your preferences for push notifications."
        icon={<ShoppingBag className="w-5 h-5 text-slate-400" />}
      >
        <div className="divide-y divide-slate-800">
          <ToggleSwitch id="productUpdates" label="Product Updates" description="News, updates, and product announcements." checked={pushNotifications.productUpdates} onChange={handlePushChange} />
          <ToggleSwitch id="reminders" label="Reminders" description="These are notifications to remind you of updates." checked={pushNotifications.reminders} onChange={handlePushChange} />
        </div>
      </SettingsCard>
    </div>
  );
};