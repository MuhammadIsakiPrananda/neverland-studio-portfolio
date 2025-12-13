import { motion } from "framer-motion";
import { User } from "lucide-react";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { navItems } from "@/features/landing/data/navItems.tsx";

interface MobileMenuProps {
  activeSection: string;
  handleNavClick: (section: string) => void;
  onLoginClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  activeSection,
  handleNavClick,
  onLoginClick,
}) => (
  <>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="md:hidden fixed top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-950 to-black backdrop-blur-xl z-40 pt-24"
    >
      <motion.div
        className="px-6 py-6 space-y-2"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => handleNavClick(item.name)}
            className={`flex items-center gap-4 w-full text-left transition-all duration-300 font-medium py-4 px-4 rounded-lg text-xl tracking-wide group ${
              activeSection === item.name
                ? "text-white bg-amber-500/10"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <span
              className={`transition-colors ${
                activeSection === item.name
                  ? "text-amber-400"
                  : "text-zinc-500 group-hover:text-amber-400"
              }`}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </motion.button>
        ))}
        <div className="border-t border-white/10 pt-6 mt-4 space-y-4">
          <motion.button
            onClick={onLoginClick}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex items-center gap-4 w-full text-left text-zinc-400 hover:text-amber-400 transition-colors font-medium py-3 text-xl tracking-wide"
          >
            <User className="w-6 h-6" /> Login
          </motion.button>
        </div>
        <motion.button
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          onClick={() => handleNavClick("Contact")}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-6 py-4 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 transition-all mt-8 font-semibold text-lg tracking-wide transform hover:scale-105"
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
    {/* LanguageSwitcher di luar panel menu mobile */}
    <div className="md:hidden fixed top-20 left-0 w-full z-50 flex justify-center bg-transparent pointer-events-auto">
      <LanguageSwitcher />
    </div>
  </>
);

export default MobileMenu;
