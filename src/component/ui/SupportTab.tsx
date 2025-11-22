import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { Loader, ChevronDown, BookOpen, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Komponen Accordion Item yang bisa digunakan kembali
const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="font-medium text-white">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-300 text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SupportTabContent: React.FC = () => {
  const [isSending, setIsSending] = useState(false);

  const faqs = [
    { q: 'How do I change my password?', a: 'You can change your password in the "Security" tab. You will need to enter your current password and then your new password.' },
    { q: 'How do I update my payment method?', a: 'Navigate to the "Account & Billing" tab. From there, you can select a new payment method and save your changes.' },
    { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can manage your subscription from the "Account & Billing" tab. Cancellations will be effective at the end of the current billing cycle.' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      // Tambahkan notifikasi sukses di sini
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <SettingsCard
        title="Frequently Asked Questions"
        description="Find answers to common questions about our platform."
      >
        <div>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Contact Support"
        description="Can't find an answer? Our support team is here to help."
        footer={
          <div className="flex justify-end">
            <button onClick={handleSendMessage} disabled={isSending} className="flex items-center gap-2 py-2 px-5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
              {isSending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="font-semibold">{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Subject</label>
            <input type="text" placeholder="e.g., Issue with billing" className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-400">How can we help?</label>
            <textarea rows={5} placeholder="Describe your issue in detail..." className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 mt-1 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-colors resize-none" />
          </div>
        </form>
      </SettingsCard>

      <SettingsCard
        title="Knowledge Base"
        description="Explore our comprehensive documentation for in-depth guides and tutorials."
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-300">Find everything you need to become an expert.</p>
          <button className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors">
            <BookOpen className="w-4 h-4" /> Visit Documentation
          </button>
        </div>
      </SettingsCard>
    </div>
  );
};