import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-full pl-4 pr-12 py-2.5 text-white focus:border-cyan-500 focus:ring-cyan-500/50 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !inputValue}>
            <Send className="w-4 h-4 text-white -mr-0.5" />
          </button>
    </form>
  );
};

export default ChatInput;