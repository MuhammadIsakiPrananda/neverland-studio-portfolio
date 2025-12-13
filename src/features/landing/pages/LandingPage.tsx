"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";

// Feature: Landing
import {
  HeroSection,
  BenefitsSection,
  ServicesSection,
  ProcessSection,
  PortfolioSection,
  TeamSection,
  ReviewSection,
  PricingSection,
  FAQSection,
  CTASection,
  ContactSection,
  ReviewModal,
  JoinTeamModal,
  QuoteRequestModal,
} from "@/features/landing";

// Feature: Dashboard
import { UserDashboard } from "@/features/dashboard";

// Feature: Auth
import { useAuth } from "@/features/auth";
import type { UserProfile } from "@/features/auth";

// Shared Components
import {
  FloatingButtons,
  VideoModal,
  ChatbotProvider,
  LoadingScreen,
  AuroraBackground,
  ModalPortal,
} from "@/shared/components";

// Footer Component
import { Footer } from "@/shared/components";

// 1. Definisikan tipe untuk props yang akan diterima
interface LandingPageProps {
  onScheduleConsultationClick: () => void;
  isAuthModalOpen: boolean;
}
interface OutletContextType {
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  isProgrammaticScroll: React.MutableRefObject<boolean>;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onScheduleConsultationClick,
  isAuthModalOpen,
}) => {
  const { sectionRefs, setActiveSection, isProgrammaticScroll } =
    useOutletContext<OutletContextType>();

  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showVideo, setShowVideo] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [initialDashboardSection] = useState("profile");
  const { userProfile, logout, updateProfile } = useAuth();

  useEffect(() => {
    // Simulasi waktu loading
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Force scroll to top on every refresh
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      isLoading ||
      isReviewModalOpen ||
      isJoinTeamModalOpen ||
      isDashboardModalOpen ||
      isQuoteModalOpen ||
      isAuthModalOpen
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [
    isLoading,
    isReviewModalOpen,
    isJoinTeamModalOpen,
    isDashboardModalOpen,
    isQuoteModalOpen,
    isAuthModalOpen,
  ]);

  const handleProfileUpdate = (updatedUser: Partial<UserProfile>) => {
    // Panggil fungsi dari AuthContext untuk memperbarui profil
    updateProfile(updatedUser).catch((err) =>
      console.error("Update failed from LandingPage:", err)
    );
  };

  const handleAccountDelete = () => {
    // Panggil fungsi logout dari AuthContext dan tutup modal
    logout();
    setIsDashboardModalOpen(false);
    // Anda bisa menambahkan navigasi ke halaman utama jika perlu
  };

  const setSectionRef = (section: string) => (el: HTMLElement | null) => {
    sectionRefs.current[section] = el;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isProgrammaticScroll.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () =>
      Object.values(currentRefs).forEach((el) => {
        if (el) observer.unobserve(el);
      });
  }, [isProgrammaticScroll, setActiveSection]);

  return (
    <ChatbotProvider>
      <div className="bg-zinc-900 text-zinc-300 min-h-screen relative">
        <AuroraBackground />
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen />}
        </AnimatePresence>

        <main>
          <HeroSection
            isLoading={isLoading}
            isMenuOpen={false}
            setSectionRef={setSectionRef}
            setShowVideo={setShowVideo}
            onGetStartedClick={() => {
              /* Logika klik dipindahkan ke layout */
            }}
          />
          <BenefitsSection isLoading={isLoading} />
          <ServicesSection
            isLoading={isLoading}
            setSectionRef={setSectionRef}
          />
          <ProcessSection
            isLoading={isLoading}
            setSectionRef={setSectionRef}
            // Pastikan Anda meneruskan prop yang diperlukan jika ada, contoh:
            // onStepClick={() => {}}
          />
          <PortfolioSection
            isLoading={isLoading}
            setSectionRef={setSectionRef}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setShowVideo={setShowVideo}
          />
          <TeamSection
            isLoading={isLoading}
            setSectionRef={setSectionRef}
            onJoinTeamClick={() => setIsJoinTeamModalOpen(true)}
          />
          <PricingSection
            isLoading={isLoading}
            setSectionRef={setSectionRef}
            onGetStartedClick={() => setIsQuoteModalOpen(true)}
            onScheduleConsultationClick={onScheduleConsultationClick}
          />
          <ReviewSection
            setSectionRef={setSectionRef}
            onWriteReviewClick={() => setIsReviewModalOpen(true)}
          />
          <FAQSection isLoading={isLoading} />
          <CTASection isLoading={isLoading} />
          <ContactSection isLoading={isLoading} setSectionRef={setSectionRef} />
        </main>

        <Footer />
        <ModalPortal>
          <FloatingButtons />
          <VideoModal showVideo={showVideo} setShowVideo={setShowVideo} />
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            // onSubmit={handleReviewSubmit} // onSubmit tidak ada di ReviewModal, data dikirim via context/API internal
          />
          <JoinTeamModal
            isOpen={isJoinTeamModalOpen}
            onClose={() => setIsJoinTeamModalOpen(false)}
          />
          <AnimatePresence>
            {isDashboardModalOpen && userProfile && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <UserDashboard
                  user={{ ...userProfile, image: userProfile.image || null }}
                  onClose={() => setIsDashboardModalOpen(false)}
                  onUpdateProfile={handleProfileUpdate}
                  onDeleteAccount={handleAccountDelete}
                  initialSection={initialDashboardSection}
                />
              </div>
            )}
          </AnimatePresence>
          <QuoteRequestModal
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
          />
        </ModalPortal>

        {/* Custom Animations */}
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; } 
            100% { background-position: 0% 50%; } 
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .balance-text {
            text-wrap: balance;
          }

          @keyframes pulse-slow {
            50% { opacity: 0.6; }
          }
          .animate-pulse-slow { animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

          @keyframes pulse-slow-reverse { 50% { opacity: 0.6; } }
          .animate-pulse-slow-reverse { animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite; }

          .bg-radial-gradient-hero {
            background-image: radial-gradient(circle, rgba(10, 10, 10, 0) 50%, rgba(10, 10, 10, 1) 85%);
          }

          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll linear infinite;
          }

          /* Modern Scrollbar Styling */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(100, 116, 139, 0.7) transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(113, 113, 122, 0.5); /* zinc-500 with 50% opacity */
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(113, 113, 122, 0.8);
          }
        `}</style>
      </div>
    </ChatbotProvider>
  );
};

export default LandingPage;
