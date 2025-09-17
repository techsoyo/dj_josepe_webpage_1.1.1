'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Componente de texto animado con efectos de escritura y neon
 */
export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  typewriter = false,
  neonEffect = false
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typewriter && text) {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }
      }, 100 + delay * 1000);

      return () => clearTimeout(timer);
    } else {
      setDisplayText(text);
    }
  }, [currentIndex, text, typewriter, delay]);

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const neonStyle = neonEffect ? {
    textShadow: `
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px #ff6b6b,
      0 0 35px #ff6b6b,
      0 0 40px #ff6b6b
    `,
    animation: 'neonPulse 2s ease-in-out infinite alternate'
  } : {};

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className={className}
        style={neonStyle}
      >
        {typewriter ? (
          <>
            {displayText}
            {currentIndex < text.length && (
              <span
                style={{
                  animation: 'blink 1s infinite',
                  marginLeft: '2px'
                }}
              >
                |
              </span>
            )}
          </>
        ) : (
          text
        )}
      </motion.div>

      <style jsx>{`
        @keyframes neonPulse {
          from {
            text-shadow: 
              0 0 5px currentColor,
              0 0 10px currentColor,
              0 0 15px currentColor,
              0 0 20px #ff6b6b,
              0 0 35px #ff6b6b,
              0 0 40px #ff6b6b;
          }
          to {
            text-shadow: 
              0 0 2px currentColor,
              0 0 5px currentColor,
              0 0 8px currentColor,
              0 0 12px #4ecdc4,
              0 0 18px #4ecdc4,
              0 0 25px #4ecdc4;
          }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

