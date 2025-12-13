import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X, MessageSquare, LogIn } from "lucide-react";
import { Logo, LanguageSwitcher } from "../ui";
import {
  navItems as originalNavItems,
  ProfileDropdown,
} from "@/features/landing";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  userProfile: { name: string; email: string; image: string | null } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: (section?: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  handleNavClick,
  isLoggedIn,
  userProfile,
  onLoginClick,
  onLogout,
  onDashboardClick,
}) => {
  const { t } = useLanguage();

  const getNavTranslation = (name: string) => {
    const keyMap: Record<string, string> = {
      Home: "nav.home",
      Services: "nav.services",
      Process: "nav.process",
      Portfolio: "nav.portfolio",
      Team: "nav.team",
      Pricing: "nav.pricing",
      Reviews: "nav.testimonials",
      Contact: "nav.contact",
    };
    return t(keyMap[name] || name);
  };

  // Menambahkan "Reviews" ke dalam daftar navigasi secara dinamis, sama seperti di desktop nav
  const pricingIndex = originalNavItems.findIndex(
    (item) => item.name === "Pricing"
  );
  const navItems = [...originalNavItems];

  // Jika "Pricing" ditemukan, sisipkan "Reviews" setelahnya.
  if (pricingIndex !== -1) {
    navItems.splice(pricingIndex + 1, 0, {
      name: "Reviews",
      href: "/reviews",
      icon: <MessageSquare className="w-5 h-5" />,
    });
  }

  const menuContainerVariants: Variants = {
    // Varian yang benar dan modern
    hidden: {
      x: "100%",
      opacity: 0.5,
      transition: { duration: 0.2, ease: "easeOut", when: "afterChildren" },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
        <a
          href="#Home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home");
          }}
          className="z-50 group"
        >
          <Logo />
        </a>
        <div className="flex items-center gap-2">
          {isLoggedIn && userProfile && (
            <div className="z-50">
              <ProfileDropdown
                userProfile={{ ...userProfile, avatar: userProfile.image }}
                onLogout={onLogout}
                onDashboardClick={onDashboardClick}
              />
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white z-[60] w-12 h-12 flex items-center justify-center bg-zinc-800/50 border border-zinc-700/50 rounded-full backdrop-blur-sm"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[49]"
            />
            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-zinc-950/80 backdrop-blur-2xl border-l border-zinc-800 shadow-2xl shadow-black/30 z-50"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex h-full flex-col px-6 pt-24 overflow-y-auto">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <motion.li key={item.name} variants={menuItemVariants}>
                      <button
                        onClick={() => {
                          handleNavClick(item.name);
                          setIsMenuOpen(false);
                        }}
                        className="relative w-full text-left text-lg font-medium tracking-wide transition-colors duration-300 px-5 py-3 rounded-lg group"
                      >
                        {activeSection === item.name && (
                          <motion.div
                            layoutId="mobile-active-pill"
                            className="absolute inset-0 bg-amber-500/10 rounded-lg"
                            transition={{ type: "spring", duration: 0.5 }}
                          />
                        )}
                        <span
                          className={`relative flex items-center gap-4 transition-colors ${
                            activeSection === item.name
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-zinc-100"
                          }`}
                        >
                          {item.icon}
                          {getNavTranslation(item.name)}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
                {/* Footer Section */}
                <div className="mt-auto">
                  <motion.div
                    variants={menuItemVariants}
                    className="flex justify-center py-6"
                  >
                    <LanguageSwitcher />
                  </motion.div>

                  {isLoggedIn ? (
                    <motion.div variants={menuItemVariants}>
                      <div className="text-center text-sm text-zinc-400 p-4 border-t border-zinc-800">
                        Signed in as{" "}
                        <strong className="text-zinc-200">
                          {userProfile?.name}
                        </strong>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={menuItemVariants}
                      className="pt-6 border-t border-zinc-800"
                    >
                      <button
                        onClick={() => {
                          onLoginClick();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 transition-all transform hover:scale-105"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>{t("nav.login")}</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
