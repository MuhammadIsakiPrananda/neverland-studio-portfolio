import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  Save,
  Smartphone,
  Trash2,
  Monitor,
  Globe,
  LogOut,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import QRCode from "react-qr-code";
import {
  SettingsCard,
  DeleteAccountModal,
  useNotification,
} from "@/shared/components";

// Type definitions
interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface Session {
  id: number;
  device: string;
  browser: string;
  location: string;
  isCurrent: boolean;
  lastActive: Date;
}

interface TOTP {
  secret: {
    base32: string;
  };
  toString(): string;
}

interface SecurityTabContentProps {
  handlePasswordChangeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  passwordData: PasswordData;
  handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordErrors: PasswordErrors;
  isLoading: boolean;
  is2faEnabled: boolean;
  isSettingUp2FA: boolean;
  setIsSettingUp2FA: (value: boolean) => void;
  handleEnable2FA: () => void;
  handleDisable2FA: () => void;
  totp: TOTP | null;
  twoFactorCode: string;
  setTwoFactorCode: (value: string) => void;
  handleVerify2FA: (e: React.FormEvent<HTMLFormElement>) => void;
  recoveryCodes?: string[] | null;
  showRecoveryCodes?: boolean;
  handleFinish2FASetup?: () => void;
  sessions: Session[];
  handleSignOutSession: (sessionId: number) => void;
  handleSignOutAllOtherSessions: () => void;
}

