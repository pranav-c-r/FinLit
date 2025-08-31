import React, { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress } from '../../utils/firebaseUtils';

const Round1 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    selectedOption: null,
    money: null,
    risk: null,
    growth: null,
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
      saveUserProgress('level5', 'round1', userChoices);
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
      { text: "You’re 54 now. Retirement is around the corner. Your company offers a buyout option for your pension fund. Big choice coming up!", speaker: "Mascot" },
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleOptionSelection = (optionType) => {
    stopSpeaking();
    let selectedMoney = '';
    let selectedRisk = '';
    let selectedGrowth = '';
    let selectedStability = '';
    let miniEventText = '';
    let feedbackDialogue = '';

    switch (optionType) {
      case 'Take Full Lump Sum Now':
        selectedMoney = '₹50L instantly';
        selectedRisk = 'High (You must manage it wisely)';
        selectedGrowth = 'Depends on your investments';
        selectedStability = '❌';
        miniEventText = "Inflation Monster Appears: After 10 years, expenses double → Pension covers barely half of needs.";
        feedbackDialogue = 'You get a huge amount now, but no steady monthly income later. You decide your financial destiny.';
        break;
      case 'Keep Monthly Pension':
        selectedMoney = '₹35K for life';
        selectedRisk = 'Low';
        selectedGrowth = 'Nil';
        selectedStability = '✅';
        miniEventText = "Inflation Monster Appears: After 10 years, expenses double → Pension covers barely half of needs.";
        feedbackDialogue = 'Safe choice. Monthly pension is stable but inflation eats value over time.';
        break;
      case 'Invest Lump Sum in Balanced Mutual Funds':
        selectedMoney = '₹50L → can grow to ₹75L in 10 years or crash to ₹30L';
        selectedRisk = 'Medium';
        selectedGrowth = 'Potentially High';
        selectedStability = '❌';
        miniEventText = "Inflation Monster Appears: Market rises = jackpot; Market crashes = sleepless nights.";
        feedbackDialogue = 'Risk-reward game. Market decides your fate.';
        break;
      case 'Split the Amount':
        selectedMoney = '₹25L in pension, ₹25L in investment';
        selectedRisk = 'Balanced';
        selectedGrowth = 'Moderate';
        selectedStability = 'Medium';
        miniEventText = "Inflation Monster Appears: Stable backup, smaller growth.";
        feedbackDialogue = 'Neither too safe nor too risky. A hedge against both inflation and market crash.';
        break;
      default:
        break;
    }

    setUserChoices({
      selectedOption: optionType,
      money: selectedMoney,
      risk: selectedRisk,
      growth: selectedGrowth,
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
          title="Round 1: Retirement Fund Dilemma"
          description="At 54, you face a big decision about your pension fund. Will you take a lump sum, a monthly pension, or invest for growth?"
          onStart={handleStartRound}
        />
      )}

      {showGuide && (
        <GuideScreen
          title="Retirement Fund Guide"
          content={[
            "Your pension fund is a critical asset for retirement. Understanding your options is key.",
            "A lump sum offers immediate control but requires disciplined investment to last a lifetime.",
            "A monthly pension provides stable income but may not keep pace with inflation.",
            "Investing the lump sum in mutual funds can offer growth, but comes with market risks.",
            "A split option balances stability and growth, hedging against various risks.",
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
                {showOptions && "Age 54–55 – Retirement Fund Dilemma"}
                {showSummary && "Round 1 Complete!"}
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
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Pension Strategy</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Take Full Lump Sum Now')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Take Full Lump Sum Now</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Money: ₹50L instantly</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: High (You must manage it wisely)</p>
                      <p>Growth: Depends on your investments</p>
                      <p className="col-span-2">Stability: ❌</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Keep Monthly Pension')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Keep Monthly Pension</h3>
                        <p className="text-orange-400 font-bold text-xl">Monthly Income: ₹35K for life</p>
                      </div>
                      <div className="text-3xl">💵</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Low</p>
                      <p>Growth: Nil</p>
                      <p className="col-span-2">Stability: ✅</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Invest Lump Sum in Balanced Mutual Funds')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Invest Lump Sum in Balanced Mutual Funds</h3>
                        <p className="text-red-500 font-bold text-xl">Initial: ₹50L → can grow to ₹75L in 10 years or crash to ₹30L</p>
                      </div>
                      <div className="text-3xl">📈</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Medium</p>
                      <p>Growth: Potentially High</p>
                      <p className="col-span-2">Stability: ❌</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Split the Amount')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Split the Amount</h3>
                        <p className="text-purple-400 font-bold text-xl">Money: ₹25L in pension, ₹25L in investment</p>
                      </div>
                      <div className="text-3xl">📊</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Risk: Balanced</p>
                      <p>Growth: Moderate</p>
                      <p className="col-span-2">Stability: Medium</p>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 1 Complete!</h2>
                    <p className="text-gray-300">You've made a crucial decision about your retirement funds!</p>
                  </div>

                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Round 1 Choices
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Selected Option</p>
                        <p className="font-bold text-white text-lg">{userChoices.selectedOption || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money Impact</p>
                        <p className="font-bold text-white text-lg">{userChoices.money || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.risk || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Growth Potential</p>
                        <p className="font-bold text-white text-lg">{userChoices.growth || 'N/A'}</p>
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
                      "Retirement fund decisions are critical. A lump sum offers control but demands wise management, while a pension provides stability but loses value to inflation. Balance risk and reward based on your financial goals."
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level5/round2')}
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

export default Round1;

