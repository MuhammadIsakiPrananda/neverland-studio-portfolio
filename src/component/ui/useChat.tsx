import React, { useState, useCallback, useEffect } from 'react';
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
      id: Date.now(),
      sender: 'bot',
      text: "Hello! I'm the AI assistant for Neverland Studio. I'm here to help you with your questions.\n\n" +
            "You can ask me about:\n- Our **Services** (e.g., 'What services do you offer?')\n- **Pricing** information\n- How to **Contact** us"
    }]);
  }, []);
  
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('layanan') || lowerCaseMessage.includes('service')) {
      return "We offer **Web Development**, **UI/UX Design**, and **Digital Consultation** services.";
    }
    if (lowerCaseMessage.includes('harga') || lowerCaseMessage.includes('pricing')) {
      return "For pricing information, please visit our Pricing page or contact us for a custom quote.";
    }
    if (lowerCaseMessage.includes('kontak') || lowerCaseMessage.includes('contact')) {
      return "You can contact us via email at **arlianto032@gmail.com** or by filling out the form on our Contact page.";
    }
    return "I'm sorry, I don't understand that question. Try asking about services, pricing, or contact information.";
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
      id: Date.now(),
      sender: 'bot',
      text: "Hello! I'm the AI assistant for Neverland Studio. I'm here to help you with your questions.\n\n" +
            "You can ask me about:\n- Our **Services** (e.g., 'What services do you offer?')\n- **Pricing** information\n- How to **Contact** us"
    }]);
    setIsLoading(false);
  }, []);

  return { messages, addMessage, isLoading, reset };
};