import { useState, useEffect } from 'react';

const glitchCharacters = '0123456789!@#$%^&*()';

export function useTextGlitch(text: string, glitchProbability: number = 0.1) {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGlitchedText(text.split('').map(char => 
        Math.random() < glitchProbability ? 
          glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)] : 
          char
      ).join(''));
    }, 100);

    return () => clearInterval(intervalId);
  }, [text, glitchProbability]);

  return glitchedText;
}
