import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

interface ContactSectionProps {
  setSectionRef: (section: string) => (el: HTMLElement | null) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ setSectionRef }) => {
  const sectionVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section ref={setSectionRef('Contact')} id="Contact" className="py-20 px-4 sm:px-6 lg:px-8" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"> 
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">Get in Touch</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto"> 
            We're here to help. Reach out to us with any questions or to start your next project.
          </p>
        </div>
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 mb-16" variants={containerVariants}>
          {/* Column 1: Contact Info */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {[
              { icon: <Mail className="w-6 h-6 text-white" />, title: "Email Us", lines: ["General Inquiries:", "arlianto032@gmail.com"], action: "Send an Email" },
              { icon: <Phone className="w-6 h-6 text-white" />, title: "Call Us", lines: ["Mon-Fri from 9am to 5pm", "+628995257735"], action: "Call Now" },
              { icon: <MapPin className="w-6 h-6 text-white" />, title: "Visit Us", lines: ["Jl. Ki Ageng Gribig No.28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139, Indonesia"], action: "Get Directions" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="leading-snug">
                  <h3 className="font-bold mb-1 text-white">{item.title}</h3> 
                  {item.lines.map((line, i) => <p key={i} className="text-slate-400">{line}</p>)}
                  <button className="text-sky-400 text-sm mt-2 hover:underline">{item.action}</button>
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
                ].map(({ Icon, href }, idx) => (
                  <button
                    key={idx} 
                    className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-center hover:scale-110 hover:bg-sky-500/20 hover:border-sky-500/50 transition-all"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contact Form */}
          <motion.div className="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-8" variants={itemVariants}>  
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors" placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors appearance-none" required>
                  <option value="">Select a service</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>UI/UX Design</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows={5} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-sky-500 focus:ring-sky-500/50 focus:outline-none transition-colors resize-none" placeholder="Your message..." required />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-violet-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </motion.div>

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