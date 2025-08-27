import React, { useRef, useEffect } from 'react';

const TalkingMascot = ({ voiceAudioSrc, mascotVideoSrc, dialogue, onComplete }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Start playing both video loop and audio when component mounts
    const startPlayback = async () => {
      try {
        // Start the looping video (silent mascot movements)
        if (videoRef.current) {
          videoRef.current.muted = true; // Keep video silent
          await videoRef.current.play();
        }

        // Start the voiceover audio
        if (audioRef.current && voiceAudioSrc) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.log('Auto-play blocked:', error);
      }
    };

    startPlayback();
  }, [voiceAudioSrc]);

  const handleAudioEnd = () => {
    // When voiceover ends, call completion callback
    onComplete?.();
  };

  return (
    <div className="flex flex-col items-center gap-5 pt-10">
      {/* Looping Mascot Video (silent) */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-accent-300">
        <video
          ref={videoRef}
          src={mascotVideoSrc}
          loop // This makes the video loop endlessly
          autoPlay
          muted // Video is muted because audio comes from separate source
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hidden Audio Element for Voiceover */}
      <audio
        ref={audioRef}
        src={voiceAudioSrc}
        onEnded={handleAudioEnd}
        preload="auto"
      />

      {/* Text display (optional - shows while audio plays) */}
      <div className="bg-black rounded-lg shadow p-5 max-w-md w-full">
        <span className="text-lg font-bold text-primary-900 flex items-center gap-2">
          👤 Your Guide Says:
        </span>
        <span className="text-primary-700 text-base">
          {dialogue}
        </span>
      </div>
    </div>
  );
};

export default TalkingMascot;
