import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Headset } from 'lucide-react';
import { useChat } from './useChat';
import BotMessage from './BotMessage';
import ChatInput from './ChatInput';

interface ChatbotProps { isOpen: boolean; }

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
    // Reset chat state only when the chatbot is closed
    if (!isOpen) {
      setTimeout(reset, 300); // Delay to allow exit animation
    }
  }, [isOpen, reset]);

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
                <Headset className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Assistant</h3>
                <p className="text-xs text-green-400 flex items-center gap-1.5"> 
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2dd4bf #1e293b' }}>
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
                    <div className="max-w-xs px-4 py-2.5 rounded-xl text-sm shadow-md bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-none">
                      <p>{msg.text}</p>
                    </div>
                  )}
                </motion.div>
                );
              })}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-full bg-slate-800 flex items-center justify-center"><Bot className="w-5 h-5 text-cyan-400" /></div>
                  <div className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 rounded-bl-none">
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
          <ChatInput onSendMessage={addMessage} isLoading={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;