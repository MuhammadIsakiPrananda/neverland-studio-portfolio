import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, X } from 'lucide-react';
import { useChat } from './useChat';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { messages, addMessage, isLoading, reset } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Reset chat when it's closed
    if (!isOpen) {
      setTimeout(reset, 300); // Delay to allow exit animation
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage(inputValue);
    setInputValue('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-40 origin-bottom-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Assistant</h3>
                <p className="text-xs text-green-400 flex items-center gap-1.5"> 
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2dd4bf #1e293b' }}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && <div className="w-7 h-7 flex-shrink-0 mb-1 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="w-4 h-4 text-cyan-400" /></div>}
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-lg' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-lg'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-7 h-7 flex-shrink-0 mb-1 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="w-4 h-4 text-cyan-400" /></div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-200 rounded-bl-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-full pl-4 pr-12 py-2.5 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !inputValue}>
                  <Send className="w-4 h-4 text-white -mr-0.5" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;