import { motion } from "framer-motion";
import { navItems as originalNavItems } from "@/features/landing/data/navItems.tsx";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItemsProps {
  activeSection: string;
  handleNavClick: (section: string) => void;
}

const NavItems: React.FC<NavItemsProps> = ({
  activeSection,
  handleNavClick,
}) => {
  const { t } = useLanguage();
  // Menambahkan "Reviews" ke dalam daftar navigasi secara dinamis
  const pricingIndex = originalNavItems.findIndex(
    (item) => item.name === "Pricing"
  );
  const navItems = [...originalNavItems];

  // Jika "Pricing" ditemukan, sisipkan "Reviews" setelahnya.
  if (pricingIndex !== -1) {
    navItems.splice(pricingIndex + 1, 0, {
      name: "Reviews",
      href: "/reviews",
      icon: <MessageSquare className="w-4 h-4" />,
    });
  }

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

  return (
    <div className="hidden lg:flex items-center gap-1 transition-all duration-300">
      {navItems.map((item) => (
        <div key={item.name} className="relative group">
          <button
            onClick={() => handleNavClick(item.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
              activeSection === item.name ? "text-white" : "text-slate-300"
            }`}
          >
            {item.icon} {getNavTranslation(item.name)}
          </button>
          {activeSection === item.name && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50 ring-offset-2 ring-offset-slate-900"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {/* Efek Hover Pill untuk item yang tidak aktif. Hanya muncul jika item tidak aktif. */}
          {activeSection !== item.name && (
            <div className="absolute inset-0 bg-slate-800/80 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavItems;
