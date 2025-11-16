import { useState, useCallback, useEffect } from 'react';
export type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial message
  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Hello! I'm the AI assistant for Neverland Studio. How can I help?",
      sender: 'bot',
    }]);
  }, []);
  
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('layanan') || lowerCaseMessage.includes('service')) {
      return "Kami menawarkan layanan **Web Development**, **UI/UX Design**, dan **Digital Consultation**.";
    }
    if (lowerCaseMessage.includes('harga') || lowerCaseMessage.includes('pricing')) {
      return "Untuk informasi harga, silakan kunjungi halaman Harga kami atau hubungi kami untuk penawaran khusus.";
    }
    if (lowerCaseMessage.includes('kontak') || lowerCaseMessage.includes('contact')) {
      return "Anda dapat menghubungi kami melalui email di **arlianto032@gmail.com** atau mengisi formulir di halaman Kontak.";
    }
    return "Maaf, saya tidak mengerti pertanyaan itu. Coba tanyakan tentang layanan, harga, atau kontak.";
  };

  const addMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(), // Using timestamp for unique ID
      text,
      sender: 'user',
    };

    // Add user message and set loading state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot thinking and then add its response
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
    setMessages([{
      id: 1,
      text: "Hello! I'm the AI assistant for Neverland Studio. How can I help?",
      sender: 'bot',
    }]);
    setIsLoading(false);
  }, []);

  return { messages, addMessage, isLoading, reset };
};