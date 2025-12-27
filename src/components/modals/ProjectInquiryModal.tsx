import { useState, useEffect } from 'react';
import { X, Send, User, Mail, Phone, Building, MessageSquare, Briefcase, CreditCard } from 'lucide-react';
import type { Theme } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
}

interface ProjectInquiryModalProps {
  theme: Theme;
  package: Package;
  onClose: () => void;
}

export default function ProjectInquiryModal({ theme, package: pkg, onClose }: ProjectInquiryModalProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [budgetError, setBudgetError] = useState<string | undefined>();
  const [messageError, setMessageError] = useState<string | undefined>();

  const isCustomPackage = pkg.price === 0;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Format number with thousand separators (dots for IDR)
  const formatBudget = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Add thousand separators (dots)
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatBudget(value);
    setBudget(formatted);
  };

  const calculateDiscountPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(undefined);
    setEmailError(undefined);
    setPhoneError(undefined);
    setBudgetError(undefined);
    setMessageError(undefined);

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

    // Validate budget for custom package
    if (isCustomPackage && !budget.trim()) {
      setBudgetError('Budget is required for custom projects');
      hasError = true;
    }

    // Validate project details
    if (!message.trim()) {
      setMessageError('Project details are required');
      hasError = true;
    }

    if (hasError) return;

    // Simulate submission
    console.log({ 
      fullName, 
      email, 
      phone, 
      company, 
      budget: budget.replace(/\./g, ''), // Remove dots for numeric value
      message, 
      package: pkg.id 
    });
    setSubmitted(true);

    // Auto close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">Start Your Project</h2>
                    <p className="text-sm text-slate-400">{pkg.name}</p>
                  </div>
                </div>

                {/* Package Info Summary */}
                {!isCustomPackage && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <CreditCard className="w-4 h-4" />
                      <div className="flex items-center gap-2">
                        {pkg.discount && (
                          <span className="text-slate-500 line-through text-xs">{formatPrice(pkg.price)}</span>
                        )}
                        <span className="font-semibold text-blue-400">
                          {formatPrice(calculateDiscountPrice(pkg.price, pkg.discount))}
                        </span>
                        {pkg.discount && (
                          <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold">
                            -{pkg.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                        placeholder="Enter Email Address"
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
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    {phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
                  </div>
                </div>

                {/* Company & Budget */}
                <div className={`grid ${isCustomPackage ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
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

                  {/* Budget - Only show for custom package */}
                  {isCustomPackage && (
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Your Budget (IDR) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={budget}
                          onChange={handleBudgetChange}
                          className={`w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${
                            budgetError ? 'border-red-500/50' : 'border-slate-700/50'
                          } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter your Budget"
                        />
                      </div>
                      {budget && !budgetError && (
                        <p className="mt-1.5 text-xs text-slate-400">
                          Rp {budget}
                        </p>
                      )}
                      {budgetError && <p className="mt-1.5 text-xs text-red-400">{budgetError}</p>}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Project Details <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${
                        messageError ? 'border-red-500/50' : 'border-slate-700/50'
                      } rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                      placeholder="Tell us about your project requirements, timeline, or any specific features..."
                    />
                  </div>
                  {messageError && <p className="mt-1.5 text-xs text-red-400">{messageError}</p>}
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
                    Submit Request
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Success State
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Request Submitted!</h3>
              <p className="text-sm text-slate-400 mb-2">We'll contact you within 24 hours</p>
              <p className="text-xs text-slate-500">Check your email for confirmation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
