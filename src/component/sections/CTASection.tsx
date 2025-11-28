
import { useRef } from 'react';
import { motion, useInView, type Variants } from "framer-motion";
import { Rocket, Phone, Linkedin, Mail, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  isLoading: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isLoading }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" animate={!isLoading && isInView ? "visible" : "hidden"} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900/80 to-black/80 backdrop-blur-lg border border-slate-800/50 rounded-3xl p-8 sm:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div>
            <div className="inline-block p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
              <Rocket className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white"> 
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed"> 
              Let's build something amazing together. Contact us today for a free consultation and quote.
            </p>
            <button
              onClick={() => document.getElementById('Contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column: Contact Cards */} 
          <div className="space-y-6">
            {[
              { icon: <Mail className="w-6 h-6 text-amber-400" />, title: "Send us an Email", detail: "arlianto032@gmail.com", action: "Send Now", href: "mailto:arlianto032@gmail.com" },
              { icon: <Phone className="w-6 h-6 text-amber-400" />, title: "Schedule a Call", detail: "Book a 15-min intro call", action: "Schedule", href: "https://calendly.com/your-link" }, // Ganti dengan link Calendly Anda
              { icon: <Linkedin className="w-6 h-6 text-amber-400" />, title: "Connect on LinkedIn", detail: "Let's build a professional network.", action: "Connect", href: "https://www.linkedin.com/in/your-profile" }, // Ganti dengan link LinkedIn Anda
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                target={item.href?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-center justify-between hover:bg-slate-800/80 hover:border-amber-500/50 transition-all cursor-pointer group" 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.detail}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-2 transition-all ">
                  {item.action} <ArrowRight className="inline w-4 h-4" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;