import { useState } from 'react';
import { MessageCircle, X, Phone, Mail, Send } from 'lucide-react';

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      action: () => window.open('https://wa.me/6281234567890', '_blank'),
      delay: 'delay-0',
    },
    {
      icon: Phone,
      label: 'Call Us',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      action: () => window.open('tel:+6281234567890', '_blank'),
      delay: 'delay-50',
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      action: () => window.open('mailto:info@neverlandstudio.com', '_blank'),
      delay: 'delay-100',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Options */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {contactOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              onClick={option.action}
              className={`group flex items-center gap-3 bg-gradient-to-r ${option.color} ${option.hoverColor} text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? option.delay : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-semibold whitespace-nowrap">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Send className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Ripple Effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
        )}
      </button>
    </div>
  );
}
