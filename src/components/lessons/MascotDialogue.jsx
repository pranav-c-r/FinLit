import React, { useState, useEffect } from 'react';
import TalkingMascot from './TalkingMascot';
import mascotVideoSrc from '../../assets/malelawyer.mp4';
import voiceAudioSrc from '../../assets/level11.mp3';

const MascotDialogue = ({ dialogues, currentDialogueIndex, onDialogueEnd }) => {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [displayDialogue, setDisplayDialogue] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (dialogues && dialogues.length > 0 && currentDialogueIndex < dialogues.length) {
      const currentDialogue = dialogues[currentDialogueIndex];
      const currentText = currentDialogue.text;
      const audioSrc = currentDialogue.audioSrc;

      setCurrentAudio(audioSrc || null);

      if (charIndex < currentText.length) {
        const timeoutId = setTimeout(() => {
          setDisplayDialogue((prev) => prev + currentText.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timeoutId);
      } else {
        // Dialogue finished typing, call onDialogueEnd after a short delay
        const delayId = setTimeout(() => {
          onDialogueEnd();
        }, 1000); // Delay before moving to next dialogue
        return () => clearTimeout(delayId);
      }
    }
  }, [dialogues, currentDialogueIndex, charIndex, onDialogueEnd]);

  useEffect(() => {
    setDisplayDialogue('');
    setCharIndex(0);
  }, [currentDialogueIndex, dialogues]);

  return (
    <div className="mascot-dialogue-container">
      <TalkingMascot
        mascotVideoSrc={mascotVideoSrc} // Default mascot video
        voiceAudioSrc={voiceAudioSrc}
        dialogue={displayDialogue}
      />
    </div>
  );
};

export default MascotDialogue;