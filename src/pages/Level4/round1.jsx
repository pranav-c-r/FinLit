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
    salary: null,
    stress: null,
    growth: null,
    familyTime: null,
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
      saveUserProgress('level4', 'round1', userChoices);
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
      // Logic to transition to options or summary after dialogues
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
      { text: "You’re at the top of your game. Salary’s great, your title is respected, but stress is eating away at you. The fork in the road is clear: double down on the corporate climb, take a softer consulting path, or gamble on entrepreneurship.", speaker: "Mascot" },
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleOptionSelection = (optionType) => {
    stopSpeaking();
    let selectedSalary = '';
    let selectedStress = '';
    let selectedGrowth = '';
    let selectedFamilyTime = '';
    let miniEventText = '';
    let feedbackDialogue = '';

    switch (optionType) {
      case 'Stay in High-Paying Job':
        selectedSalary = '₹3L/month';
        selectedStress = 'Very High 🚨';
        selectedGrowth = 'Medium (titles, but not much learning)';
        selectedFamilyTime = '❌ Very Low';
        miniEventText = "Annual physical → Doctor says: “Your cholesterol, sugar, and BP are climbing. Ignore at your own risk.” (Health ↓).";
        feedbackDialogue = 'You’re now an indispensable senior executive, but every day feels like a trade of health for money.';
        break;
      case 'Career Switch / Consulting':
        selectedSalary = '₹1.5L/month';
        selectedStress = 'Medium';
        selectedGrowth = 'Uncertain';
        selectedFamilyTime = '✅ More';
        miniEventText = "First year is slow → One major client shows interest. Do you slash fees (Money ↓, Reputation ↑) or hold firm (Risk losing client)?";
        feedbackDialogue = 'You’re valued for wisdom now, not hustle. Evenings at home, but clients can vanish without warning.';
        break;
      case 'Start Your Own Business':
        selectedSalary = '₹0–₹5L/month (volatile)';
        selectedStress = 'Extreme';
        selectedGrowth = 'Huge potential';
        selectedFamilyTime = 'Medium';
        miniEventText = "You burn through 6 months savings. Family pressures you: Shut down (Stable, Dreams ↓) or Keep going (Savings ↓↓, Hope ↑).";
        feedbackDialogue = 'Your life turns into risk management — freedom on one side, anxiety on the other.';
        break;
      default:
        break;
    }

    setUserChoices({
      selectedOption: optionType,
      salary: selectedSalary,
      stress: selectedStress,
      growth: selectedGrowth,
      familyTime: selectedFamilyTime,
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
          title="Round 1: Career Peak or Mid-Life Switch?"
          description="You're at a crossroads in your mid-life career. Will you double down on your current path, switch to consulting, or venture into entrepreneurship?"
          onStart={handleStartRound}
        />
      )}

      {showGuide && (
        <GuideScreen
          title="Career Crossroads Guide"
          content={[
            "The mid-life career stage often brings a choice between stability and new ventures.",
            "High-paying corporate jobs offer financial security but can come with immense stress and less family time.",
            "Consulting provides flexibility and leverages experience, but income can be uncertain.",
            "Entrepreneurship offers huge growth potential and freedom, but involves extreme risk and initial financial strain.",
            "Consider your health, family needs, and long-term financial goals when making this decision.",
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
                {showOptions && "Age 45–46 – Career Peak or Mid-Life Switch?"}
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
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Path</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Stay in High-Paying Job')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay in High-Paying Job</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Salary: ₹3L/month</p>
                      </div>
                      <div className="text-3xl">🏢</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Stress: Very High 🚨</p>
                      <p>Growth: Medium (titles, but not much learning)</p>
                      <p className="col-span-2">Family Time: ❌ Very Low</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Career Switch / Consulting')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Career Switch / Consulting</h3>
                        <p className="text-orange-400 font-bold text-xl">Salary: ₹1.5L/month</p>
                      </div>
                      <div className="text-3xl">💼</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Stress: Medium</p>
                      <p>Growth: Uncertain</p>
                      <p className="col-span-2">Family Time: ✅ More</p>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleOptionSelection('Start Your Own Business')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Start Your Own Business</h3>
                        <p className="text-red-500 font-bold text-xl">Salary: ₹0–₹5L/month (volatile)</p>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                      <p>Stress: Extreme</p>
                      <p>Growth: Huge potential</p>
                      <p className="col-span-2">Family Time: Medium</p>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 1 Complete!</h2>
                    <p className="text-gray-300">You've made a crucial career decision for your mid-life!</p>
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
                        <p className="text-gray-400 text-sm mb-1">Salary/Income</p>
                        <p className="font-bold text-white text-lg">{userChoices.salary || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Stress Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.stress || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Growth Potential</p>
                        <p className="font-bold text-white text-lg">{userChoices.growth || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Family Time</p>
                        <p className="font-bold text-white text-lg">{userChoices.familyTime || 'N/A'}</p>
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
                      "Mid-life career choices often involve a trade-off between financial gains, personal well-being, and family time. Carefully weigh the risks and rewards of each path."
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level4/round2')}
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
