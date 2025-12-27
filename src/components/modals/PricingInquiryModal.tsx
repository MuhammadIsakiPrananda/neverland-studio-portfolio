import { useState, useEffect } from 'react';
import { X, Check, Mail, Phone, Building2, MessageSquare, Send, CheckCircle } from 'lucide-react';
import type { Theme, PricingPlan } from '../../types';

interface PricingInquiryModalProps {
  theme: Theme;
  onClose: () => void;
  selectedPlan: PricingPlan;
}

export default function PricingInquiryModal({ onClose, selectedPlan }: PricingInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  // Format number to Indonesian Rupiah in millions
  const formatRupiah = (amount: number): string => {
    if (amount === 0) return 'Custom';
    const millions = amount / 1000000;
    return `Rp ${millions} Juta`;
  };
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  
  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError(undefined);
    setEmailError(undefined);
    setPhoneError(undefined);
    
    // Validate
    let hasError = false;
    
    if (!name.trim()) {
      setNameError('Name is required');
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
    }
    
    if (hasError) return;
    
    // Show success message
    setSubmitted(true);
    
    // Close modal after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  // Success State
  if (submitted) {
    return (
      <>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
        
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-scale-in border border-slate-700/50">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600/20 border-2 border-green-500/50 mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                Request Submitted!
              </h3>
              
              <p className="text-slate-300 leading-relaxed mb-2">
                Thank you for choosing <span className="font-semibold text-blue-400">{selectedPlan.name}</span>!
              </p>
              
              <p className="text-sm text-slate-400">
                Our team will contact you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Form State
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div className="relative w-full max-w-2xl my-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-scale-in border border-slate-700/50">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[85vh] hide-scrollbar">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-700/50">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Get Started
              </h2>
              <p className="text-slate-400">
                Fill out the form below and we'll get back to you shortly
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Selected Plan Display */}
              <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-400 mb-1 font-medium">
                      Selected Package
                    </p>
                    <p className="text-lg font-bold text-white truncate">
                      {selectedPlan.name}
                    </p>
                    {selectedPlan.price > 0 && (
                      <p className="text-sm text-slate-400 mt-1">
                        {formatRupiah(selectedPlan.price)} • {selectedPlan.period}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Full Name <span className="text-red-400">*</span></span>
                  </div>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    nameError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/20'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="John Doe"
                />
                {nameError && <p className="mt-2 text-sm text-red-400 flex items-center gap-1"><X className="w-3 h-3" />{nameError}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address <span className="text-red-400">*</span></span>
                  </div>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    emailError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/20'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="john@example.com"
                />
                {emailError && <p className="mt-2 text-sm text-red-400 flex items-center gap-1"><X className="w-3 h-3" />{emailError}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number <span className="text-red-400">*</span></span>
                  </div>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border ${
                    phoneError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/20'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="+62 812-3456-7890"
                />
                {phoneError && <p className="mt-2 text-sm text-red-400 flex items-center gap-1"><X className="w-3 h-3" />{phoneError}</p>}
              </div>

              {/* Company Field (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Company Name <span className="text-slate-500 text-xs">(Optional)</span></span>
                  </div>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 focus:outline-none transition-all"
                  placeholder="Your Company"
                />
              </div>

              {/* Message Field (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Additional Message <span className="text-slate-500 text-xs">(Optional)</span></span>
                  </div>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 focus:outline-none transition-all resize-none hide-scrollbar"
                  placeholder="Tell us about your project or any specific requirements..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
