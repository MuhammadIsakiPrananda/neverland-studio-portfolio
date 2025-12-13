import { useState, useCallback, useEffect } from "react";
export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial message
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text:
          "Welcome to **Neverland Studio**.\n\n" +
          "We are dedicated to crafting exceptional digital experiences. How may we assist you today?\n" +
          "Feel free to ask about:\n- **Premium Services**\n- **Pricing & Plans**\n- **Contact Support**",
      },
    ]);
  }, []);

  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (
      lowerCaseMessage.includes("layanan") ||
      lowerCaseMessage.includes("service")
    ) {
      return "We offer premium **Web Development**, **UI/UX Design**, and **Digital Consultation** services tailored to elevate your brand.\n\nIs there anything else I can help you with?";
    }
    if (
      lowerCaseMessage.includes("harga") ||
      lowerCaseMessage.includes("pricing")
    ) {
      return "For exclusive pricing and tailored packages, please visit our **Pricing** page or contact us directly for a custom quote.\n\nWould you like to know about our services?";
    }
    if (
      lowerCaseMessage.includes("kontak") ||
      lowerCaseMessage.includes("contact")
    ) {
      return "You can reach our support team via email at **arlianto032@gmail.com** or by filling out the form on our **Contact** page.\n\nFeel free to ask if you need more details.";
    }
    return "I apologize, I didn't quite catch that. Could you please ask about our **Services**, **Pricing**, or **Contact** information?";
  };

  const addMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(), // Using timestamp for unique ID
      text,
      sender: "user",
    };

    // Add user message and set loading state
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot thinking and then add its response
    setTimeout(() => {
      const botResponseText = getBotResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  }, []);

  const reset = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text:
          "Welcome to **Neverland Studio**.\n\n" +
          "We are dedicated to crafting exceptional digital experiences. How may we assist you today?\n" +
          "Feel free to ask about:\n- **Premium Services**\n- **Pricing & Plans**\n- **Contact Support**",
      },
    ]);
    setIsLoading(false);
  }, []);

  return { messages, addMessage, isLoading, reset };
};
