import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X, MessageSquare, LogIn } from "lucide-react";
import { Logo, LanguageSwitcher } from "../ui";
import {
  navItems as originalNavItems,
  ProfileDropdown,
} from "@/features/landing";

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
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeOut", when: "afterChildren" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
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
      <header className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
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
            className="text-white z-[60] w-12 h-12 flex items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-full backdrop-blur-sm"
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
              className="fixed top-20 left-4 right-4 bg-gradient-to-br from-slate-900/80 to-black/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/30 z-50 overflow-hidden"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="p-6">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <motion.li key={item.name} variants={menuItemVariants}>
                      <button
                        onClick={() => {
                          handleNavClick(item.name);
                          setIsMenuOpen(false);
                        }}
                        className="relative w-full text-left text-lg font-medium tracking-wide transition-colors duration-300 px-4 py-3 rounded-lg group"
                      >
                        {activeSection === item.name && (
                          <motion.div
                            layoutId="mobile-active-pill"
                            className="absolute inset-0 bg-amber-500/10 rounded-lg"
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span
                          className={`relative flex items-center gap-4 transition-colors ${
                            activeSection === item.name
                              ? "text-amber-400"
                              : "text-slate-300 group-hover:text-white"
                          }`}
                        >
                          {item.icon}
                          {item.name}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
                {/* Language Switcher Section */}
                <motion.div
                  variants={menuItemVariants}
                  className="mt-6 pt-6 border-t border-slate-700/50 flex justify-center"
                >
                  <LanguageSwitcher />
                </motion.div>

                <motion.div
                  variants={menuItemVariants}
                  className="mt-6 pt-6 border-t border-slate-700/50"
                >
                  {isLoggedIn ? (
                    <div className="flex items-center justify-center gap-3">
                      {userProfile?.image ? (
                        <img
                          src={userProfile.image}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                          {userProfile?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p className="text-sm text-slate-400">
                        Signed in as{" "}
                        <span className="font-bold text-white">
                          {userProfile?.name}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={onLoginClick}
                      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-105"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login / Sign Up</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
