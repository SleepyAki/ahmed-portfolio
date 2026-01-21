import React from 'react';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, id, delay = 0 }) => {
  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.20 }} // Triggers when 20% visible
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        type: "spring", 
        bounce: 0.4,   // The "Bouncy" factor (0 = stiff, 0.8 = very bouncy)
        damping: 8     // Controls how fast it settles
      }}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 60,       // Start further down
          scale: 0.95  // Start slightly smaller (Zoom effect)
        },
        show: { 
          opacity: 1, 
          y: 0, 
          scale: 1 
        },
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

export default SectionWrapper;