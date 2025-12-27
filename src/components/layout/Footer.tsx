import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Send,
  Shield,
  Lock,
  CheckCircle,
} from "lucide-react";
import logoImage from "../../assets/Profile Neverland Studio.jpg";
import type { Theme } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";
import PrivacyPolicyModal from "../modals/PrivacyPolicyModal";
import TermsModal from "../modals/TermsModal";
import CookiePolicyModal from "../modals/CookiePolicyModal";

interface FooterProps {
  theme: Theme;
  setCurrentPage: (page: string) => void;
}

export default function Footer({ theme, setCurrentPage }: FooterProps) {
  const { t } = useLanguage();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);

  return (
    <>
      <footer className="relative bg-slate-950 border-t border-slate-800/50 overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Company Info - Larger column */}
              <div className="lg:col-span-4">
                <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all duration-500" />
                    <img
                      src={logoImage}
                      alt="Neverland Studio Logo"
                      className="relative w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-400/70 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6"
                    />
                  </div>
                  <span className="font-bold text-2xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                    Neverland Studio
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                  {t('footer.description')}
                </p>

                {/* Social Links with Modern Design */}
                <div>
                  <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">
                    {t('footer.followUs')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        Icon: Facebook,
                        href: "#",
                        label: "Facebook",
                        color: "from-blue-600 to-blue-500",
                      },
                      {
                        Icon: Instagram,
                        href: "#",
                        label: "Instagram",
                        color: "from-pink-600 to-purple-600",
                      },
                      {
                        Icon: Twitter,
                        href: "#",
                        label: "Twitter",
                        color: "from-cyan-600 to-blue-600",
                      },
                      {
                        Icon: Linkedin,
                        href: "#",
                        label: "LinkedIn",
                        color: "from-blue-700 to-blue-500",
                      },
                      {
                        Icon: Github,
                        href: "#",
                        label: "GitHub",
                        color: "from-slate-700 to-slate-600",
                      },
                    ].map(({ Icon, href, label, color }, idx) => (
                      <a
                        key={idx}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        className="group relative p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50 text-slate-400 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg overflow-hidden"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        />
                        <Icon className="w-5 h-5 relative z-10" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  {t('footer.quickLinks')}
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { label: t('nav.about'), href: "#", onClick: () => setCurrentPage('about') },
                    { label: t('nav.team'), href: "#", onClick: () => setCurrentPage('team') },
                    { label: t('nav.skills'), href: "#", onClick: () => setCurrentPage('skills') },
                    { label: t('nav.awards'), href: "#", onClick: () => setCurrentPage('awards') },
                    { label: t('nav.portfolio'), href: "#", onClick: () => setCurrentPage('portfolio') },
                    { label: t('nav.testimonials'), href: "#", onClick: () => setCurrentPage('testimonials') },
                  ].map(({ label, href, onClick }) => (
                    <li key={label}>
                      <a
                        href={href}
                        onClick={(e) => { e.preventDefault(); onClick(); }}
                        className="group inline-flex items-center text-sm text-slate-400 hover:text-blue-400 transition-all duration-300 cursor-pointer"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="lg:col-span-3">
                <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  {t('footer.services')}
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { label: t('nav.itLearning'), onClick: () => setCurrentPage('it-learning') },
                    { label: t('nav.itSolutions'), onClick: () => setCurrentPage('it-solutions') },
                    { label: t('nav.pricing'), onClick: () => setCurrentPage('pricing') },
                    { label: t('nav.contact'), onClick: () => setCurrentPage('contact') },
                  ].map(({ label, onClick }) => (
                    <li key={label}>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onClick(); }}
                        className="group inline-flex items-center text-sm text-slate-400 hover:text-purple-400 transition-all duration-300 cursor-pointer"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-purple-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter - Modern Card */}
              <div className="lg:col-span-3">
                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group">
                  <h3 className="font-bold text-base mb-2 text-white flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                    {t('footer.newsletter')}
                  </h3>
                  <p className="text-slate-400 mb-4 text-xs">
                    {t('footer.newsletterDesc')}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder={t('footer.emailPlaceholder')}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                      aria-label="Subscribe to newsletter"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="py-8 border-t border-slate-800/50">
            <div className="text-center mb-8">
              <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
                {t('footer.paymentMethods')}
              </p>
              <p className="text-xs text-slate-600">{t('footer.securePayment')}</p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {/* Visa */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 48 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#1A1F71"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="16"
                    textAnchor="middle"
                  >
                    VISA
                  </text>
                </svg>
              </div>

              {/* Mastercard */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 40 20"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle cx="12" cy="10" r="8" fill="#EB001B" />
                  <circle cx="28" cy="10" r="8" fill="#FF5F00" />
                  <circle cx="20" cy="10" r="8" fill="#F79E1B" opacity="0.7" />
                </svg>
              </div>

              {/* PayPal */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 60 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#003087"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    PayPal
                  </text>
                </svg>
              </div>

              {/* Stripe */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 60 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#635BFF"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    Stripe
                  </text>
                </svg>
              </div>

              {/* GoPay */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 60 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#00AA13"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    GoPay
                  </text>
                </svg>
              </div>

              {/* OVO */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 48 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#4C3494"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="16"
                    textAnchor="middle"
                  >
                    OVO
                  </text>
                </svg>
              </div>

              {/* Dana */}
              <div className="group flex items-center justify-center px-4 py-3 rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-105">
                <svg
                  className="h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 60 16"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="12"
                    fill="#118EEA"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    DANA
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Security Badges - Simple & Clean & Responsive */}
          <div className="py-6 sm:py-8 border-t border-slate-800/50">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4">
              {[
                { icon: Shield, text: "SSL Secure", color: "text-green-500" },
                { icon: Lock, text: "Secure Payment", color: "text-blue-500" },
                {
                  icon: CheckCircle,
                  text: "Verified Security",
                  color: "text-purple-500",
                },
                {
                  icon: Shield,
                  text: "Money Back Guarantee",
                  color: "text-amber-500",
                },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg bg-slate-900/30 border border-slate-800/40 hover:border-slate-700/60 hover:bg-slate-900/50 transition-all duration-300"
                >
                  <badge.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${badge.color} transition-all duration-300 group-hover:scale-110`}
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                    {t(`footer.badges.${badge.text.toLowerCase().replace(/ /g, '')}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800/50 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-500">
                {t('footer.copyright')}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-xs">
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer relative group"
                >
                  {t('footer.privacyPolicy')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
                </button>
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer relative group"
                >
                  {t('footer.termsOfService')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
                </button>
                <button
                  onClick={() => setShowCookiePolicy(true)}
                  className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer relative group"
                >
                  {t('footer.cookiePolicy')}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal
          theme={theme}
          onClose={() => setShowPrivacyPolicy(false)}
        />
      )}
      {showTerms && (
        <TermsModal theme={theme} onClose={() => setShowTerms(false)} />
      )}
      {showCookiePolicy && (
        <CookiePolicyModal
          theme={theme}
          onClose={() => setShowCookiePolicy(false)}
        />
      )}
    </>
  );
}
