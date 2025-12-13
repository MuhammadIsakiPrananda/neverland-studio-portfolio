import { useRef, useEffect, useCallback } from "react";
import { useChatbot } from "../common/ChatbotContext";
import styles from "./Chatbot.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, RotateCcw } from "lucide-react";
import { useChat } from "./useChat";
import BotMessage from "./BotMessage";
import ChatInput from "./ChatInput";

interface ChatbotProps {
  isOpen: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen }) => {
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const { setIsChatOpen } = useChatbot();
  const { messages, addMessage, isLoading, reset } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always scroll to bottom when messages change
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-28 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-lg h-[75vh] max-h-[650px] bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/30 flex flex-col z-50 origin-bottom-right"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
            {/* Avatar & Status */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute w-full h-full bg-cyan-400 rounded-full blur-md opacity-30"></div>
                <Bot className="w-6 h-6 text-cyan-400 z-10" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-cyan-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            {/* Judul di tengah */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <h3 className="font-bold text-white text-lg tracking-tight">
                Live Chat
              </h3>
            </div>
            {/* Tombol kanan */}
            <div className="flex items-center gap-2 ml-auto mr-8">
              <button
                onClick={reset}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Reset chat"
                style={{ position: "relative", zIndex: 10 }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            {/* Tombol Close di pojok kanan atas, di luar flex */}
            <button
              onClick={() => setIsChatOpen && setIsChatOpen(false)}
              className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10 z-20"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={`flex-grow p-4 overflow-y-auto ${styles.chatScroll}`}>
            <div className="space-y-5">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex items-start gap-3 ${
                      isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isBot ? (
                      <BotMessage message={msg} />
                    ) : (
                      <div className="max-w-xs px-4 py-2.5 rounded-xl text-base md:text-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-none shadow-lg shadow-cyan-500/20">
                        <p className="leading-relaxed">{msg.text}</p>
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
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 rounded-bl-none shadow-lg shadow-black/20">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 bg-slate-400 rounded-full ${styles.pulseDot}`}
                      ></span>
                      <span
                        className={`w-1.5 h-1.5 bg-slate-400 rounded-full ${styles.pulseDot}`}
                      ></span>
                      <span
                        className={`w-1.5 h-1.5 bg-slate-400 rounded-full ${styles.pulseDot}`}
                      ></span>
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
                {[
                  "What services do you offer?",
                  "Tell me about your process.",
                  "How can I contact you?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestionClick(q)}
                    className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] text-slate-300 rounded-full transition-all duration-300"
                  >
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
