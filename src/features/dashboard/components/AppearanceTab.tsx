import React from "react"; // NOSONAR
import { Moon, Sun, Palette } from "lucide-react";
import { SettingsCard } from "@/shared/components";

interface AppSettings {
  theme: "light" | "dark";
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface AppearanceTabContentProps {
  appSettings: AppSettings;
  onThemeChange: (theme: "light" | "dark") => void;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppearanceTabContent: React.FC<AppearanceTabContentProps> = ({
  appSettings,
  onThemeChange,
  onSettingsChange,
}) => {
  // Komponen Toggle Switch yang telah disesuaikan warnanya
  const ToggleSwitch = ({
    id,
    checked,
    onChange,
  }: {
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
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
      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
    </label>
  );

  return (
    <SettingsCard
      title="Appearance"
      description="Customize the look and feel of your interface."
      icon={<Palette className="w-5 h-5 text-slate-400" />}
    >
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-300">Theme</label>
          <div className="relative flex w-full p-1 mt-2 bg-slate-800/60 rounded-lg border border-slate-700">
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-slate-700/80 shadow-sm rounded-md transition-transform duration-300 ease-in-out ${
                appSettings.theme === "dark"
                  ? "translate-x-full"
                  : "translate-x-0"
              }`}
            />
            <button
              onClick={() => onThemeChange("light")}
              className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors"
            >
              <Sun
                className={`w-5 h-5 transition-colors ${
                  appSettings.theme === "light"
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              />
              <span
                className={
                  appSettings.theme === "light"
                    ? "text-white"
                    : "text-slate-400"
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
                  appSettings.theme === "dark"
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              />
              <span
                className={
                  appSettings.theme === "dark" ? "text-white" : "text-slate-400"
                }
              >
                Dark
              </span>
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">
            Notifications
          </label>
          <div className="mt-2 divide-y divide-slate-800">
            <div className="flex items-center justify-between py-3">
              <p className="font-medium text-slate-200">Email Notifications</p>
              <ToggleSwitch
                id="emailNotifications"
                checked={appSettings.emailNotifications}
                onChange={onSettingsChange}
              />
            </div>
            <div className="flex items-center justify-between py-3">
              <p className="font-medium text-slate-200">Push Notifications</p>
              <ToggleSwitch
                id="pushNotifications"
                checked={appSettings.pushNotifications}
                onChange={onSettingsChange}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};
