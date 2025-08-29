import React, { useState, useEffect, useRef } from 'react';
import TalkingMascot from './TalkingMascot';
import videoSrc from '../../assets/oldman.mp4'
const ParentDialogue = ({
  dialogues,
  currentDialogueIndex,
  onDialogueEnd,
  character = 'father',
  videoSrc
}) => {
  const [displayDialogue, setDisplayDialogue] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechSynthesisRef = useRef(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );
  const videoRef = useRef(null);

  // Speak the text using appropriate male voice
  const speakText = (text) => {
    if (!speechSynthesisRef.current || !text) return;

    speechSynthesisRef.current.cancel(); // Cancel previous speech
    const utterance = new SpeechSynthesisUtterance(text);

    const handleVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const preferredVoice =
        availableVoices.find((voice) =>
          ['daniel', 'david', 'james', 'male'].some((v) =>
            voice.name.toLowerCase().includes(v)
          )
        ) ||
        availableVoices.find((voice) => !voice.name.toLowerCase().includes('female'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.pitch = 0.8;
      utterance.rate = 0.9;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesisRef.current.speak(utterance);
    };

    if (speechSynthesisRef.current.getVoices().length > 0) {
      handleVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        handleVoices();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  // Handle typing + speech per dialogue
  useEffect(() => {
    if (!dialogues || currentDialogueIndex >= dialogues.length) return;

    const currentDialogue = dialogues[currentDialogueIndex];
    const text = currentDialogue.text;

    // Reset state
    setDisplayDialogue('');
    setCharIndex(0);
    setIsTypingComplete(false);

    // Cancel speech if any
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }

    speakText(text);
  }, [currentDialogueIndex, dialogues]);

  // Typing effect
  useEffect(() => {
    if (!dialogues || currentDialogueIndex >= dialogues.length) return;
    const currentText = dialogues[currentDialogueIndex].text;

    if (charIndex < currentText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayDialogue((prev) => prev + currentText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeoutId);
    } else {
      setIsTypingComplete(true);

      const delayId = setTimeout(() => {
        if (currentDialogueIndex < dialogues.length - 1) {
          onDialogueEnd(currentDialogueIndex);
        } else if (onDialogueEnd) {
          onDialogueEnd('complete');
        }
      }, 30000);

      return () => clearTimeout(delayId);
    }
  }, [charIndex, dialogues, currentDialogueIndex, onDialogueEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const getVideoSrc = () => {
    // Use the provided videoSrc prop or fallback to a default
    return videoSrc || '';
  };

  const getCharacterName = () => {
    switch (character) {
      case 'father':
        return 'Father';
      case 'mother':
        return 'Mother';
      default:
        return 'Parent';
    }
  };

  return (
    <div className="parent-dialogue-container bg-gradient-to-r from-[#252547] to-[#2d3748] p-4 rounded-xl shadow-lg border-2 border-[#374151] max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4 pt-3">
        {/* Character Video */}
  <div className="relative w-56 h-56 rounded-full overflow-hidden shadow-lg border-4 border-[#58cc02] hover:border-[#2fa946] transition-all transform hover:scale-105 bg-[#222] flex items-center justify-center">
          {getVideoSrc() ? (
            <video
              ref={videoRef}
              src={getVideoSrc()}
              loop
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover aspect-square"
              style={{ aspectRatio: '1/1', background: '#222' }}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play();
                }
              }}
              onError={e => {
                // Hide video if error
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-[#58cc02] bg-[#222]">👴</div>
          )}
        </div>

        {/* Character Label */}
        <div className="bg-black rounded-lg shadow p-3 max-w-md w-full flex items-center justify-between">
          <span className="text-lg font-bold text-[#58cc02] flex items-center gap-2">
            Your dad:
          </span>
          {isSpeaking && (
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Speaking...
            </div>
          )}
        </div>

        {/* Dialogue Bubble */}
        <div className="bg-white text-gray-800 p-4 rounded-xl shadow-lg border-2 border-[#58cc02] w-full relative mt-1">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#58cc02] rotate-45" />
          <p className="text-lg whitespace-pre-wrap">{displayDialogue || ' '}</p>
          
          {/* Continue Button - Only show when typing is complete */}
          {isTypingComplete && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => onDialogueEnd('complete')}
                className="bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-2 px-6 rounded-full shadow transition-colors animate-pulse"
              >
                Continue to allocate ur salary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDialogue;
