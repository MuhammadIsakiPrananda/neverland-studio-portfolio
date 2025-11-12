import { useRef, useState } from 'react';
import { motion, useInView, type Variants, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

interface ContactSectionProps {
  isLoading: boolean;
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ isLoading, setSectionRef }) => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [selectedService, setSelectedService] = useState('');
  const [otherService, setOtherService] = useState('');

  return (
    <motion.section
      ref={(el) => {
        setSectionRef('Contact')(el);
        sectionRef.current = el;
      }}
      id="Contact"
      className="py-20 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate={!isLoading && isInView ? "visible" : "hidden"}
      variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"> 
          <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Get in Touch</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto"> 
            We're here to help. Reach out to us with any questions or to start your next project.
          </p>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8 md:p-12 mb-16">
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12" variants={containerVariants}>
          {/* Column 1: Contact Info */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {[
              { icon: <Mail className="w-6 h-6 text-white" />, title: "Email Us", lines: ["General Inquiries:", "arlianto032@gmail.com"], action: "Send an Email", href: "mailto:arlianto032@gmail.com" },
              { icon: <Phone className="w-6 h-6 text-white" />, title: "Call Us", lines: ["Mon-Fri from 9am to 5pm", "+628995257735"], action: "Call Now", href: "tel:+628995257735" },
              { 
                icon: <MapPin className="w-6 h-6 text-white" />, 
                title: "Visit Us", 
                lines: ["Jl. Ki Ageng Gribig No.28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139, Indonesia"], 
                action: "Get Directions", 
                href: "https://www.google.com/maps/search/?api=1&query=SMK+Negeri+6+Kota+Malang"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="leading-snug">
                  <h3 className="font-bold mb-1 text-white">{item.title}</h3> 
                  {item.lines.map((line, i) => <p key={i} className="text-slate-400">{line}</p>)}
                  <a 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 text-sm mt-2 hover:underline inline-block"
                  >{item.action}</a>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-gray-700/50"> 
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[
                  { Icon: Github, href: "#" },
                  { Icon: Linkedin, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Twitter, href: "#" },
              ].map(({ Icon }, idx) => (
                  <button
                    key={idx} 
                    className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contact Form */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors" placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors appearance-none" 
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <AnimatePresence>
                {selectedService === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <label className="block text-sm font-medium mb-2">Please specify the service</label>
                    <input type="text" value={otherService} onChange={(e) => setOtherService(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors" placeholder="e.g., SEO Optimization" required />
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows={5} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-teal-500 focus:ring-teal-500/50 focus:outline-none transition-colors resize-none" placeholder="Your message..." required />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div className="w-full h-[500px]" variants={itemVariants}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.243004389975!2d112.6717095!3d-7.973934999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62866628675a5%3A0xe475311940a81d11!2sSMK%20Negeri%206%20Kota%20Malang!5e0!3m2!1sen!2sid!4v1716278919591!5m2!1sen!2sid" 
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl border border-slate-800/50"
          ></iframe>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;