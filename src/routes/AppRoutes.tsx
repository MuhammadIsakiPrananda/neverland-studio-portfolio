import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { User } from "@/shared/types";

// Route Guards
import {
  ProtectedRoute,
  AdminRoute,
} from "@/shared/components/common/RouteGuards";

// Pages - Public
import { LandingPage, LandingPageLayout } from "@/features/landing";
import AccessDenied from "@/features/auth/pages/AccessDenied";
import AuthSuccess from "@/features/auth/pages/AuthSuccess";

// Pages - Dashboard
import DashboardOverview from "@/features/dashboard/pages/DashboardOverview";
import Projects from "@/features/dashboard/pages/Projects";
import Team from "@/features/dashboard/pages/Team";
import Settings from "@/features/dashboard/pages/Settings";
import CalendarPage from "@/features/dashboard/pages/CalendarPage";
import Analytics from "@/features/dashboard/pages/Analytics";
import Applicants from "@/features/dashboard/pages/Applicants";
import Collaborations from "@/features/dashboard/pages/Collaborations";
import DashboardLayout from "@/features/dashboard/pages/DashboardLayout";
import ReviewsPage from "@/features/dashboard/pages/ReviewsPage";

// Components
import { Placeholder } from "@/shared/components/common/Placeholder";

// Lazy loaded modals
const AuthModal = lazy(() => import("@/features/auth/components/AuthModal"));
const ConsultationModal = lazy(
  () => import("@/features/consultation/components/ConsultationModal")
);
const UserDashboardWrapper = lazy(
  () => import("@/features/dashboard/components/UserDashboardWrapper")
);

/**
 * Loading fallback component
 */
const ModalFallback = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
);

interface AppRoutesProps {
  isModalOpen: boolean;
  isConsultationModalOpen: boolean;
  isUserDashboardOpen: boolean;
  dashboardInitialSection: string;
  onLoginClick: () => void;
  onDashboardClick: (section?: string) => void;
  onScheduleConsultationClick: () => void;
  onCloseModal: () => void;
  onCloseConsultation: () => void;
  onCloseUserDashboard: () => void;
  onLoginSuccess: (
    data: { user: User; token: string },
    rememberMe: boolean
  ) => void;
}

export const AppRoutes = ({
  isModalOpen,
  isConsultationModalOpen,
  isUserDashboardOpen,
  dashboardInitialSection,
  onLoginClick,
  onDashboardClick,
  onScheduleConsultationClick,
  onCloseModal,
  onCloseConsultation,
  onCloseUserDashboard,
  onLoginSuccess,
}: AppRoutesProps) => {
  return (
    <>
      <Routes>
        {/* ============================================
            PUBLIC ROUTES
            ============================================ */}

        {/* OAuth Success Callback */}
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* Access Denied Page */}
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Landing Page with Layout */}
        <Route
          element={
            <LandingPageLayout
              onLoginClick={onLoginClick}
              onDashboardClick={onDashboardClick}
            />
          }
        >
          <Route
            path="/"
            element={
              <LandingPage
                onScheduleConsultationClick={onScheduleConsultationClick}
                isAuthModalOpen={isModalOpen}
              />
            }
          />
        </Route>

        {/* ============================================
            PROTECTED ROUTES - Requires Authentication
            ============================================ */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Dashboard Overview - Available to all authenticated users */}
            <Route index element={<DashboardOverview />} />

            {/* Settings & Calendar - Available to all authenticated users */}
            <Route path="settings" element={<Settings />} />
            <Route path="calendar" element={<CalendarPage />} />

            {/* ============================================
                ADMIN ONLY ROUTES
                ============================================ */}
            <Route element={<AdminRoute />}>
              <Route path="analytics" element={<Analytics />} />

              {/* Inbox Routes */}
              <Route path="inbox">
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="collaborations" element={<Collaborations />} />
              </Route>

              {/* Projects & Team Management */}
              <Route path="projects" element={<Projects />} />
              <Route path="team" element={<Team />} />

              {/* Website Settings */}
              <Route
                path="settings/website/general"
                element={<Placeholder title="Settings: Website General" />}
              />
            </Route>
          </Route>
        </Route>

        {/* ============================================
            404 - Catch All Route
            ============================================ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ============================================
          MODALS - Lazy Loaded
          ============================================ */}

      <Suspense fallback={<ModalFallback />}>
        {/* Auth Modal - Email/Password & Social Login */}
        <AuthModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          onLoginSuccess={onLoginSuccess}
        />

        {/* Consultation Booking Modal */}
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={onCloseConsultation}
        />

        {/* User Dashboard Modal */}
        {isUserDashboardOpen && (
          <UserDashboardWrapper
            onClose={onCloseUserDashboard}
            initialSection={dashboardInitialSection}
            key={dashboardInitialSection}
          />
        )}
      </Suspense>
    </>
  );
};
