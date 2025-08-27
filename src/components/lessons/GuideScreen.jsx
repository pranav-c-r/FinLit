// GuideScreen.jsx - Updated
import React, { useState } from 'react';
import TalkingMascot from './TalkingMascot';
import mascotVideoSrc from '../../assets/malelawyer.mp4';
import voiceAudioSrc from '../../assets/level11.mp3';

const GuideScreen = ({ onNext }) => {

  const [showContinueButton, setShowContinueButton] = useState(false);

  const handleVoiceoverComplete = () => {
    // Show continue button when voiceover finishes
    setShowContinueButton(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#252547] to-[#4A004A] flex flex-col items-center justify-center">
      <TalkingMascot
        mascotVideoSrc={mascotVideoSrc}  // Your looping mascot video
        voiceAudioSrc={voiceAudioSrc}  // Your voiceover audio
        onComplete={handleVoiceoverComplete}
      />

      {/* Show continue button only after voiceover ends */}
      {showContinueButton && (
        <button
          onClick={onNext}
          className="mt-6 px-6 py-3 rounded-full bg-accent-500 text-white font-semibold text-base transition hover:bg-accent-600 animate-fadeIn"
        >
          Continue to Job Selection
        </button>
      )}
    </div>
  );
};


export default GuideScreen;
