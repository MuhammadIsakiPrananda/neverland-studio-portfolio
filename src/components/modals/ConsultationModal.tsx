import { useState, useEffect } from 'react';
import { X, Send, User, Mail, Phone, Building, MessageSquare, Briefcase, CheckCircle, Sparkles } from 'lucide-react';
import type { Theme } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { showSuccess } from '../common/ModernNotification';

interface Solution {
  title: string;
  subtitle: string;
  price: string;
  deliveryTime: string;
  color: string;
}

interface ConsultationModalProps {
  theme: Theme;
  solution: Solution;
  onClose: () => void;
}

export default function ConsultationModal({ theme, solution, onClose }: ConsultationModalProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(undefined);
    setEmailError(undefined);
    setPhoneError(undefined);

    // Validate
    let hasError = false;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      hasError = true;
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      hasError = true;
    }

    if (hasError) return;

    // Simulate submission
    console.log({ fullName, email, phone, company, projectType, message, solution: solution.title });
    setSubmitted(true);

    // Show modern notification with effects
    showSuccess(
      'Consultation Request Received! 🎉',
      'Our team will contact you within 24 hours. Check your email for confirmation.'
    );

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900/95 rounded-xl border border-slate-800 max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors group"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${solution.color} flex items-center justify-center flex-shrink-0`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">Free Consultation Request</h2>
                    <p className="text-sm text-slate-400">{solution.title}</p>
                  </div>
                </div>

                {/* Solution Info Summary */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs">Estimated Price:</span>
                    <span className="font-semibold text-blue-400">{solution.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs">Delivery Time:</span>
                    <span className="text-slate-300">{solution.deliveryTime}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${
                        nameError ? 'border-red-500/50' : 'border-slate-700/50'
                      } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {nameError && <p className="mt-1.5 text-xs text-red-400">{nameError}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${
                          emailError ? 'border-red-500/50' : 'border-slate-700/50'
                        } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${
                          phoneError ? 'border-red-500/50' : 'border-slate-700/50'
                        } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="+62 xxx-xxxx-xxxx"
                      />
                    </div>
                    {phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
                  </div>
                </div>

                {/* Company & Project Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Company */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Company Name <span className="text-slate-600">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Project Type <span className="text-slate-600">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                        }}
                      >
                        <option value="" className="bg-slate-900 text-slate-500">Select project type</option>
                        <option value="new-project" className="bg-slate-900 text-white">New Project</option>
                        <option value="improvement" className="bg-slate-900 text-white">Improvement/Upgrade</option>
                        <option value="maintenance" className="bg-slate-900 text-white">Maintenance</option>
                        <option value="consultation" className="bg-slate-900 text-white">Just Consultation</option>
                        <option value="other" className="bg-slate-900 text-white">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Project Details <span className="text-slate-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about your project requirements, goals, or any specific questions..."
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-sm text-slate-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Request Consultation
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Success State with Enhanced Animation
            <div className="p-12 text-center animate-scale-in">
              {/* Animated Success Icon */}
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce-slow">
                  <CheckCircle className="w-10 h-10 text-white animate-scale-in" />
                </div>
                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-blue-400 animate-pulse delay-100" />
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              </div>

              {/* Success Messages */}
              <h3 className="text-2xl font-bold text-white mb-3 animate-fade-in-up">
                Consultation Request Received! 🎉
              </h3>
              <div className="space-y-2 animate-fade-in-up delay-100">
                <p className="text-base text-slate-300 font-medium">
                  Our team will contact you within 24 hours
                </p>
                <p className="text-sm text-slate-400">
                  Check your email for confirmation
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 animate-fade-in delay-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Processing your request...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
