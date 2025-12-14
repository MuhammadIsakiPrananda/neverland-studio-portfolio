import React, { useState, useCallback, useEffect } from "react"; // NOSONAR
import { useNotification } from "./useNotification";
import * as OTPAuth from "otpauth";

// This data should ideally be fetched or live outside the component
const initialSessions = [
  {
    id: 1,
    isCurrent: true,
    device: "Windows",
    browser: "Chrome",
    location: "Malang, Indonesia",
    lastActive: new Date(),
    icon: <div className="w-6 h-6" />,
  },
  {
    id: 2,
    isCurrent: false,
    device: "iPhone 14 Pro",
    browser: "Safari",
    location: "Surabaya, Indonesia",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: <div className="w-6 h-6" />,
  }, // 2 hours ago
];
const loginHistory = [
  {
    id: 1,
    status: "success",
    device: "Windows, Chrome",
    ip: "103.22.11.5",
    time: "May 20, 2024, 10:30 PM",
  },
  {
    id: 2,
    status: "failed",
    device: "Unknown, Firefox",
    ip: "114.10.99.1",
    time: "May 20, 2024, 10:28 PM",
  },
];

// API Base URL helper
const getAPIBaseUrl = () => {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD
      ? "https://api.neverlandstudio.my.id"
      : "http://localhost:5000")
  );
};

