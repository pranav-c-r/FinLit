import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';

const Round4 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showCareerChoices, setShowCareerChoices] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    careerChoice: null,
    miniEventOutcome: null,
    bonusAction: null,
    money: 0, 
    stressLevel: 'Medium',
    growth: 'Medium',
    stability: 'Medium',
  });
  const [selectedCareerType, setSelectedCareerType] = useState(null);

  const speechSynthesisRef = useRef(window.speechSynthesis);

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
    setShowCareerChoices(true);
    setMascotDialogues([
      { text: "Career growth decisions define your 30s.", audioSrc: null },
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
      if (showCareerChoices) {
        setShowCareerChoices(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: sudden recession — if risky job → maybe layoff, if stable job → secure.", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showMiniEvent) {
        setShowMiniEvent(false);
        setShowBonusQuestion(true);
        setMascotDialogues([{ text: "What to do with bonus?", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showBonusQuestion) {
        setShowBonusQuestion(false);
        setShowSummary(true);
      } else {
        setShowSummary(true);
      }
    }
  };
  
  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    }
  }, [currentDialogueIndex, mascotDialogues]);

  const saveUserProgress = async () => {
    if (!auth.currentUser) return;
    try {
      const userProgressRef = doc(database, "Users", auth.currentUser.uid);
      const userProgressRef2 = doc(userProgressRef, "UserProgress");
      const docSnap = await getDoc(userProgressRef, "UserProgress");
      const docSnap2 = await getDoc(userProgressRef);
      if (docSnap.exists()) {
        await updateDoc(userProgressRef2, { "level1.round4": userChoices });
      } else {
        await setDoc(userProgressRef, { "level1": { "round4": userChoices } });
      }
      if (docSnap2.exists()) {
        await updateDoc(userProgressRef, { "level":1, "round":4, "round4_completed": true });
      } else {
        await setDoc(userProgressRef, { "level":1, "round":4, "level1": { "round4": userChoices }, "round4_completed": true });
      }
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleCareerChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;
    let growth = userChoices.growth;
    let stability = userChoices.stability;
    let careerDescription = '';

    switch (choice) {
      case 'Take Onsite/Abroad Opportunity':
        money += 100000; 
        stressLevel = 'High ↑';
        growth = 'High';
        stability = 'Low';
        careerDescription = 'High income, high stress, family far.';
        break;
      case 'Switch Job for Higher Salary':
        money += 50000; 
        stressLevel = 'Medium ↑';
        growth = 'High';
        stability = 'Medium ↓';
        careerDescription = 'Risk ↑, growth ↑.';
        break;
      case 'Stay Stable in Current Job':
        stressLevel = 'Low';
        growth = 'Low';
        stability = 'High';
        careerDescription = 'Low growth, low stress.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      careerChoice: choice,
      money: money,
      stressLevel: stressLevel,
      growth: growth,
      stability: stability,
    }));
    setSelectedCareerType(choice);
    setMascotDialogues([
      { text: careerDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventOutcome = () => {
    stopSpeaking();
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;
    let miniEventText = '';

    if (selectedCareerType === 'Take Onsite/Abroad Opportunity' || selectedCareerType === 'Switch Job for Higher Salary') {
      money -= 20000;
      stressLevel = 'Very High ↑↑';
      miniEventText = 'A sudden recession hit! Due to your risky job choice, you faced a salary cut.';
    } else {
      stressLevel = 'Low ↓';
      miniEventText = 'A sudden recession hit, but your stable job kept you secure.';
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      stressLevel: stressLevel,
    }));
    setMascotDialogues([
      { text: miniEventText, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleBonusAction = (action) => {
    stopSpeaking();
    let money = userChoices.money;
    let happiness = userChoices.happiness;
    let bonusFeedback = '';

    switch (action) {
      case 'Party':
        money -= 10000; 
        happiness = 'High ↑';
        bonusFeedback = 'You spent your bonus on a party! Fun, but not financially prudent.';
        break;
      case 'Invest in property':
        money -= 50000; 
        bonusFeedback = 'You invested your bonus in property! A smart long-term move.';
        break;
      case 'Emergency fund':
        money += 20000; 
        bonusFeedback = 'You added your bonus to your emergency fund! Good for future security.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      bonusAction: action,
      money: money,
      happiness: happiness,
    }));
    setMascotDialogues([
      { text: bonusFeedback, audioSrc: null }
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
      {(showCareerChoices || showMiniEvent || showBonusQuestion || showSummary) && (
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
                      width: showCareerChoices ? '25%' :
                             showMiniEvent ? '50%' :
                             showBonusQuestion ? '75%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showCareerChoices ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showBonusQuestion ? '3/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showCareerChoices && "Career Growth vs. Stability"}
                {showMiniEvent && "Economic Recession!"}
                {showBonusQuestion && "Bonus Time!"}
                {showSummary && "Round 4 Complete!"}
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
              
              {/* Career Choices */}
              {showCareerChoices && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose your career path:</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Take Onsite/Abroad Opportunity')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Take Onsite/Abroad Opportunity</h3>
                        <p className="text-orange-400 font-bold text-xl">High Income, High Stress, Family Far</p>
                      </div>
                      <div className="text-3xl">✈️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Great earning potential, but demanding and separates you from family.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Switch Job for Higher Salary')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Switch Job for Higher Salary</h3>
                        <p className="text-yellow-400 font-bold text-xl">Risk ↑, Growth ↑</p>
                      </div>
                      <div className="text-3xl">💼</div>
                    </div>
                    <p className="text-gray-400 text-sm">Potential for quick growth, but involves a higher level of risk.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleCareerChoice('Stay Stable in Current Job')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay Stable in Current Job</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Low Growth, Low Stress</p>
                      </div>
                      <div className="text-3xl">🧘‍♀️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Reliable and comfortable, but career progression might be slow.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Recession */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Economic Recession!</h2>
                  <p className="text-gray-300 text-center mb-6">A sudden recession hits. Let's see how your career choice holds up.</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Recession Impact</span>
                    <span className="text-xl">📉</span>
                  </button>
                </div>
              )}

              {/* Bonus Question */}
              {showBonusQuestion && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">You received a bonus! What will you do with it?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleBonusAction('Party')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🥳</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Party</h3>
                        <p className="text-gray-400 text-sm">Enjoy now, but no long-term financial gain.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleBonusAction('Invest in property')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🏠</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Invest in property</h3>
                        <p className="text-gray-400 text-sm">Potential for asset growth, but ties up capital.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleBonusAction('Emergency fund')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💸</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Emergency fund</h3>
                        <p className="text-gray-400 text-sm">Builds financial safety net for unexpected events.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Screen */}
              {showSummary && (
                <div className="space-y-6">
                  {/* Celebration */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 4 Complete!</h2>
                    <p className="text-gray-300">You've navigated career choices and economic shifts.</p>
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
                        <p className="text-gray-400 text-sm mb-1">Stress Level</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.stressLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                            userChoices.stressLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {userChoices.stressLevel}
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
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Career growth decisions define your 30s. Balance between ambition and security is crucial."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        window.location.href = '/level1/round5';
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

export default Round4;