export const SecurityTabContent: React.FC<SecurityTabContentProps> = ({
  handlePasswordChangeSubmit,
  passwordData,
  handlePasswordInputChange,
  passwordErrors,
  isLoading,
  is2faEnabled,
  isSettingUp2FA,
  setIsSettingUp2FA,
  handleEnable2FA,
  handleDisable2FA,
  totp,
  twoFactorCode,
  setTwoFactorCode,
  handleVerify2FA,
  recoveryCodes,
  showRecoveryCodes,
  handleFinish2FASetup,
  sessions,
  handleSignOutSession,
  handleSignOutAllOtherSessions,
}) => {
  // State untuk toggle visibility password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  // Wrapper function to ensure form submission is handled without page reload
  const handleVerify2FASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission (which causes page reload)
    handleVerify2FA(e); // Call the actual verification logic passed via props
  };

  // State untuk modal dan proses penghapusan
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fungsi baru untuk mengunduh kode pemulihan
  const handleDownloadRecoveryCodes = () => {
    if (!recoveryCodes) return;
    const fileContent =
      "Neverland Studio - 2FA Recovery Codes\n\n" +
      "Store these codes in a safe place. They can be used to access your account if you lose your device.\n\n" +
      recoveryCodes.join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neverland-studio-recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification(
      "Downloaded",
      "Recovery codes have been downloaded.",
      "success"
    );
  };

  // Fungsi untuk menangani konfirmasi penghapusan
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL ||
          (import.meta.env.PROD
            ? "https://api.neverlandstudio.my.id"
            : "http://localhost:5000")
        }/api/auth/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to delete account");
      }

      // Hapus data pengguna dari localStorage/sessionStorage
      localStorage.removeItem("userProfile");
      sessionStorage.removeItem("userProfile");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      addNotification(
        "Account Deleted",
        "Your account has been permanently deleted.",
        "error"
      );

      // Redirect ke landing page setelah 2 detik
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setIsDeleting(false);
      addNotification(
        "Error",
        error instanceof Error ? error.message : "Failed to delete account",
        "error"
      );
      console.error("Delete account error:", error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++; // Uppercase
    if (/[0-9]/.test(password)) score++; // Number
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special character
    return score;
  };

  const strength = getPasswordStrength(passwordData.newPassword);
  const strengthText = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
    "Excellent",
  ][strength];
  const strengthColor = [
    "bg-red-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-amber-500",
  ][strength];

  return (
    <>
      <div className="space-y-8">
        <form onSubmit={handlePasswordChangeSubmit}>
          <SettingsCard
          title="Change Password"
          description="Update your password for enhanced security. Use a strong, unique password."
          footer={
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isLoading ? "Saving..." : "Update Password"}
                </span>
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium text-slate-400">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 mt-1 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors ${
                  passwordErrors.currentPassword
                    ? "border-red-500/50"
                    : "border-white/10"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-slate-400 hover:text-white"
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-400 mt-1.5">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-slate-400">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 mt-1 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors ${
                  passwordErrors.newPassword
                    ? "border-red-500/50"
                    : "border-white/10"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-slate-400 hover:text-white"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-400 mt-1.5">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-slate-400">
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 mt-1 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-colors ${
                  passwordErrors.confirmPassword
                    ? "border-red-500/50"
                    : "border-white/10"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-slate-400 hover:text-white"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1.5">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
            {passwordData.newPassword && (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${strengthColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-24 text-right font-medium">
                  {strengthText}
                </span>
              </div>
            )}
          </div>
        </SettingsCard>
        </form>

        <SettingsCard
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account during login."
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Authenticator App</p>
              <p
                className={`text-sm ${
                  is2faEnabled
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              >
                {is2faEnabled ? "Enabled" : "Not configured"}
              </p>
            </div>
            <button
              type="button"
              onClick={is2faEnabled ? handleDisable2FA : handleEnable2FA}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                is2faEnabled
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              {is2faEnabled ? "Disable" : "Enable"}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {isSettingUp2FA && (
              <motion.div
                key={showRecoveryCodes ? "recovery" : "setup"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-t border-white/5 pt-6"
              >
                {showRecoveryCodes && recoveryCodes ? (
                  // --- UI KODE PEMULIHAN ---
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Simpan Kode Pemulihan Anda
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Simpan kode-kode ini di tempat yang aman. Kode ini dapat
                      digunakan untuk mengakses akun Anda jika Anda kehilangan
                      akses ke aplikasi authenticator.
                    </p>
                    <div className="my-6 grid grid-cols-2 gap-x-8 gap-y-3 bg-slate-950/30 p-6 rounded-xl border border-white/5">
                      {recoveryCodes.map((code) => (
                        <p
                          key={code}
                          className="font-mono text-lg tracking-wider text-slate-200"
                        >
                          {code}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadRecoveryCodes}
                        className="w-full flex items-center justify-center gap-2 bg-slate-950/50 border border-white/10 text-slate-200 py-2.5 rounded-xl font-semibold hover:bg-amber-500/5 hover:border-amber-500/50 hover:text-amber-400 text-sm transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Unduh
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          copyToClipboard(recoveryCodes.join("\n"));
                          addNotification(
                            "Disalin",
                            "Kode pemulihan disalin ke clipboard.",
                            "success"
                          );
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-slate-950/50 border border-white/10 text-slate-200 py-2.5 rounded-xl font-semibold hover:bg-amber-500/5 hover:border-amber-500/50 hover:text-amber-400 text-sm transition-all"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        Salin Kode
                      </button>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => handleFinish2FASetup?.()}
                        className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                      >
                        Selesaikan Pengaturan
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- UI PENGATURAN QR CODE (YANG SUDAH ADA) ---
                  totp && (
                    <div>
                      <p className="text-sm text-slate-300 mb-4">
                        1. Pindai kode QR ini dengan aplikasi authenticator Anda
                        (misal: Google Authenticator, Authy).
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="p-4 bg-white rounded-lg">
                          <QRCode value={totp.toString()} size={160} />
                        </div>
                        <div className="w-full space-y-4">
                          <p className="text-sm text-slate-300">
                            Atau masukkan kunci pengaturan ini secara manual:
                          </p>
                          <div className="relative">
                            <input
                              type="text"
                              readOnly
                              value={totp.secret.base32}
                              className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-slate-300 font-mono text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(totp.secret.base32)
                              }
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-slate-300">
                            2. Masukkan kode 6 digit dari aplikasi Anda untuk
                            verifikasi.
                          </p>
                          <form
                            onSubmit={handleVerify2FASubmit}
                            className="space-y-4"
                          >
                            <div className="relative">
                              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="kode 6-digit"
                                value={twoFactorCode}
                                onChange={(e) =>
                                  setTwoFactorCode(e.target.value)
                                }
                                maxLength={6}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white tracking-[0.5em] text-center focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20"
                              >
                                Verifikasi & Aktifkan
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsSettingUp2FA(false)}
                                className="w-full bg-slate-950/50 border border-white/10 text-slate-300 py-2.5 rounded-xl font-semibold hover:bg-amber-500/5 hover:border-amber-500/50 hover:text-amber-400 text-sm transition-all"
                              >
                                Batal
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SettingsCard>

        <SettingsCard
          title="Active Sessions"
          description="This is a list of devices that have logged into your account. Revoke any sessions you do not recognize."
          footer={
            sessions.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleSignOutAllOtherSessions}
                  className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out all other sessions</span>
                </button>
              </div>
            )
          }
        >
          <ul className="divide-y divide-white/5 -mx-6">
            <AnimatePresence initial={false}>
              {sessions.map((session: Session) => (
                <motion.li
                  key={session.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, x: -300, transition: { duration: 0.3 } }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-amber-500/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {session.device.includes("Windows") ? (
                      <Monitor className="w-6 h-6 text-slate-400" />
                    ) : (
                      <Smartphone className="w-6 h-6 text-slate-400" />
                    )}
                    <div>
                      <p className="font-semibold text-white">
                        {session.device} &middot;{" "}
                        <span className="font-normal text-slate-300">
                          {session.browser}
                        </span>
                      </p>
                      <p className="text-sm text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> {session.location}{" "}
                        &middot;{" "}
                        {session.isCurrent ? (
                          <span className="text-amber-400 font-semibold">
                            Active now
                          </span>
                        ) : (
                          formatTimeAgo(session.lastActive)
                        )}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleSignOutSession(session.id)}
                      className="text-sm text-red-400 hover:text-red-300 hover:underline"
                    >
                      Sign out
                    </button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </SettingsCard>

        <SettingsCard
          title="Danger Zone"
          description="Permanently delete your account and all of its content. This action is irreversible."
          border="border-red-500/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-slate-400 mt-1">
                Once you delete your account, there is no going back.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete my account
            </button>
          </div>
        </SettingsCard>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};
