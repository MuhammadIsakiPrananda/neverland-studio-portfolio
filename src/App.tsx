import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/shared/types";
import { useAuth } from "@/features/auth";
import { AppRoutes } from "./routes/AppRoutes";
import { NotificationContainer } from "@/shared/components";

/**
 * Main App Component
 * Handles modal state and authentication logic
 */
function App() {
  // Modal States
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConsultationModalOpen, setConsultationModalOpen] = useState(false);
  const [isUserDashboardOpen, setUserDashboardOpen] = useState(false);
  const [dashboardInitialSection, setDashboardInitialSection] =
    useState("profile");

  // Hooks
  const auth = useAuth();
  const navigate = useNavigate();

  /**
   * Handle successful login from AuthModal (email/password)
   * For Google OAuth, login is handled by GoogleAuthSuccess component
   */
  const handleLoginSuccess = (
    data: { user: User; token: string },
    rememberMe: boolean
  ) => {
    console.log("✓ Login success:", data.user.email);

    // Prepare user profile with fallback avatar
    const userProfile: User = {
      ...data.user,
      username: data.user.username || data.user.email.split("@")[0],
      image:
        data.user.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.user.name
        )}&background=0d9488&color=fff&size=128`,
      role: data.user.role || "user",
    };

    // Login via AuthContext
    auth.login(userProfile, data.token, rememberMe);

    // Close modal
    setModalOpen(false);

    // Redirect based on role
    if (userProfile.role === "admin") {
      navigate("/dashboard");
    }
    // Regular users stay on homepage
  };

  /**
   * Handle dashboard navigation from user menu
   */
  const handleDashboardClick = (section: string = "profile") => {
    setDashboardInitialSection(section);
    setUserDashboardOpen(true);
  };

  /**
   * Prevent body scroll when modals are open
   */
  useEffect(() => {
    if (isModalOpen || isConsultationModalOpen || isUserDashboardOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen, isConsultationModalOpen, isUserDashboardOpen]);

  return (
    <>
      <AppRoutes
        isModalOpen={isModalOpen}
        isConsultationModalOpen={isConsultationModalOpen}
        isUserDashboardOpen={isUserDashboardOpen && !!auth.userProfile}
        dashboardInitialSection={dashboardInitialSection}
        onLoginClick={() => setModalOpen(true)}
        onDashboardClick={handleDashboardClick}
        onScheduleConsultationClick={() => setConsultationModalOpen(true)}
        onCloseModal={() => setModalOpen(false)}
        onCloseConsultation={() => setConsultationModalOpen(false)}
        onCloseUserDashboard={() => setUserDashboardOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <NotificationContainer />
    </>
  );
}

export default App;
