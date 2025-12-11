import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import type { UserProfile } from "@/features/auth";

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  activeSection: string;
  handleNavClick: (section: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  userProfile: UserProfile | null; // Tipe ini sudah benar, tidak perlu diubah.
  onDashboardClick: () => void;
}

const navItems = [
  "Home",
  "Services",
  "Process",
  "Portfolio",
  "Team",
  "Pricing",
  "Reviews",
  "Contact",
];

const MobileNav: React.FC<MobileNavProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  handleNavClick,
  isLoggedIn,
  onLoginClick,
  onLogout,
  userProfile,
  onDashboardClick,
}) => {
  const handleLinkClick = (section: string) => {
    handleNavClick(section);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] p-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full text-white"
        aria-label="Open menu"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed inset-0 bg-slate-900 z-50 flex flex-col p-6"
          >
            <nav className="flex-grow mt-12">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleLinkClick(item)}
                      className={`w-full text-left text-2xl font-semibold p-4 rounded-lg transition-colors ${
                        activeSection === item
                          ? "bg-slate-800 text-fresh-mint-300"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Actions */}
            <div className="border-t border-slate-700 pt-6">
              {isLoggedIn && userProfile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        userProfile.image ??
                        `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`
                      }
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {userProfile.name}
                      </p>
                      <button
                        onClick={() => {
                          onDashboardClick();
                          setIsMenuOpen(false);
                        }}
                        className="text-sm text-fresh-mint-400 hover:underline flex items-center gap-1"
                      >
                        <LayoutDashboard size={14} /> View Dashboard
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="p-3 bg-slate-800 rounded-lg text-red-400 hover:bg-red-500/20"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-premium-slate-blue-500 text-white font-bold py-3 px-4 rounded-lg text-lg"
                >
                  <LogIn size={20} />
                  Login / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
