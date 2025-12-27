import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import type { Theme } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/apiService';
import { showSuccess, showError } from '../common/ModernNotification';

interface ContactPageProps {
  theme: Theme;
}

export default function ContactPage({ theme }: ContactPageProps) {
  const { t } = useLanguage();
  const isDark = theme === 'dark';
  const heroSection = useScrollReveal(0);
  const contactSection = useScrollReveal(0.1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit to backend API
      await api.post('/contact', formData);
      
      // Show success notification
      showSuccess(
        'Message Sent Successfully! ✨',
        'Thank you for contacting us! We\'ll get back to you soon.'
      );
      
      // Clear form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      // Show error notification
      showError(
        'Failed to Send Message ❌',
        error.response?.data?.message || 'Please try again later or contact us directly via email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-slate-950 min-h-screen -mt-20 pt-32 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-blue-500/25 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/4 left-1/2 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pb-12 md:pb-16 lg:pb-20">
        {/* Header Section */}
        <div 
          ref={heroSection.ref}
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            heroSection.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-6">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-semibold">{t('contact.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('contact.hero.title')}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </div>

        {/* Contact Section */}
        <div 
          ref={contactSection.ref}
          className={`grid md:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-100 ${
            contactSection.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Contact Info with Map */}
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {t('contact.info.title')}
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t('contact.info.email')}</p>
                    <p className="text-slate-400">erlianto032@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t('contact.info.phone')}</p>
                    <p className="text-slate-400">+62 899-5257-735</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t('contact.info.location')}</p>
                    <p className="text-slate-400">SMKN 6 Malang, Jl. Ki Ageng Gribig</p>
                  </div>
                </div>
              </div>

              {/* Integrated Google Maps */}
              <div className="border-t border-slate-700/50 pt-6">
                <h3 className="text-lg font-bold mb-3 text-white">
                  {t('contact.map.title')}
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-700/50">
                  <iframe 
                    src="https://maps.google.com/maps?q=SMKN+6+Malang,+Jl.+Ki+Ageng+Gribig,+Madyopuro,+Kedungkandang,+Malang&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SMKN 6 Malang Location"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {t('contact.form.title')}
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={t('contact.form.name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t('contact.form.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t('contact.form.subject')}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder={t('contact.form.message')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={loading}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>{t('contact.form.submit')}</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
