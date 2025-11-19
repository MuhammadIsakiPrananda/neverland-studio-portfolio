import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, RotateCcw } from 'lucide-react';
import { useChat } from './useChat';
import BotMessage from './BotMessage';
import ChatInput from './ChatInput';

interface ChatbotProps { 
  isOpen: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen }) => {
  const { messages, addMessage, isLoading, reset } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Always scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(reset, 300); // Delay to allow exit animation
    }
  }, [isOpen, reset]);

  const handleSuggestionClick = (suggestion: string) => {
    addMessage(suggestion);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/30 flex flex-col z-40 origin-bottom-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute w-full h-full bg-cyan-500 rounded-full blur-md opacity-40"></div>
                <Bot className="w-6 h-6 text-cyan-300 z-10" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Assistant</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={reset} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10" aria-label="Reset chat">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#06b6d4 #0f172a' }}>
            <div className="space-y-5">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';

                return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot ? (
                    <BotMessage message={msg} />
                  ) : (
                    <div className="max-w-xs px-4 py-2.5 rounded-xl text-sm bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-tr-none shadow-lg shadow-black/20">
                      <p>{msg.text}</p>
                    </div>
                  )}
                </motion.div>
                );
              })}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-3 justify-start"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="w-5 h-5 text-cyan-400" /></div>
                  <div className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 rounded-bl-none shadow-lg shadow-black/20">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            {messages.length <= 1 && !isLoading && (
              <div className="mb-3 flex flex-wrap gap-2">
                {["What services do you offer?", "Tell me about your process.", "How can I contact you?"].map(q => (
                  <button key={q} onClick={() => handleSuggestionClick(q)} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}
            <ChatInput onSendMessage={addMessage} isLoading={isLoading} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;