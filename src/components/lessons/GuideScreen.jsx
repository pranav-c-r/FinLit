import React, { useState, useRef, useEffect } from 'react';
import TalkingMascot from './TalkingMascot';
import mascotVideoSrc from '../../assets/lottie json/guide.mp4';
import voiceAudioSrc from '../../assets/level11.mp3';

const GuideScreen = ({ onNext }) => {
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const guideTexts = [
    {
      text: "Welcome to your Financial Journey!",
      subtitle: "Let's learn how money decisions shape your life"
    },
    {
      text: "You're about to make choices that will impact your financial future.",
      subtitle: "Every decision has consequences - both good and challenging"
    },
    {
      text: "Think carefully about each option.",
      subtitle: "There's no single 'right' answer - only what's right for your situation"
    },
    {
      text: "Ready to begin your journey into the real world?",
      subtitle: "Your first major decision awaits!"
    }
  ];

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  const speakText = (text) => {
    if (!text || !text.trim()) return;

    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    try {
      const utterance = new window.SpeechSynthesisUtterance(text);

      const speakWithVoice = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        const preferredVoice = availableVoices.find(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.lang.includes('en')
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          setTimeout(() => {
            if (currentTextIndex < guideTexts.length - 1) {
              setCurrentTextIndex(prev => prev + 1);
            } else {
              setShowContinueButton(true);
            }
          }, 1500);
        };
        utterance.onerror = () => setIsSpeaking(false);

        speechSynthesisRef.current.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        speakWithVoice();
      } else {
        const handleVoicesChanged = () => {
          speakWithVoice();
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        setTimeout(speakWithVoice, 1000);
      }
    } catch (err) {
      console.error('Speech error:', err);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const currentGuideText = guideTexts[currentTextIndex];
    if (currentGuideText) {
      speakText(currentGuideText.text + '. ' + currentGuideText.subtitle);
    }
  }, [currentTextIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentTextIndex === 0) {
        setCurrentTextIndex(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleVoiceoverComplete = () => {
    setShowContinueButton(true);
  };

  const handleSkip = () => {
    speechSynthesisRef.current.cancel();
    setIsSpeaking(false);
    setShowContinueButton(true);
    setCurrentTextIndex(guideTexts.length - 1);
  };

  const currentGuideText = guideTexts[currentTextIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-56 sm:w-64 h-56 sm:h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-6 sm:space-y-10">
        
        <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mx-auto">
          <TalkingMascot
            mascotVideoSrc={mascotVideoSrc}
            onComplete={handleVoiceoverComplete}
          />
        </div>

        {/* Text Content */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-[#252547]/50 to-[#2d3748]/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[#374151]/50 shadow-xl">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#58cc02] to-[#2fa946] bg-clip-text text-transparent mb-4 transition-all duration-500">
            {currentGuideText?.text || "Welcome!"}
          </h1>
          <p className="text-base sm:text-xl text-gray-300 leading-relaxed mb-6 transition-all duration-500">
            {currentGuideText?.subtitle || "Let's begin your journey"}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mb-6">
            {guideTexts.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentTextIndex
                    ? 'bg-[#58cc02] scale-110 shadow-lg shadow-[#58cc02]/50'
                    : index < currentTextIndex
                      ? 'bg-[#2fa946]'
                      : 'bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-4 sm:h-6 bg-[#58cc02] rounded-full animate-pulse delay-${i * 100}`}
                  />
                ))}
              </div>
              <span className="text-[#58cc02] font-medium ml-2 sm:ml-3 text-sm sm:text-base">Speaking...</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4">
          {/* Skip button */}
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-[#374151]/50 backdrop-blur-sm text-gray-300 rounded-full font-medium border border-[#374151]/50 hover:bg-[#374151]/70 hover:text-white transition-all duration-300"
          >
            Skip Introduction
          </button>

          {/* Prev / Next */}
          {currentTextIndex > 0 && (
            <button
              onClick={() => setCurrentTextIndex(prev => Math.max(0, prev - 1))}
              className="px-5 py-2.5 bg-[#58cc02]/20 backdrop-blur-sm text-[#58cc02] rounded-full font-medium border border-[#58cc02]/50 hover:bg-[#58cc02]/30 hover:text-white transition-all duration-300"
            >
              ← Previous
            </button>
          )}
          {currentTextIndex < guideTexts.length - 1 && (
            <button
              onClick={() => setCurrentTextIndex(prev => Math.min(guideTexts.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-[#58cc02]/20 backdrop-blur-sm text-[#58cc02] rounded-full font-medium border border-[#58cc02]/50 hover:bg-[#58cc02]/30 hover:text-white transition-all duration-300"
            >
              Next →
            </button>
          )}
          
          {/* Continue button - only show when all text has been displayed */}
          {showContinueButton && (
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-full font-bold border border-[#58cc02] hover:shadow-lg hover:shadow-[#58cc02]/30 transition-all duration-300 animate-pulse"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-gray-400 text-xs sm:text-sm">
        Level 1 - Round 1: Career Choices
      </div>
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-gray-400 text-xs sm:text-sm">
        Financial Literacy Game
      </div>
    </div>
  );
};

export default GuideScreen;