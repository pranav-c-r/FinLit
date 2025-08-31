import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import level11Audio from '../../assets/level11.mp3'; // Re-using audio, consider new ones if available

const Round5 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    selectedOption: null,
    investment: null,
    growth: null,
    consequence: null,
    miniEventImpact: null,
    risk: null,
  });

  const speechSynthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length, 'voices available');
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      try {
        const emptyUtterance = new SpeechSynthesisUtterance('');
        emptyUtterance.onend = () => { loadVoices(); };
        window.speechSynthesis.speak(emptyUtterance);
      } catch (error) {
        console.log('Could not trigger voice loading, will wait for onvoiceschanged');
      }
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
          if (window.speechSynthesis.getVoices().length > 0) {
            speakWithVoice();
          } else {
            speakWithVoice();
          }
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

  const handleStartJourney = () => {
    setShowIntro(false);
    setShowGuide(true);
  };

  const handleContinue = () => {
    setShowGuide(false);
    setShowOptions(true);
    setMascotDialogues([
      { text: "You're earning peak money now. 15 years to retirement. Time to decide: aggressive wealth building or enjoy the fruits of your labor?", audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const playCurrentDialogue = () => {
    const currentDialogue = mascotDialogues[currentDialogueIndex];
    if (!currentDialogue) return;
    stopSpeaking();
    if (currentDialogue.audioSrc) {
      try {
        const audio = new Audio(currentDialogue.audioSrc);
        audio.onloadeddata = () => { audio.play().catch(error => { console.log('Audio playback failed, using TTS:', error); speakText(currentDialogue.text); }); };
        audio.onerror = () => { speakText(currentDialogue.text); };
      } catch (error) {
        speakText(currentDialogue.text);
      }
    } else {
      speakText(currentDialogue.text);
    }
  };

  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    }
  }, [currentDialogueIndex, mascotDialogues]);

  const nextDialogue = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      console.log('All dialogues completed');
      setShowOptions(true); // Ensure options are visible after initial dialogue
    }
  };

  const saveUserProgress = async (roundOutcome) => {
    if (!auth.currentUser) return;
    try {
      const userProgressRef = doc(database, "Users", auth.currentUser.uid);
      await updateDoc(userProgressRef, {
        'level3.round5_completed': true,
        'level3.round5': roundOutcome,
        'level': 3,
        'round': 5,
      }, { merge: true });
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleOptionSelection = (optionType) => {
    stopSpeaking();
    let selectedInvestment = '';
    let selectedGrowth = '';
    let selectedConsequence = '';
    let miniEventImpact = '';
    let selectedRisk = '';
    let feedbackDialogue = '';

    switch (optionType) {
      case 'FIRE Strategy (Financial Independence, Retire Early)':
        selectedInvestment = '50% of income (₹10L+/year)';
        selectedRisk = 'High (sacrifice lifestyle now)';
        selectedGrowth = 'Retire by 55 with ₹5-7 crore corpus';
        selectedConsequence = 'Sacrifice lifestyle now, freedom at 55';
        miniEventImpact = 'Large corpus survives downturn, early retirement intact';
        feedbackDialogue = 'An aggressive but rewarding path! Early retirement requires significant discipline and sacrifice.';
        break;
      case 'Balanced Wealth Building':
        selectedInvestment = '30% of income (₹6L/year)';
        selectedRisk = 'Medium';
        selectedGrowth = 'Comfortable retirement at 60-62';
        selectedConsequence = 'Good lifestyle + decent retirement corpus';
        miniEventImpact = 'Some impact, retirement delayed by 2-3 years';
        feedbackDialogue = 'A prudent choice. Balancing current lifestyle with future security is a sustainable strategy.';
        break;
      case 'Lifestyle Upgrade Mode':
        selectedInvestment = '10% of income (₹2L/year)';
        selectedRisk = 'Low (but high retirement risk)';
        selectedGrowth = 'Enjoy peak earning years fully';
        selectedConsequence = 'Great lifestyle now, work till 65-67';
        miniEventImpact = 'Struggle to maintain expenses, forced savings';
        feedbackDialogue = 'Enjoying your hard-earned money! Just be aware that a luxurious present might mean a longer working future.';
        break;
      case 'Property Investment Focus':
        selectedInvestment = 'Second home as investment (₹1 crore)';
        selectedRisk = 'Illiquid wealth, concentrated risk';
        selectedGrowth = 'Rental income + appreciation potential';
        selectedConsequence = 'Illiquid wealth, concentrated risk';
        miniEventImpact = 'Real estate values drop, rental income uncertain';
        feedbackDialogue = 'A tangible asset! Property investment can be rewarding, but consider the illiquidity and market risks.';
        break;
      default:
        break;
    }

    const roundOutcome = {
      selectedOption: optionType,
      investment: selectedInvestment,
      risk: selectedRisk,
      growth: selectedGrowth,
      consequence: selectedConsequence,
      miniEventImpact: miniEventImpact,
    };
    setUserChoices(roundOutcome);

    setMascotDialogues([
      { text: feedbackDialogue, audioSrc: null },
      { text: `Mini Event – Market Crash + Job Market Shifts: ${miniEventImpact}`, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);

    setShowOptions(false);
    setShowSummary(true);
    saveUserProgress(roundOutcome);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white overflow-hidden">
      {showIntro && <RoundIntroModal onClose={handleStartJourney} />}
      {showGuide && <GuideScreen onNext={handleContinue} />}

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
                {showOptions && "Age 44–45 – Retirement Acceleration or Lifestyle Upgrade"}
                {showSummary && "Round 5 Complete!"}
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
                  {/* Option 1: FIRE Strategy (Financial Independence, Retire Early) */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('FIRE Strategy (Financial Independence, Retire Early)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">FIRE Strategy (Financial Independence, Retire Early)</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Investment: 50% of income (₹10L+/year)</p>
                      </div>
                      <div className="text-3xl">🔥</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: High (sacrifice lifestyle now)</p>
                      <p>Growth: Retire by 55 with ₹5-7 crore corpus</p>
                      <p className="col-span-2">Consequence: Sacrifice lifestyle now, freedom at 55</p>
                    </div>
                  </div>
                  
                  {/* Option 2: Balanced Wealth Building */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Balanced Wealth Building')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Balanced Wealth Building</h3>
                        <p className="text-orange-400 font-bold text-xl">Investment: 30% of income (₹6L/year)</p>
                      </div>
                      <div className="text-3xl">⚖️</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Medium</p>
                      <p>Growth: Comfortable retirement at 60-62</p>
                      <p className="col-span-2">Consequence: Good lifestyle + decent retirement corpus</p>
                    </div>
                  </div>

                  {/* Option 3: Lifestyle Upgrade Mode */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Lifestyle Upgrade Mode')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Lifestyle Upgrade Mode</h3>
                        <p className="text-red-500 font-bold text-xl">Investment: 10% of income (₹2L/year)</p>
                      </div>
                      <div className="text-3xl">💎</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Low (but high retirement risk)</p>
                      <p>Growth: Enjoy peak earning years fully</p>
                      <p className="col-span-2">Consequence: Great lifestyle now, work till 65-67</p>
                    </div>
                  </div>

                  {/* Option 4: Property Investment Focus */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Property Investment Focus')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Property Investment Focus</h3>
                        <p className="text-purple-400 font-bold text-xl">Investment: Second home as investment (₹1 crore)</p>
                      </div>
                      <div className="text-3xl">🏠</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Illiquid wealth, concentrated risk</p>
                      <p>Growth: Rental income + appreciation potential</p>
                      <p className="col-span-2">Consequence: Illiquid wealth, concentrated risk</p>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Great Job!</h2>
                    <p className="text-gray-300">You've made key decisions about your retirement and lifestyle.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Round 5 Choices
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Selected Option</p>
                        <p className="font-bold text-white text-lg">{userChoices.selectedOption || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Investment Strategy</p>
                        <p className="font-bold text-white text-lg">{userChoices.investment || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                            userChoices.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            userChoices.risk === 'High (sacrifice lifestyle now)' || userChoices.risk === 'Low (but high retirement risk)' || userChoices.risk === 'Illiquid wealth, concentrated risk' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {userChoices.risk}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Growth/Benefit</p>
                        <p className="font-bold text-white text-lg">{userChoices.growth || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Consequence</p>
                        <p className="font-bold text-white text-lg">{userChoices.consequence || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Mini Event Impact (Market Crash + Job Market Shifts)</p>
                        <p className="font-bold text-white text-lg">{userChoices.miniEventImpact || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "The choices made in your mid-40s regarding retirement and lifestyle significantly shape your financial future. Aggressive saving can lead to early financial independence, while lifestyle upgrades may extend your working years. Consider market volatility and liquidity when making major investment decisions."
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        window.location.href = '/level3'; // Or to a final summary page
                      }}
                    >
                      <span>Return to Level 3 Overview</span>
                      <span className="text-xl">🏠</span>
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

export default Round5;
