import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const initialMessage: Message = {
  id: 1,
  text: "", // Will be set by t('chatbot.initial_message')
  sender: 'bot',
};

export const useChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial message after translation is loaded
  useEffect(() => {
    setMessages([{ ...initialMessage, text: t('chatbot.initial_message') }]);
  }, [t]);

  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('layanan') || lowerCaseMessage.includes('service')) {
      return t('chatbot.response_services');
    }
    if (lowerCaseMessage.includes('harga') || lowerCaseMessage.includes('pricing')) {
      return t('chatbot.response_pricing');
    }
    if (lowerCaseMessage.includes('kontak') || lowerCaseMessage.includes('contact')) {
      return t('chatbot.response_contact');
    }
    return t('chatbot.response_fallback');
  };

  const addMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  }, []);

  const reset = useCallback(() => {
    setMessages([{ ...initialMessage, text: t('chatbot.initial_message') }]);
    setIsLoading(false);
  }, []);

  return { messages, addMessage, isLoading, reset };
};