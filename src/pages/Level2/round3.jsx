import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';

const Round3 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showHouseOptions, setShowHouseOptions] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    houseChoice: null,
    miniEventOutcome: null,
    money: 0,
    debt: false,
    freedom: 'High',
    satisfaction: 'Medium',
    stressLevel: 'Low',
  });

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
    setShowHouseOptions(true);
    setMascotDialogues([
      { text: "Friends buying flats, Instagram flexing interiors. Should you join or stay liquid?", audioSrc: null },
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
      if (showHouseOptions) {
        setShowHouseOptions(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: Property Market Twist", audioSrc: null }]);
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
    }
  }, [currentDialogueIndex, mascotDialogues]);

  const saveUserProgress = async () => {
    if (!auth.currentUser) return;
    try {
      const userProgressRef = doc(database, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(userProgressRef);
      if (docSnap.exists()) {
        await updateDoc(userProgressRef, { "level2.round3": userChoices, "round3_completed": true });
      } else {
        await setDoc(userProgressRef, { "level2": { "round3": userChoices }, "round3_completed": true });
      }
      console.log("Level 2 Round 3 Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleHouseChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let debt = userChoices.debt;
    let freedom = userChoices.freedom;
    let satisfaction = userChoices.satisfaction;
    let stressLevel = userChoices.stressLevel;
    let consequence = '';

    switch (choice) {
      case 'Buy Dream Home with Loan':
        money -= 500000; // Down payment example
        debt = true;
        freedom = 'Low ↓';
        satisfaction = 'High ↑';
        stressLevel = 'High ↑';
        consequence = 'Emotional satisfaction, but chained to EMIs.';
        break;
      case 'Rent + Invest Savings':
        money += 100000; // Example of savings growth
        debt = false;
        freedom = 'Very High ↑↑';
        satisfaction = 'Medium';
        stressLevel = 'Low';
        consequence = 'Freedom to move cities + financial growth if investments click.';
        break;
      case 'Buy Small House Now, Upgrade Later':
        money -= 250000; // Down payment example
        debt = true;
        freedom = 'Medium';
        satisfaction = 'Medium';
        stressLevel = 'Medium';
        consequence = 'Compromise today, bigger home later.';
        break;
      case 'Stay with Parents, Save Hard':
        money += 200000; // Significant savings
        debt = false;
        freedom = 'Very Low ↓↓';
        satisfaction = 'Low';
        stressLevel = 'Medium';
        consequence = 'Wallet fat, independence zero.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      houseChoice: choice,
      money: money,
      debt: debt,
      freedom: freedom,
      satisfaction: satisfaction,
      stressLevel: stressLevel,
    }));
    setMascotDialogues([
      { text: `You chose to ${choice}. ${consequence}`, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventOutcome = () => {
    stopSpeaking();
    let money = userChoices.money;
    let miniEventText = '';
    let satisfaction = userChoices.satisfaction;

    switch (userChoices.houseChoice) {
      case 'Buy Dream Home with Loan':
        money -= 100000; // Property value crash
        satisfaction = 'Low ↓';
        miniEventText = 'Property prices crashed! You regret buying now. Significant financial loss.';
        break;
      case 'Rent + Invest Savings':
        money += 50000; // Investment growth
        miniEventText = 'Property prices skyrocketed! You missed a chance to own, but your investments grew.';
        break;
      case 'Buy Small House Now, Upgrade Later':
        miniEventText = 'The market stabilized, your small house value is steady. A balanced outcome.';
        break;
      case 'Stay with Parents, Save Hard':
        money += 100000; // Continued savings
        miniEventText = 'Cash ready when market corrects. Your patience paid off.';
        break;
      default:
        miniEventText = 'A mini-event occurred, but its impact on your housing situation is neutral.';
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      satisfaction: satisfaction,
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
      {(showHouseOptions || showMiniEvent || showSummary) && (
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
                      width: showHouseOptions ? '33%' :
                             showMiniEvent ? '66%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showHouseOptions ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showHouseOptions && "House vs. Freedom"}
                {showMiniEvent && "Property Market Twist!"}
                {showSummary && "Round 3 Complete!"}
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
              
              {/* House Options */}
              {showHouseOptions && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Should you join or stay liquid?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHouseChoice('Buy Dream Home with Loan')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy Dream Home with Loan</h3>
                        <p className="text-red-500 font-bold text-xl">Cost: ₹50L house, 20-year EMI ₹40K/month</p>
                      </div>
                      <div className="text-3xl">🏡</div>
                    </div>
                    <p className="text-gray-400 text-sm">Emotional satisfaction, chained to EMIs.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHouseChoice('Rent + Invest Savings')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Rent + Invest Savings</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Cost: Rent ₹20K/month</p>
                      </div>
                      <div className="text-3xl">📈</div>
                    </div>
                    <p className="text-gray-400 text-sm">Freedom to move cities + financial growth if investments click.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHouseChoice('Buy Small House Now, Upgrade Later')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy Small House Now, Upgrade Later</h3>
                        <p className="text-orange-400 font-bold text-xl">Cost: ₹25L</p>
                      </div>
                      <div className="text-3xl">🏠</div>
                    </div>
                    <p className="text-gray-400 text-sm">Compromise today, bigger home later.</p>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHouseChoice('Stay with Parents, Save Hard')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay with Parents, Save Hard</h3>
                        <p className="text-purple-400 font-bold text-xl">Cost: Minimal</p>
                      </div>
                      <div className="text-3xl">👨‍👩‍👧‍👦</div>
                    </div>
                    <p className="text-gray-400 text-sm">Wallet fat, independence zero.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Property Market Twist */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Property Market Twist!</h2>
                  <p className="text-gray-300 text-center mb-6">The property market takes an unexpected turn. How does it affect you?</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Impact</span>
                    <span className="text-xl">💸</span>
                  </button>
                </div>
              )}

              {/* Summary Screen */}
              {showSummary && (
                <div className="space-y-6">
                  {/* Celebration */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 3 Complete!</h2>
                    <p className="text-gray-300">You've made a crucial decision about your living situation and financial future!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">House Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.houseChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Debt Incurred</p>
                        <p className="font-bold text-white text-lg">{userChoices.debt ? <span className="text-red-400">Yes</span> : <span className="text-[#58cc02]">No</span>}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Freedom</p>
                        <p className="font-bold text-white text-lg">{userChoices.freedom}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Satisfaction</p>
                        <p className="font-bold text-white text-lg">{userChoices.satisfaction}</p>
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
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Friends buying flats, Instagram flexing interiors. Should you join or stay liquid?"
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        saveUserProgress();
                        window.location.href = '/level2/round4';
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

export default Round3;
