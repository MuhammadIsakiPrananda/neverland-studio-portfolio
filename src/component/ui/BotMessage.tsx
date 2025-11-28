import React from 'react';
import { Bot } from 'lucide-react';
import type { Message } from './useChat';

interface BotMessageProps {
  message: Message;
}

const BotMessage: React.FC<BotMessageProps> = ({ message }) => {
  const displayText = message.text;

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      return part;
    });
  };

  return (
    <>
      <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-full bg-slate-800 flex items-center justify-center shadow-md"><Bot className="w-5 h-5 text-amber-400" /></div>
      <div className="max-w-xs px-4 py-2.5 rounded-xl text-sm shadow-md bg-slate-800 text-slate-300 rounded-bl-none">
        <div className="prose prose-sm prose-invert max-w-none leading-relaxed">{renderContent(displayText)}</div>
      </div>
    </>
  );
};

export default React.memo(BotMessage);