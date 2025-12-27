import { useState, useEffect } from 'react';
import { X, Send, User, Mail, Phone, Calendar, Clock, BookOpen, CreditCard } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Theme } from '../../types';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  discountPrice: string;
  duration: string;
  level: string;
  color: string;
}

interface EnrollmentModalProps {
  theme: Theme;
  course: Course;
  onClose: () => void;
}

export default function EnrollmentModal({ theme, course, onClose }: EnrollmentModalProps) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDay, setPreferredDay] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Error states
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
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
    console.log({ fullName, email, phone, preferredDay, preferredTime, message, course: course.id });
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
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-1">Enroll in Course</h2>
                    <p className="text-sm text-slate-400">{course.title}</p>
                  </div>
                </div>

                {/* Course Info Summary */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CreditCard className="w-4 h-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 line-through text-xs">{course.price}</span>
                      <span className="font-semibold text-blue-400">{course.discountPrice}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold">80% OFF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                    {course.level}
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

                {/* Preferred Schedule - Day & Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Preferred Day */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Preferred Day <span className="text-slate-600">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <select
                        value={preferredDay}
                        onChange={(e) => setPreferredDay(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                        }}
                      >
                        <option value="" className="bg-slate-900 text-slate-500">Select day</option>
                        <option value="monday" className="bg-slate-900 text-white">Monday</option>
                        <option value="tuesday" className="bg-slate-900 text-white">Tuesday</option>
                        <option value="wednesday" className="bg-slate-900 text-white">Wednesday</option>
                        <option value="thursday" className="bg-slate-900 text-white">Thursday</option>
                        <option value="friday" className="bg-slate-900 text-white">Friday</option>
                        <option value="saturday" className="bg-slate-900 text-white">Saturday</option>
                        <option value="sunday" className="bg-slate-900 text-white">Sunday</option>
                        <option value="weekdays" className="bg-slate-900 text-white">Weekdays (Mon-Fri)</option>
                        <option value="weekend" className="bg-slate-900 text-white">Weekend (Sat-Sun)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Preferred Time <span className="text-slate-600">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Additional Notes <span className="text-slate-600">(Optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Any questions or special requests?"
                  />
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
                    Submit Enrollment
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
              <h3 className="text-lg font-semibold text-white mb-1">Enrollment Submitted!</h3>
              <p className="text-sm text-slate-400 mb-2">We'll contact you shortly</p>
              <p className="text-xs text-slate-500">Check your email for confirmation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
