import React, { useState, useEffect } from 'react';
import TalkingMascot from './TalkingMascot';
import mascotVideoSrc from '../../assets/lottie json/guide.mp4';
import voiceAudioSrc from '../../assets/level11.mp3';

const MascotDialogue = ({ dialogues, currentDialogueIndex, onDialogueEnd }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [displayDialogue, setDisplayDialogue] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (dialogues && dialogues.length > 0 && currentDialogueIndex < dialogues.length) {
      const currentDialogue = dialogues[currentDialogueIndex];
      const currentText = currentDialogue.text;
      const audioSrc = currentDialogue.audioSrc;

      setCurrentAudio(audioSrc || null);
      setIsTypingComplete(false);

      if (charIndex < currentText.length) {
        const timeoutId = setTimeout(() => {
          setDisplayDialogue((prev) => prev + currentText.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timeoutId);
      } else {
        // Dialogue finished typing
        setIsTypingComplete(true);
        
        // Auto-progress to next dialogue after a delay
        const delayId = setTimeout(() => {
          if (currentDialogueIndex < dialogues.length - 1) {
            onDialogueEnd();
          }
        }, 3000); // Longer delay before auto-advancing to next dialogue
        return () => clearTimeout(delayId);
      }
    }
  }, [dialogues, currentDialogueIndex, charIndex, onDialogueEnd]);

  useEffect(() => {
    setDisplayDialogue('');
    setCharIndex(0);
    setIsTypingComplete(false);
  }, [currentDialogueIndex, dialogues]);

  return (
    <div className="mascot-dialogue-container bg-gradient-to-r from-[#252547] to-[#2d3748] p-4 rounded-xl shadow-lg border-2 border-[#374151] max-w-md mx-auto">
      <TalkingMascot
        mascotVideoSrc={mascotVideoSrc} // Default mascot video
        dialogue={displayDialogue}
        delay={2}
      />
    </div>
  );
};

export default MascotDialogue;