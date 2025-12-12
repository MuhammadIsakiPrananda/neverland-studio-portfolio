import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  X,
} from "lucide-react";
import Logo from "@/shared/components/ui/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const paymentMethods = [
    { name: "BCA", iconSrc: "/images/Logo BCA.webp", category: "bank" },
    { name: "Mandiri", iconSrc: "/images/Logo Mandiri.webp", category: "bank" },
    { name: "BNI", iconSrc: "/images/Logo BNI.webp", category: "bank" },
    { name: "BRI", iconSrc: "/images/Logo BRI.webp", category: "bank" },
    { name: "GoPay", iconSrc: "/images/Logo Gopay.webp", category: "ewallet" },
    { name: "OVO", iconSrc: "/images/Logo OVO.webp", category: "ewallet" },
    { name: "Dana", iconSrc: "/images/Logo DANA.webp", category: "ewallet" },
  ];

  const [modalContent, setModalContent] = useState<"privacy" | "terms" | null>(
    null
  );

  useEffect(() => {
    if (modalContent) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [modalContent]);

  return (
    <>
      <footer className="bg-slate-900/50 border-t border-slate-800/50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Logo & Socials */}
            <div className="space-y-6">
              <a href="#Home" className="inline-block mb-2">
                <Logo />
              </a>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex gap-3">
                {[
                  {
                    Icon: Github,
                    href: "https://github.com/MuhammadIsakiPrananda",
                  },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/in/muhammad-isaki-prananda-454668240/",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/tuanmudazaky_/",
                  },
                  { Icon: Twitter, href: "#" },
                ].map(({ Icon, href }, idx) => (
                  <a
                    href={href}
                    key={idx}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
                    aria-label={Icon.displayName || "Social media link"}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 & 3: Links & Payments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:col-span-2 lg:col-span-2 gap-8">
              <div>
                <h4 className="font-bold mb-6 text-lg tracking-wider">
                  {t("footer.servicesTitle")}
                </h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li>
                    <a
                      href="#Services"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.webDev")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Services"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.mobileDev")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Services"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.uiux")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Services"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.digitalMarketing")}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-lg tracking-wider">
                  {t("footer.companyTitle")}
                </h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li>
                    <a
                      href="#Process"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.ourProcess")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Team"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.ourTeam")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Portfolio"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.portfolio")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Contact"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {t("footer.contact")}
                    </a>
                  </li>
                </ul>
              </div>
              {/* Available Payments */}
              <div className="sm:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                  <h4 className="font-bold text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 whitespace-nowrap">
                    {t("footer.paymentMethods")}
                  </h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                </div>
                <p className="text-slate-400 text-xs mb-5 text-center font-medium">
                  {t("footer.paymentDescription")}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  {paymentMethods.map((method, index) => (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="group relative bg-white border-2 border-slate-200 rounded-lg p-2 aspect-[3/2] flex items-center justify-center transition-all duration-300 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105 overflow-hidden"
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/10 transition-all duration-500 group-hover:translate-x-full -translate-x-full"></div>

                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-300"></div>

                      {/* Logo container with better fit */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center p-1.5">
                        <img
                          src={method.iconSrc}
                          alt={`${method.name} payment`}
                          className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>

                      {/* Bottom indicator */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 rounded-t-full"></div>

                      {/* Category badge (optional - hidden by default) */}
                      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            method.category === "bank"
                              ? "bg-fresh-coral-500"
                              : "bg-green-500"
                          } shadow-lg`}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-800/50">
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <svg
                      className="w-4 h-4 text-premium-champagne-gold-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-500 font-medium">
                      Secure & encrypted transactions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-bold mb-6 text-lg tracking-wider">
                Stay Updated
              </h4>
              <p className="text-slate-400 text-sm mb-6">
                Subscribe to our newsletter for the latest news and updates.
              </p>
              <form className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-500 focus:ring-cyan-500/30 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 w-12 h-12 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:scale-105 hover:border-cyan-500 transition-all"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Neverland Studio. All rights
              reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <button
                onClick={() => setModalContent("privacy")}
                className="hover:text-cyan-400 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setModalContent("terms")}
                className="hover:text-cyan-400 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              <div className="flex-shrink-0 p-6 flex justify-between items-center border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white">
                  {modalContent === "privacy"
                    ? "Privacy Policy"
                    : "Terms of Service"}
                </h2>
                <button
                  onClick={() => setModalContent(null)}
                  className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>
              <div className="overflow-y-auto p-8">
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
                  {modalContent === "privacy" ? (
                    <>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                      <p>
                        Neverland Studio ("us", "we", or "our") operates the
                        neverlandstudio.my.id website (the "Service"). This page
                        informs you of our policies regarding the collection,
                        use, and disclosure of personal data when you use our
                        Service and the choices you have associated with that
                        data.
                      </p>
                      <h4>Information Collection and Use</h4>
                      <p>
                        We collect several different types of information for
                        various purposes to provide and improve our Service to
                        you. This may include, but is not limited to, email
                        address, first name and last name, and usage data.
                      </p>
                      <h4>Use of Data</h4>
                      <p>
                        Neverland Studio uses the collected data for various
                        purposes: to provide and maintain the Service, to notify
                        you about changes to our Service, to provide customer
                        care and support, and to monitor the usage of the
                        Service.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                      <p>
                        Please read these Terms of Service ("Terms", "Terms of
                        Service") carefully before using the
                        neverlandstudio.my.id website (the "Service") operated
                        by Neverland Studio ("us", "we", or "our").
                      </p>
                      <h4>Accounts</h4>
                      <p>
                        When you create an account with us, you must provide us
                        information that is accurate, complete, and current at
                        all times. Failure to do so constitutes a breach of the
                        Terms, which may result in immediate termination of your
                        account on our Service.
                      </p>
                      <h4>Intellectual Property</h4>
                      <p>
                        The Service and its original content, features and
                        functionality are and will remain the exclusive property
                        of Neverland Studio and its licensors. The Service is
                        protected by copyright, trademark, and other laws of
                        both the Indonesia and foreign countries.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
