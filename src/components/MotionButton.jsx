import React from 'react';
import { motion } from 'framer-motion';

const MotionButton = ({ onClick, isRecording }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition-colors duration-300 ${
        isRecording ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
      onClick={onClick}
    >
      {isRecording ? 'Stop' : 'Start Speaking'}
    </motion.button>
  );
};

export default MotionButton;
