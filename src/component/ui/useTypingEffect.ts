import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 25, onComplete?: () => void) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;

    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return displayedText;
};