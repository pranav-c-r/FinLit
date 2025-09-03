import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import level11Audio from '../../assets/level11.mp3'; // Re-using audio, consider new ones if available
import { useNavigate } from 'react-router-dom';

const Round2 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    selectedOption: null,
    salary: 0,
    risk: null,
    growth: null,
    consequence: null,
    miniEventImpact: null,
  });

  const speechSynthesisRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

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
      { text: "You're in your peak earning years, but the corporate ladder is getting crowded. Time to decide: climb higher or jump ship?", audioSrc: null }
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
    } else if (showSummary) {
      saveUserProgress(userChoices);
    }
  }, [currentDialogueIndex, mascotDialogues, showSummary, userChoices]);

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
        'level3.round2_completed': true,
        'level3.round2': roundOutcome,
        'level': 3,
        'round': 2,
      }, { merge: true });
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleOptionSelection = (optionType) => {
    stopSpeaking();
    let selectedSalary = 0;
    let selectedRisk = '';
    let selectedGrowth = '';
    let selectedConsequence = '';
    let miniEventImpact = '';
    let feedbackDialogue = '';

    switch (optionType) {
      case 'Chase Senior Leadership Role':
        selectedSalary = '₹25-35L/year potential';
        selectedRisk = 'Medium';
        selectedGrowth = 'Corporate politics, long hours, high stress';
        selectedConsequence = 'Big money, burnt relationships, health issues';
        miniEventImpact = 'Golden parachute or first to be fired';
        feedbackDialogue = 'Ambitious! Aiming for leadership can bring great rewards, but be ready for the challenges that come with it.';
        break;
      case 'Switch to Entrepreneurship':
        selectedSalary = '₹0-50L/year (highly unpredictable)';
        selectedRisk = 'Very High';
        selectedGrowth = 'Unlimited if successful';
        selectedConsequence = 'Freedom + family financial stress for 2-3 years';
        miniEventImpact = 'Adapt quickly or sink completely';
        feedbackDialogue = 'A true leap of faith! Entrepreneurship offers immense potential, but comes with significant risks.';
        break;
      case 'Consultant/Freelancer Transition':
        selectedSalary = '₹20-30L/year if established';
        selectedRisk = 'Medium';
        selectedGrowth = 'Work-life balance, location independence';
        selectedConsequence = 'Irregular income, no corporate benefits';
        miniEventImpact = 'Client projects dry up temporarily';
        feedbackDialogue = 'Flexibility is great! As a consultant, you control your work, but income stability can be a concern.';
        break;
      case 'Stay in Comfort Zone':
        selectedSalary = 'Current ₹15-18L with annual increments';
        selectedRisk = 'Very Low';
        selectedGrowth = 'Minimal, inflation-adjusted';
        selectedConsequence = 'Safe but unfulfilled, regrets at 50';
        miniEventImpact = 'Layoffs hit, no backup skills';
        feedbackDialogue = 'Playing it safe. While comfortable now, avoiding growth can lead to stagnation later.';
        break;
      default:
        break;
    }

    const roundOutcome = {
      selectedOption: optionType,
      salary: selectedSalary,
      risk: selectedRisk,
      growth: selectedGrowth,
      consequence: selectedConsequence,
      miniEventImpact: miniEventImpact,
    };
    setUserChoices(roundOutcome);

    setMascotDialogues([
      { text: feedbackDialogue, audioSrc: null },
      { text: `Mini Event – Industry Disruption/Recession: ${miniEventImpact}`, audioSrc: null }
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
                {showOptions && "Age 38–39 – Career Peak or Plateau"}
                {showSummary && "Round 2 Complete!"}
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
                  {/* Option 1: Chase Senior Leadership Role */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Chase Senior Leadership Role')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Chase Senior Leadership Role</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Salary: ₹25-35L/year potential</p>
                      </div>
                      <div className="text-3xl">🪜</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Medium</p>
                      <p>Growth: Corporate politics, long hours, high stress</p>
                      <p className="col-span-2">Consequence: Big money, burnt relationships, health issues</p>
                    </div>
                  </div>
                  
                  {/* Option 2: Switch to Entrepreneurship */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Switch to Entrepreneurship')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Switch to Entrepreneurship</h3>
                        <p className="text-orange-400 font-bold text-xl">Income: ₹0-50L/year (highly unpredictable)</p>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Very High</p>
                      <p>Growth: Unlimited if successful</p>
                      <p className="col-span-2">Consequence: Freedom + family financial stress for 2-3 years</p>
                    </div>
                  </div>

                  {/* Option 3: Consultant/Freelancer Transition */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Consultant/Freelancer Transition')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Consultant/Freelancer Transition</h3>
                        <p className="text-red-500 font-bold text-xl">Income: ₹20-30L/year if established</p>
                      </div>
                      <div className="text-3xl">💼</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Medium</p>
                      <p>Growth: Work-life balance, location independence</p>
                      <p className="col-span-2">Consequence: Irregular income, no corporate benefits</p>
                    </div>
                  </div>

                  {/* Option 4: Stay in Comfort Zone */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Stay in Comfort Zone')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay in Comfort Zone</h3>
                        <p className="text-purple-400 font-bold text-xl">Salary: Current ₹15-18L with annual increments</p>
                      </div>
                      <div className="text-3xl">🧘</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Very Low</p>
                      <p>Growth: Minimal, inflation-adjusted</p>
                      <p className="col-span-2">Consequence: Safe but unfulfilled, regrets at 50</p>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Great Job!</h2>
                    <p className="text-gray-300">You've made a crucial career decision.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Round 2 Choices
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Selected Option</p>
                        <p className="font-bold text-white text-lg">{userChoices.selectedOption || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Salary/Income</p>
                        <p className="font-bold text-white text-lg">{userChoices.salary || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.risk === 'Very Low' ? 'bg-green-500/20 text-green-400' :
                            userChoices.risk === 'Low' ? 'bg-lime-500/20 text-lime-400' :
                            userChoices.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            userChoices.risk === 'Very High' ? 'bg-red-500/20 text-red-400' :
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
                        <p className="text-gray-400 text-sm mb-1">Mini Event Impact (Industry Disruption/Recession)</p>
                        <p className="font-bold text-white text-lg">{userChoices.miniEventImpact || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Career decisions in your prime earning years significantly impact your financial trajectory. Weighing growth, stability, and personal fulfillment is key, especially when considering market volatility."
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        navigate('/level3/round3');
                      }}
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

export default Round2;