// Get auth token helper
const getAuthToken = () => {
  // Match the key used by AuthContext
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const useSecurityState = () => {
  const [username, setUsername] = useState("current_user_name"); // This would be loaded from user data
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  // This would also be loaded from user data
  const [usernameChangeInfo, setUsernameChangeInfo] = useState({
    count: 0,
    lastChangeMonth: new Date().getMonth(),
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors] = useState<Record<string, string>>({});
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false); // This would be loaded from user data
  const [sessions, setSessions] = useState(initialSessions);
  const [totp, setTotp] = useState<OTPAuth.TOTP | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempSecret, setTempSecret] = useState<string | null>(null);
  
  const { addNotification } = useNotification();
  const [, setTimeNow] = useState(Date.now());

  // Load user 2FA status from API (not localStorage) to ensure accuracy per user
  useEffect(() => {
    const loadUser2FAStatus = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setIs2faEnabled(false);
          return;
        }

        // Fetch current user profile which includes twoFactorEnabled
        const userProfile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
        if (userProfile) {
          const user = JSON.parse(userProfile);
          // Use backend data as source of truth
          setIs2faEnabled(user.twoFactorEnabled || false);
        }
      } catch (error) {
        console.error("Error loading 2FA status:", error);
        setIs2faEnabled(false);
      }
    };

    // Load on mount
    loadUser2FAStatus();

    // Listen for storage changes (from other tabs or manual updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userProfile" || e.key === null) {
        loadUser2FAStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleCustomRefresh = () => {
      loadUser2FAStatus();
    };
    window.addEventListener("userProfileUpdated", handleCustomRefresh as EventListener);

    // Listen for logout event to clear 2FA state
    const handleLogout = () => {
      setIs2faEnabled(false);
      setTotp(null);
      setRecoveryCodes(null);
      setShowRecoveryCodes(false);
      setIsSettingUp2FA(false);
    };
    window.addEventListener("userLogout", handleLogout as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userProfileUpdated", handleCustomRefresh as EventListener);
      window.removeEventListener("userLogout", handleLogout as EventListener);
    };
  }, []);

  useEffect(() => {
    // This in a real app, this logic would run after fetching user data.
    // This resets the change count if the user visits the page in a new month.
    const now = new Date();
    const currentMonth = now.getMonth();
    if (usernameChangeInfo.lastChangeMonth !== currentMonth) {
      setUsernameChangeInfo({ count: 0, lastChangeMonth: currentMonth });
    }
  }, []); // Run only on mount

  useEffect(() => {
    // This interval will trigger a re-render every 30 seconds
    // causing the 'lastActive' time to be recalculated and updated in the UI.
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock handlers for demonstration
  const handlePasswordChangeSubmit = (e: React.FormEvent) => e.preventDefault();
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsernameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewUsername(e.target.value);
    setUsernameError(""); // Clear error on new input
  };

  const handleUsernameChangeSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setUsernameError("");

      // The check is simpler now because the useEffect above handles resetting the count for a new month.
      if (usernameChangeInfo.count >= 3) {
        const errorMessage =
          "Anda telah mencapai batas perubahan nama pengguna untuk bulan ini (3 kali).";
        setUsernameError(errorMessage);
        addNotification("Batas Tercapai", errorMessage, "error");
        return;
      }

      if (
        !newUsername ||
        newUsername.trim() === "" ||
        newUsername === username
      ) {
        const errorMessage =
          "Silakan masukkan nama pengguna baru yang berbeda.";
        setUsernameError(errorMessage);
        addNotification("Nama Pengguna Tidak Valid", errorMessage, "warning");
        return;
      }

      // --- In a real app, make an API call here to change the username and persist usernameChangeInfo ---
      const now = new Date();
      const currentMonth = now.getMonth();
      setUsername(newUsername);
      setUsernameChangeInfo({
        count: usernameChangeInfo.count + 1,
        lastChangeMonth: currentMonth,
      });
      addNotification(
        "Berhasil",
        `Nama pengguna berhasil diubah menjadi ${newUsername}.`,
        "success"
      );
      setNewUsername("");
    },
    [newUsername, username, usernameChangeInfo, addNotification]
  );

  /**
   * Enable 2FA - Call API to generate TOTP secret
   */
  const handleEnable2FA = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${getAPIBaseUrl()}/api/auth/2fa/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to enable 2FA");
      }

      // Create TOTP instance from the secret received from backend
      const newTotp = new OTPAuth.TOTP({
        issuer: "Neverland Studio",
        label: "Neverland",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(data.secret),
      });

      setTotp(newTotp);
      setTempSecret(data.secret); // Store secret temporarily for verification
      setIsSettingUp2FA(true);
      setShowRecoveryCodes(false);
      
      addNotification(
        "2FA Setup Started",
        "Scan the QR code with your authenticator app",
        "success"
      );
    } catch (error) {
      addNotification(
        "Error",
        error instanceof Error ? error.message : "Failed to enable 2FA",
        "error"
      );
      console.error("Enable 2FA error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  /**
   * Disable 2FA - Call API to disable 2FA
   */
  const handleDisable2FA = useCallback(async () => {
    // Prompt for password confirmation
    const password = window.prompt(
      "Please enter your password to disable 2FA:"
    );
    
    if (!password) {
      return; // User cancelled
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${getAPIBaseUrl()}/api/auth/2fa/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to disable 2FA");
      }

      setIs2faEnabled(false);
      setTotp(null);
      setTempSecret(null);
      setRecoveryCodes(null);
      setShowRecoveryCodes(false);
      setIsSettingUp2FA(false);

      // Update user profile in localStorage
      const userProfile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        user.twoFactorEnabled = false;
        const storage = localStorage.getItem("userProfile") ? localStorage : sessionStorage;
        storage.setItem("userProfile", JSON.stringify(user));
        
        // Trigger custom event for same-tab state update
        window.dispatchEvent(new Event("userProfileUpdated"));
      }

      addNotification(
        "2FA Disabled",
        "Two-factor authentication has been disabled.",
        "warning"
      );
    } catch (error) {
      addNotification(
        "Error",
        error instanceof Error ? error.message : "Failed to disable 2FA",
        "error"
      );
      console.error("Disable 2FA error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  /**
   * Verify 2FA code and enable 2FA
   */
  const handleVerify2FA = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!twoFactorCode || !tempSecret) {
        addNotification(
          "Error",
          "Please enter the verification code",
          "error"
        );
        return;
      }

      setIsLoading(true);
      try {
        const token = getAuthToken();
        const response = await fetch(`${getAPIBaseUrl()}/api/auth/2fa/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: twoFactorCode,
            secret: tempSecret,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Verification failed");
        }

        // Success! Show recovery codes
        setRecoveryCodes(data.recoveryCodes);
        setShowRecoveryCodes(true);
        setIs2faEnabled(true);
        setTwoFactorCode("");

        // Update user profile in localStorage
        const userProfile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
        if (userProfile) {
          const user = JSON.parse(userProfile);
          user.twoFactorEnabled = true;
          const storage = localStorage.getItem("userProfile") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify(user));
          
          // Trigger custom event for same-tab state update
          window.dispatchEvent(new Event("userProfileUpdated"));
        }

        addNotification(
          "2FA Enabled",
          "Two-factor authentication has been successfully enabled.",
          "success"
        );
      } catch (error) {
        addNotification(
          "Verification Failed",
          error instanceof Error ? error.message : "The code is invalid. Please try again.",
          "error"
        );
        console.error("Verify 2FA error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [twoFactorCode, tempSecret, addNotification]
  );

  /**
   * Finish 2FA setup - Clear recovery codes from state
   */
  const handleFinish2FASetup = useCallback(() => {
    setRecoveryCodes(null);
    setShowRecoveryCodes(false);
    setIsSettingUp2FA(false);
    setTempSecret(null);
    addNotification(
      "Setup Complete",
      "2FA has been successfully configured",
      "success"
    );
  }, [addNotification]);

  const handleSignOutSession = (id: number) =>
    setSessions((s) => s.filter((i) => i.id !== id));
  const handleSignOutAllOtherSessions = () =>
    setSessions((s) => s.filter((i) => i.isCurrent));

  return {
    username,
    newUsername,
    usernameError,
    usernameChangeInfo,
    handleUsernameInputChange,
    handleUsernameChangeSubmit,
    passwordData,
    handlePasswordInputChange,
    handlePasswordChangeSubmit,
    passwordErrors,
    isSettingUp2FA,
    setIsSettingUp2FA,
    twoFactorCode,
    setTwoFactorCode,
    is2faEnabled,
    totp,
    handleEnable2FA,
    handleDisable2FA,
    handleVerify2FA,
    handleFinish2FASetup,
    recoveryCodes,
    showRecoveryCodes,
    sessions,
    handleSignOutSession,
    handleSignOutAllOtherSessions,
    loginHistory,
    isLoading,
  };
};
