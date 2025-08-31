import React, { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress } from '../../utils/firebaseUtils';

const Round4 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    selectedOption: null,
    risk: null,
    returns: null,
    stability: null,
    miniEventOutcome: null,
  });

  const speechSynthesisRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
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

  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    } else if (showSummary) {
      saveUserProgress('level4', 'round4', userChoices);
    }
  }, [currentDialogueIndex, mascotDialogues, showSummary, userChoices]);

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
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('hazel') ||
          voice.name.toLowerCase().includes('google uk english female') ||
          voice.name.toLowerCase().includes('google us english female') ||
          voice.lang.includes('en')
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        utterance.volume = 1.0;
        utterance.onstart = () => { setIsSpeaking(true); };
        utterance.onend = () => { setIsSpeaking(false); };
        utterance.onerror = (event) => { console.error('Speech error:', event); setIsSpeaking(false); };
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
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length > 0) { speakWithVoice(); } else { speakWithVoice(); }
        }, 1000);
      }
    } catch (err) {
      console.error('Error in speakText:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const playCurrentDialogue = () => {
    const currentDialogue = mascotDialogues[currentDialogueIndex];
    if (!currentDialogue) return;
    stopSpeaking();
    speakText(currentDialogue.text);
  };

  const nextDialogue = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      console.log('All dialogues completed');
      if (userChoices.selectedOption === null) {
        setShowOptions(true);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleStartRound = () => {
    setShowIntro(false);
    setShowGuide(true);
  };

  const handleGuideComplete = () => {
    setShowGuide(false);
    setMascotDialogues([
      { text: "You’re staring at 10 years left before retirement. Every rupee counts now — invest bold, play safe, or balance?", speaker: "Mascot" },
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleOptionSelection = (optionType) => {
    stopSpeaking();
    let selectedRisk = '';
    let selectedReturns = '';
    let selectedStability = '';
    let miniEventText = '';
    let feedbackDialogue = '';

    switch (optionType) {
      case 'Aggressive Investments (Stocks, Startups, Crypto)':
        selectedRisk = '↑↑↑';
        selectedReturns = '↑↑↑';
        selectedStability = '❌';
        miniEventText = "Market Crash! 📉 Aggressive → Portfolio down 40%, panic attack.";
        feedbackDialogue = 'You could double your wealth, but market swings keep you awake at night.';
        break;
      case 'Safe Fixed Income (FDs, Bonds, PPF)':
        selectedRisk = '↓';
        selectedReturns = '↓';
        selectedStability = '↑↑';
        miniEventText = "Market Crash! 📉 Safe → Stable but FOMO ↑.";
        feedbackDialogue = 'You sleep peacefully but regret hearing peers brag about higher gains.';
        break;
      case 'Hybrid Mix':
        selectedRisk = 'Medium';
        selectedReturns = 'Medium';
        selectedStability = 'Medium';
        miniEventText = "Market Crash! 📉 Hybrid → Only 15% down, recovery possible.";
        feedbackDialogue = 'Not flashy, not disastrous. Your portfolio weathers storms.';
        break;
      default:
        break;
    }

    setUserChoices({
      selectedOption: optionType,
      risk: selectedRisk,
      returns: selectedReturns,
      stability: selectedStability,
      miniEventOutcome: miniEventText,
    });

    setMascotDialogues([
      { text: feedbackDialogue, speaker: "Mascot" },
      { text: `Mini Event: ${miniEventText}`, speaker: "Mascot" }
    ]);
    setCurrentDialogueIndex(0);
    setShowOptions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white overflow-hidden">
      {showIntro && (
        <RoundIntroModal
          title="Round 4: Retirement Planning Countdown"
          description="With 10 years to retirement, how will you invest your money? Aggressive, safe, or a hybrid approach?"
          onStart={handleStartRound}
        />
      )}

      {showGuide && (
        <GuideScreen
          title="Retirement Planning Guide"
          content={[
            "The final decade before retirement is crucial for investment decisions.",
            "Aggressive investments offer high returns but come with higher risk and volatility.",
            "Safe fixed-income options provide stability but lower returns, potentially impacting your retirement corpus.",
            "A hybrid approach balances risk and return, offering moderate growth and stability.",
            "Consider your risk tolerance, desired retirement lifestyle, and market conditions.",
          ]}
          onComplete={handleGuideComplete}
        />
      )}

      {(showOptions || showSummary) && (
        <div className="flex flex-col min-h-screen">
          <div className="bg-[#1e293b] p-4 border-b border-[#374151]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-[#374151] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#58cc02] to-[#2fa946] h-3 rounded-full transition-all duration-500"
                    style={{
                      width: showOptions ? '50%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showOptions ? '1/2' : '2/2'}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showOptions && "Age 51–52 – Retirement Planning Countdown"}
                {showSummary && "Round 4 Complete!"}
              </h1>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#252547] to-[#2d3748] p-4 border-b border-[#374151] sticky top-0 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-sm w-full">
                  <MascotDialogue
                    dialogues={mascotDialogues}
                    currentDialogueIndex={currentDialogueIndex}
                    onDialogueEnd={nextDialogue}
                  />
                  {isSpeaking && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-[#58cc02]">
                      <div className="animate-pulse text-lg">🗣️</div>
                      <span className="text-sm font-medium">Speaking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-6">
            <div className="max-w-2xl mx-auto">
              {showOptions && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Investment Strategy</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Aggressive Investments (Stocks, Startups, Crypto)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Aggressive Investments (Stocks, Startups, Crypto)</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Risk: ↑↑↑</p>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Returns: ↑↑↑</p>
                      <p>Stress: ↑</p>
                      <p className="col-span-2">Description: You could double your wealth, but market swings keep you awake at night.</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Safe Fixed Income (FDs, Bonds, PPF)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Safe Fixed Income (FDs, Bonds, PPF)</h3>
                        <p className="text-orange-400 font-bold text-xl">Risk: ↓</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Returns: ↓</p>
                      <p>Stability: ↑↑</p>
                      <p className="col-span-2">Description: You sleep peacefully but regret hearing peers brag about higher gains.</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Hybrid Mix')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Hybrid Mix</h3>
                        <p className="text-red-500 font-bold text-xl">Risk: Balanced</p>
                      </div>
                      <div className="text-3xl">📊</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Stress: Medium</p>
                      <p>Stability: Medium</p>
                      <p className="col-span-2">Description: Not flashy, not disastrous. Your portfolio weathers storms.</p>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 4 Complete!</h2>
                    <p className="text-gray-300">You've made a crucial decision about your retirement investments!</p>
                  </div>

                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Round 4 Choices
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Selected Option</p>
                        <p className="font-bold text-white text-lg">{userChoices.selectedOption || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.risk || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Returns Potential</p>
                        <p className="font-bold text-white text-lg">{userChoices.returns || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Stability</p>
                        <p className="font-bold text-white text-lg">{userChoices.stability || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Mini Event Outcome</p>
                        <p className="font-bold text-white text-lg">{userChoices.miniEventOutcome || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "The closer you get to retirement, the more critical your investment strategy becomes. Balance aggressive growth potential with the need for stability and risk mitigation to secure your future."
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level4/round5')}
                    >
                      <span>Continue to Next Round</span>
                      <span className="text-xl">🚀</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Round4;
