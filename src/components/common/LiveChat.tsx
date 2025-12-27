import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Sparkles, ArrowUp, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

export default function LiveChat() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: t('liveChat.welcome'),
    sender: 'admin',
    timestamp: new Date(),
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setUnreadCount(0);
    }
  }, [isOpen]);

  const simulateAdminResponse = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        t('liveChat.defaultResponse'),
        'Our team typically responds within 2-3 minutes during business hours.',
        'Feel free to ask any questions about our services!',
        'We appreciate your patience. Someone will be with you shortly.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'admin',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    simulateAdminResponse();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };

  if (!isOpen) {
    return (
      <>
        {/* Back to Top Button - Left Side */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 lg:bottom-6 lg:left-6 z-50 group animate-fade-in"
            aria-label="Back to top"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 border border-slate-600/50 dark:border-slate-500/50 hover:border-slate-500 dark:hover:border-slate-400">
              <ArrowUp className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-slate-600/0 via-slate-500/10 to-slate-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 rounded-full bg-slate-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </button>
        )}

        {/* WhatsApp Button - Right Side, Above Chat */}
        <a
          href="https://wa.me/6281234567890?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[4.25rem] right-4 sm:bottom-[5.25rem] sm:right-5 lg:bottom-[5.75rem] lg:right-6 z-50 group"
          aria-label="Chat on WhatsApp"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105">
            <Phone className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" strokeWidth={2} />
            <span className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
          </div>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden sm:block">
            Chat via WhatsApp
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900 dark:border-l-slate-700"></div>
          </div>
        </a>

        {/* Live Chat Button - Right Side, Bottom */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-50 group"
          aria-label="Open chat"
        >
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
              {unreadCount}
            </div>
          )}
          
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105">
            <MessageCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white" strokeWidth={2} />
            <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
          </div>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden sm:block">
            Need help? Chat with us!
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900 dark:border-l-slate-700"></div>
          </div>
        </button>
      </>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] lg:w-[400px] max-w-md">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
        {/* Header - Enhanced with More Info */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-600">
                  <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{t('liveChat.title')}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                  <p className="text-blue-50 text-xs font-medium">{t('liveChat.online')} · {t('liveChat.subtitle')}</p>
                </div>
                <p className="text-blue-100/80 text-[10px] mt-0.5">Usually replies in minutes</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:rotate-90"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Quick Info Banner */}
        <div className="bg-blue-50 dark:bg-slate-800/50 border-b border-blue-100 dark:border-slate-700 px-4 py-2.5">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold">Live support available!</span> Our team is ready to help with questions about services, pricing, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area - Enhanced */}
        <div className="h-[420px] sm:h-[460px] overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950"
             style={{ 
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23cbd5e1\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
             }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {msg.sender === 'admin' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                )}
                
                <div className="flex flex-col">
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-1 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatTime(msg.timestamp)}</span>
                    {msg.sender === 'user' && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">· Sent</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Enhanced */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('liveChat.placeholder')}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-4 py-3 pr-10 rounded-xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                maxLength={500}
              />
              <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 dark:text-slate-500">
                {message.length}/500
              </div>
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white p-3.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
              aria-label={t('liveChat.send')}
            >
              <Send className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
            Press Enter to send · We typically respond in 2-3 minutes
          </p>
        </form>
      </div>
    </div>
  );
}
