import { motion } from "framer-motion";
import { Logo, NavItems, LanguageSwitcher } from "../ui";
import { ProfileDropdown } from "@/features/landing";
import { LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DesktopNavProps {
  isScrolled: boolean;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; image: string | null } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: (section?: string) => void;
  onQuoteClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  isScrolled,
  activeSection,
  handleNavClick,
  isLoggedIn,
  userProfile,
  onLoginClick,
  onLogout,
  onDashboardClick,
  onQuoteClick,
}) => {
  const { t } = useLanguage();

  return (
    <nav className="hidden md:flex fixed top-4 left-0 right-0 z-50 px-8">
      <motion.div
        className="mx-auto flex items-center gap-8 p-3 rounded-full transition-all duration-300"
        animate={{
          backgroundColor: isScrolled
            ? "rgba(24, 24, 27, 0.8)"
            : "rgba(24, 24, 27, 0.4)",
          borderColor: isScrolled
            ? "rgba(245, 158, 11, 0.3)"
            : "rgba(63, 63, 70, 0.3)", // Warna amber saat scroll
          boxShadow: isScrolled
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            : "none",
        }}
        style={{ borderWidth: "1px" }}
      >
        <a
          href="#Home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home");
          }}
        >
          <Logo />
        </a>
        <NavItems
          activeSection={activeSection}
          handleNavClick={handleNavClick}
        />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <>
              {userProfile && (
                <ProfileDropdown
                  userProfile={{ ...userProfile, avatar: userProfile.image }}
                  onLogout={onLogout}
                  onDashboardClick={onDashboardClick}
                />
              )}
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 tracking-wide transition-all hover:-translate-y-0.5 hover:bg-zinc-800/50 hover:border-amber-500/50 hover:text-white"
            >
              <LogIn className="w-4 h-4" />
              {t("nav.login")}
            </button>
          )}
          <button
            onClick={onQuoteClick}
            className="whitespace-nowrap rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40"
          >
            {t("hero.getStarted")}
          </button>
        </div>
      </motion.div>
    </nav>
  );
};

export default DesktopNav;
