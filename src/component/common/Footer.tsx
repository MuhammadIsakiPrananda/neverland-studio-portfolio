import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Twitter, Instagram, Linkedin, Github, X } from 'lucide-react';
import Logo from '../ui/Logo'; // Pastikan path ini benar

const Footer = () => {
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    if (modalContent) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [modalContent]);

  return (
    <>
      <footer className="bg-slate-900/50 border-t border-slate-800/50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Logo & Socials */}
            <div className="space-y-6">
              <a href="#Home" className="inline-block mb-2"><Logo /></a>
              <p className="text-slate-400 text-sm leading-relaxed">
                Creating extraordinary digital experiences that inspire and engage. We transform ideas into innovative solutions that drive growth and success.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Github, href: "#" },
                  { Icon: Linkedin, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Twitter, href: "#" },
                ].map(({ Icon, href }, idx) => (
                  <a
                    href={href}
                    key={idx}
                    className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all" aria-label={Icon.displayName}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold mb-6 text-lg tracking-wider">Services</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#Services" className="hover:text-teal-400 transition-colors">Web Development</a></li>
                  <li><a href="#Services" className="hover:text-teal-400 transition-colors">Mobile Apps</a></li>
                  <li><a href="#Services" className="hover:text-teal-400 transition-colors">UI/UX Design</a></li>
                  <li><a href="#Services" className="hover:text-teal-400 transition-colors">Digital Marketing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-lg tracking-wider">Company</h4>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#Process" className="hover:text-teal-400 transition-colors">Our Process</a></li>
                  <li><a href="#Team" className="hover:text-teal-400 transition-colors">Our Team</a></li>
                  <li><a href="#Portfolio" className="hover:text-teal-400 transition-colors">Portfolio</a></li>
                  <li><a href="#Contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Newsletter */}
            <div>
              <h4 className="font-bold mb-6 text-lg tracking-wider">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-6">Subscribe to our newsletter for the latest news and updates.</p>
              <form className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" placeholder="Your Email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors text-sm" />
                </div>
                <button type="submit" className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform" aria-label="Subscribe to newsletter">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Neverland Studio. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <button onClick={() => setModalContent('privacy')} className="hover:text-teal-400 transition-colors">Privacy Policy</button>
              <button onClick={() => setModalContent('terms')} className="hover:text-teal-400 transition-colors">Terms of Service</button>
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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              <div className="flex-shrink-0 p-6 flex justify-between items-center border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white">
                  {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h2>
                <button onClick={() => setModalContent(null)} className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>
              <div className="overflow-y-auto p-8">
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-teal-400 hover:prose-a:text-teal-300">
                  {modalContent === 'privacy' ? (
                    <>
                      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                      <p>Neverland Studio ("us", "we", or "our") operates the neverlandstudio.my.id website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
                      <h4>Information Collection and Use</h4>
                      <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, email address, first name and last name, and usage data.</p>
                      <h4>Use of Data</h4>
                      <p>Neverland Studio uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to provide customer care and support, and to monitor the usage of the Service.</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                      <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the neverlandstudio.my.id website (the "Service") operated by Neverland Studio ("us", "we", or "our").</p>
                      <h4>Accounts</h4>
                      <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                      <h4>Intellectual Property</h4>
                      <p>The Service and its original content, features and functionality are and will remain the exclusive property of Neverland Studio and its licensors. The Service is protected by copyright, trademark, and other laws of both the Indonesia and foreign countries.</p>
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