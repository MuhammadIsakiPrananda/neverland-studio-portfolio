import { Mail, ArrowRight, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Logo from '../ui/Logo'; // Pastikan path ini benar

const Footer = () => {
  return (
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
                  className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-sky-500/20 hover:border-sky-500/50 transition-all" aria-label={Icon.displayName}
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
                <li><a href="#Services" className="hover:text-sky-400 transition-colors">Web Development</a></li>
                <li><a href="#Services" className="hover:text-sky-400 transition-colors">Mobile Apps</a></li>
                <li><a href="#Services" className="hover:text-sky-400 transition-colors">UI/UX Design</a></li>
                <li><a href="#Services" className="hover:text-sky-400 transition-colors">Digital Marketing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg tracking-wider">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#Process" className="hover:text-sky-400 transition-colors">Our Process</a></li>
                <li><a href="#Team" className="hover:text-sky-400 transition-colors">Our Team</a></li>
                <li><a href="#Portfolio" className="hover:text-sky-400 transition-colors">Portfolio</a></li>
                <li><a href="#Contact" className="hover:text-sky-400 transition-colors">Contact</a></li>
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
                <input type="email" placeholder="Your Email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors text-sm" />
              </div>
              <button type="submit" className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-sky-500 to-violet-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform" aria-label="Subscribe to newsletter">
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
            <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;