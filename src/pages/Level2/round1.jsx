import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress as saveProgress } from '../../utils/firebaseUtils';

const Round1 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showCareerOptions, setShowCareerOptions] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    careerChoice: null,
    miniEventOutcome: null,
    money: 0,
    riskLevel: 'Low',
    growth: 'Slow',
    stability: 'High',
    happiness: 'Stable',
    stressLevel: 'Low',
  });
  const [selectedCareerType, setSelectedCareerType] = useState(null);

  const speechSynthesisRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length, 'voices available');
      console.log('Voice details:', availableVoices.map(v => `${v.name} (${v.lang})`));
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
          console.log('Selected voice:', preferredVoice.name);
          utterance.voice = preferredVoice;
        } else {
          console.log('Using default voice');
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

  const handleStartJourney = () => {
    setShowIntro(false);
    setShowGuide(true);
  };

  const handleContinue = () => {
    setShowGuide(false);
    setShowCareerOptions(true);
    setMascotDialogues([
      { text: "You’re 30. Work’s stable, life’s okay. But the world’s moving fast. Do you risk a career jump or stay cozy?", audioSrc: null },
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
        audio.onerror = () => { console.log('Audio file not found, using TTS'); speakText(currentDialogue.text); };
      } catch (error) {
        console.log('Audio error, using TTS:', error); speakText(currentDialogue.text); 
      }
    } else {
      speakText(currentDialogue.text);
    }
  };

  const nextDialogue = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      console.log('All dialogues completed');
      if (showCareerOptions) {
        setShowCareerOptions(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: Recession Monster Appears", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showMiniEvent) {
        setShowMiniEvent(false);
        setShowSummary(true);
      } else {
        setShowSummary(true);
      }
    }
  };
  
  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    } else if (showSummary) {
      saveUserProgress();
    }
  }, [currentDialogueIndex, mascotDialogues, showSummary]);

  const saveUserProgress = async () => {
    await saveProgress('level2', 'round1', userChoices);
  };

  const handleCareerChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let riskLevel = userChoices.riskLevel;
    let growth = userChoices.growth;
    let stability = userChoices.stability;
    let happiness = userChoices.happiness;
    let stressLevel = userChoices.stressLevel;
    let consequence = '';

    switch (choice) {
      case 'Stay in Current Job':
        money += 1200000; 
        riskLevel = 'Low';
        growth = 'Slow';
        stability = 'High';
        happiness = 'Stable';
        stressLevel = 'Low';
        consequence = 'Stable life, limited dreams.';
        break;
      case 'Join Startup':
        money += 1000000; 
        riskLevel = 'Medium';
        growth = 'High';
        stability = 'Low';
        happiness = 'Medium';
        stressLevel = 'High';
        consequence = 'Jackpot or job hunting in 6 months.';
        break;
      case 'MBA / Higher Studies':
        money -= 1500000; 
        riskLevel = 'Medium';
        growth = 'Very High';
        stability = 'Low';
        happiness = 'Low';
        stressLevel = 'Very High';
        consequence = 'Huge debt if timing goes wrong.';
        break;
      case 'Freelance / Small Business':
        money += 500000; 
        riskLevel = 'High';
        growth = 'Unlimited';
        stability = 'Very Low';
        happiness = 'Medium';
        stressLevel = 'Very High';
        consequence = 'Freedom + sleepless nights + inconsistent income.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      careerChoice: choice,
      money: money,
      riskLevel: riskLevel,
      growth: growth,
      stability: stability,
      happiness: happiness,
      stressLevel: stressLevel,
    }));
    setSelectedCareerType(choice);
    setMascotDialogues([
      { text: `You chose to ${choice}. ${consequence}`, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventOutcome = () => {
    stopSpeaking();
    let money = userChoices.money;
    let miniEventText = '';
    let riskLevel = userChoices.riskLevel;

    switch (userChoices.careerChoice) {
      case 'Stay in Current Job':
        miniEventText = 'Recession hit! Your salary is frozen, but you are still employed. Stability pays off.';
        riskLevel = 'Low';
        break;
      case 'Join Startup':
        if (Math.random() < 0.5) {
          miniEventText = 'The startup shut down! You are job hunting again. High risk, high reward.';
          money -= 100000; // Representing job search costs
          riskLevel = 'Very High';
        } else {
          miniEventText = 'The startup had a successful IPO! You are a millionaire. High risk, high reward.';
          money += 5000000; // Big bonus from IPO
          riskLevel = 'Low';
        }
        break;
      case 'MBA / Higher Studies':
        miniEventText = 'No jobs after graduation due to recession! You are stressed with loan burden. Bad timing for studies.';
        money -= 200000; // Continued expenses without income
        riskLevel = 'Very High';
        break;
      case 'Freelance / Small Business':
        if (Math.random() < 0.7) {
          miniEventText = 'Your business survived the recession with hustle and luck! Income is stable. Freedom + hard work.';
          money += 100000; // Small income during recession
          riskLevel = 'Medium';
        } else {
          miniEventText = 'Your business collapsed due to recession. Back to square one. High risk, high loss.';
          money -= 50000; // Business losses
          riskLevel = 'Very High';
        }
        break;
      default:
        miniEventText = 'A mini-event occurred, but your current career choice mitigated the impact.';
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      riskLevel: riskLevel,
    }));
    setMascotDialogues([
      { text: miniEventText, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white overflow-hidden">
      {/* Show intro modal first */}
      {showIntro && <RoundIntroModal onClose={handleStartJourney} />}
      
      {/* Show guide screen after modal closes */}
      {showGuide && <GuideScreen onNext={handleContinue} />}
      
      {/* Main game interface - Mobile-first design with Duolingo style */}
      {(showCareerOptions || showMiniEvent || showSummary) && (
        <div className="flex flex-col min-h-screen">
          {/* Top Header - Progress and Title */}
          <div className="bg-[#1e293b] p-4 border-b border-[#374151]">
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-[#374151] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#58cc02] to-[#2fa946] h-3 rounded-full transition-all duration-500"
                    style={{
                      width: showCareerOptions ? '33%' :
                             showMiniEvent ? '66%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showCareerOptions ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showCareerOptions && "Career Leap or Comfort Zone"}
                {showMiniEvent && "Recession Monster Appears!"}
                {showSummary && "Round 1 Complete!"}
              </h1>
            </div>
          </div>

          {/* Mascot Section */}
          <div className="bg-gradient-to-r from-[#252547] to-[#2d3748] p-4 border-b border-[#374151] sticky top-0 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-sm w-full">
                  <MascotDialogue
                    dialogues={mascotDialogues}
                    currentDialogueIndex={currentDialogueIndex}
                    onDialogueEnd={nextDialogue}
                  />
                  
                  {/* Speaking indicator */}
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
          
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 pb-6">
            <div className="max-w-2xl mx-auto">
              
              {/* Career Options */}
              {showCareerOptions && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose your career path!</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Stay in Current Job')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay in Current Job</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Salary: ₹12L/year</p>
                      </div>
                      <div className="text-3xl">💼</div>
                    </div>
                    <p className="text-gray-400 text-sm">Low risk, slow promotions, but stable life.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Join Startup')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Join Startup</h3>
                        <p className="text-orange-400 font-bold text-xl">Salary: ₹10L/year + ESOPs</p>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>
                    <p className="text-gray-400 text-sm">Medium risk, potential for 10x growth or zero, exciting but unstable.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('MBA / Higher Studies')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">MBA / Higher Studies</h3>
                        <p className="text-red-500 font-bold text-xl">Cost: ₹15L fees, 2 years no salary</p>
                      </div>
                      <div className="text-3xl">📚</div>
                    </div>
                    <p className="text-gray-400 text-sm">Potential for 2x-3x salary but huge debt if market is bad.</p>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Freelance / Small Business')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Freelance / Small Business</h3>
                        <p className="text-purple-400 font-bold text-xl">Income: Unpredictable</p>
                      </div>
                      <div className="text-3xl">💡</div>
                    </div>
                    <p className="text-gray-400 text-sm">High risk, unlimited growth if successful, but inconsistent income.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Recession */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Recession Monster Appears!</h2>
                  <p className="text-gray-300 text-center mb-6">A sudden economic downturn hits the market. How does your career choice hold up?</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Impact</span>
                    <span className="text-xl">📉</span>
                  </button>
                </div>
              )}

              {/* Summary Screen */}
              {showSummary && (
                <div className="space-y-6">
                  {/* Celebration */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 1 Complete!</h2>
                    <p className="text-gray-300">You've navigated your first career decision in your 30s!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Career Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.careerChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                            userChoices.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {userChoices.riskLevel}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Growth Potential</p>
                        <p className="font-bold text-white text-lg">{userChoices.growth}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Stability</p>
                        <p className="font-bold text-white text-lg">{userChoices.stability}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Happiness</p>
                        <p className="font-bold text-white text-lg">{userChoices.happiness}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Stress Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.stressLevel}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Your 30s are a time for calculated risks. Comfort can be a trap, but reckless leaps can be ruinous. Choose wisely."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level2/round2')}
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
