import { useState, useCallback, useEffect } from 'react';
import type { Content } from '@google/generative-ai';
import { runChat } from './gemini';
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
  
  const addMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(), // Using timestamp for unique ID
      text,
      sender: 'user',
    };

    const newMessages: Message[] = [...messages, userMessage];

    // Add user message and set loading state
    setMessages(newMessages);
    setIsLoading(true);

    // Prepare history for Gemini API
    const history: Content[] = newMessages
      .filter(msg => msg.id !== 1) // Exclude initial greeting
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    try {
      const botResponseText = await runChat(history, text); // The `text` is the latest user message, which is now correctly part of the history
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, it seems there was a small issue. Please try again in a moment.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

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