import { useMemo } from 'react';
import { motion } from 'framer-motion';

const StardustBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"></div>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
};

export default StardustBackground;