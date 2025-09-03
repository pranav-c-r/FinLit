import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementNotification = ({ achievement, onClose }) => {
  if (!achievement) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-[#0C291C] to-[#0A1F14] border border-[#F4E87C] p-4 rounded-xl shadow-lg max-w-md z-50"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F4E87C] to-[#F9A826] flex items-center justify-center text-3xl">
            {achievement.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-[#F4E87C] font-semibold text-lg">Achievement Unlocked!</h3>
            <p className="text-white font-medium">{achievement.title}</p>
            <p className="text-[#80A1C1] text-sm">{achievement.description}</p>
            <p className="text-[#F4E87C] text-sm mt-1">+{achievement.xpReward} XP</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#80A1C1] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5 }}
          className="h-1 bg-[#F4E87C] mt-3 rounded-full"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementNotification;