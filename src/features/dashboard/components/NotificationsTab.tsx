import React, { useState } from "react";
import { SettingsCard } from "@/shared/components";
import {
  Mail,
  ShoppingBag,
  Save,
  Loader,
  Palette,
  Sun,
  Moon,
} from "lucide-react";

interface NotificationsTabProps {
  appSettings: {
    theme: "light" | "dark";
  };
  onThemeChange: (theme: "light" | "dark") => void;
}

// Reusable ToggleSwitch component
const ToggleSwitch = ({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <label htmlFor={id} className="font-medium text-white cursor-pointer">
        {label}
      </label>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <label
      htmlFor={id}
      className="relative inline-flex items-center cursor-pointer"
    >
      <input
        type="checkbox"
        id={id}
        name={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
    </label>
  </div>
);

export const NotificationsTabContent: React.FC<NotificationsTabProps> = ({
  appSettings,
  onThemeChange,
}) => {
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

  const theme = appSettings.theme;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications({
      ...emailNotifications,
      [e.target.id]: e.target.checked,
    });
  };

  const handlePushChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushNotifications({
      ...pushNotifications,
      [e.target.id]: e.target.checked,
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call to save settings
    console.log("Saving notification settings:", {
      emailNotifications,
      pushNotifications,
    });
    setTimeout(() => {
      setIsSaving(false);
      // You can add a toast notification here for user feedback
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <SettingsCard
        title="Appearance"
        description="Customize the look and feel of your interface."
        icon={<Palette className="w-5 h-5 text-slate-400" />}
      >
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300">Theme</label>
            <div className="relative flex w-full p-1 mt-2 bg-slate-950/50 rounded-xl border border-white/10">
              <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-slate-800 shadow-sm rounded-lg transition-transform duration-300 ease-in-out ${
                  theme === "dark" ? "translate-x-full" : "translate-x-0"
                }`}
              />
              <button
                onClick={() => onThemeChange("light")}
                className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors"
              >
                <Sun
                  className={`w-5 h-5 transition-colors ${
                    theme === "light" ? "text-indigo-400" : "text-slate-400"
                  }`}
                />
                <span
                  className={
                    theme === "light" ? "text-white" : "text-slate-400"
                  }
                >
                  Light
                </span>
              </button>
              <button
                onClick={() => onThemeChange("dark")}
                className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors"
              >
                <Moon
                  className={`w-5 h-5 transition-colors ${
                    theme === "dark" ? "text-indigo-400" : "text-slate-400"
                  }`}
                />
                <span
                  className={theme === "dark" ? "text-white" : "text-slate-400"}
                >
                  Dark
                </span>
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Email Notifications"
        description="Decide which emails you'd like to receive."
        icon={<Mail className="w-5 h-5 text-slate-400" />}
        footer={
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {isSaving ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        }
      >
        <div className="divide-y divide-white/5">
          <ToggleSwitch
            id="comments"
            label="Comments"
            description="Get notified when someone comments on your posts."
            checked={emailNotifications.comments}
            onChange={handleEmailChange}
          />
          <ToggleSwitch
            id="mentions"
            label="Mentions"
            description="Get notified when someone mentions you."
            checked={emailNotifications.mentions}
            onChange={handleEmailChange}
          />
          <ToggleSwitch
            id="newFollowers"
            label="New Followers"
            description="Get notified when a new user follows you."
            checked={emailNotifications.newFollowers}
            onChange={handleEmailChange}
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Push Notifications"
        description="Set your preferences for push notifications."
        icon={<ShoppingBag className="w-5 h-5 text-slate-400" />}
      >
        <div className="divide-y divide-white/5">
          <ToggleSwitch
            id="productUpdates"
            label="Product Updates"
            description="News, updates, and product announcements."
            checked={pushNotifications.productUpdates}
            onChange={handlePushChange}
          />
          <ToggleSwitch
            id="reminders"
            label="Reminders"
            description="These are notifications to remind you of updates."
            checked={pushNotifications.reminders}
            onChange={handlePushChange}
          />
        </div>
      </SettingsCard>
    </div>
  );
};
