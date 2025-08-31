import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';

const Round6 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showParenthoodChoices, setShowParenthoodChoices] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showFuturePlanning, setShowFuturePlanning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    parenthoodChoice: null,
    miniEventOutcome: null,
    futurePlan: null,
    money: 0,
    happiness: 'Stable',
    stressLevel: 'Low',
    freedom: 'High',
    familyNagging: 'Low',
    societyGossip: 'Low',
    expenses: 0,
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
    setShowParenthoodChoices(true);
    setMascotDialogues([
      { text: "Now your choices are not just about you, but about your family and your future.", audioSrc: null },
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
      if (showParenthoodChoices) {
        setShowParenthoodChoices(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: School admission fees / doctor bills.", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showMiniEvent) {
        setShowMiniEvent(false);
        setShowFuturePlanning(true);
        setMascotDialogues([{ text: "Follow-up: Future plan — Education fund for kid, Retirement savings for self, or Spend on luxuries?", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showFuturePlanning) {
        setShowFuturePlanning(false);
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
      const userRoundRef = doc(database, "Users", auth.currentUser.uid, "Progress", "Round6");
  
      // Check if parent user doc exists
      const userSnap = await getDoc(userProgressRef);
  
      if (userSnap.exists()) {
        // Update or create Round6 inside Progress subcollection
        await setDoc(userRoundRef, { ...userChoices }, { merge: true });
        await updateDoc(userProgressRef, { level: 1, round: 6, round6_completed: true });
      } else {
        // If user doc doesn't exist, create it along with Round6 data
        await setDoc(userProgressRef, { level: 1, round: 6, round6_completed: true });
        await setDoc(userRoundRef, { ...userChoices });
      }
  
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };
  

  const handleParenthoodChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let happiness = userChoices.happiness;
    let stressLevel = userChoices.stressLevel;
    let freedom = userChoices.freedom;
    let familyNagging = userChoices.familyNagging;
    let societyGossip = userChoices.societyGossip;
    let expenses = userChoices.expenses;
    let parenthoodFeedback = '';

    switch (choice) {
      case 'Have Kids Now':
        money -= 300000; // Initial expenses
        expenses += 300000;
        happiness = 'High ↑';
        stressLevel = 'High ↑';
        freedom = 'Low ↓';
        parenthoodFeedback = 'Congratulations! Having kids now means joy and new expenses.';
        break;
      case 'Delay Parenthood':
        money += 100000; // Saved expenses
        happiness = 'Stable';
        stressLevel = 'Medium';
        familyNagging = 'High ↑';
        parenthoodFeedback = 'Delaying parenthood saves money, but might increase family pressure.';
        break;
      case 'Stay Child-Free':
        money += 200000; // Significant savings
        happiness = 'Stable';
        stressLevel = 'Low';
        freedom = 'Very High ↑↑';
        societyGossip = 'High ↑';
        parenthoodFeedback = 'Staying child-free offers freedom and financial independence, but also society gossip.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      parenthoodChoice: choice,
      money: money,
      happiness: happiness,
      stressLevel: stressLevel,
      freedom: freedom,
      familyNagging: familyNagging,
      societyGossip: societyGossip,
      expenses: expenses,
    }));
    setMascotDialogues([
      { text: parenthoodFeedback, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventOutcome = () => {
    stopSpeaking();
    let money = userChoices.money;
    let expenses = userChoices.expenses;
    let miniEventText = '';

    if (userChoices.parenthoodChoice === 'Have Kids Now') {
      const eventType = Math.random() < 0.5 ? 'school' : 'doctor';
      if (eventType === 'school') {
        money -= 50000; 
        expenses += 50000;
        miniEventText = 'School admission fees suddenly hit! Another significant expense to manage.';
      } else {
        money -= 30000; 
        expenses += 30000;
        miniEventText = 'Unexpected doctor bills for the kid. Parenthood comes with these surprises.';
      }
    } else {
      miniEventText = 'No immediate family-related mini-event. Your choices have kept things stable for now.';
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      expenses: expenses,
    }));
    setMascotDialogues([
      { text: miniEventText, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleFuturePlanning = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let futureSecurity = 'Medium';
    let happiness = userChoices.happiness;
    let futurePlanFeedback = '';

    switch (choice) {
      case 'Education fund for kid':
        money -= 100000;
        futureSecurity = 'High ↑';
        happiness = 'High ↑';
        futurePlanFeedback = 'Investing in your child\'s education is a great long-term plan!';
        break;
      case 'Retirement savings for self':
        money -= 150000;
        futureSecurity = 'Very High ↑↑';
        happiness = 'Stable';
        futurePlanFeedback = 'Securing your retirement is crucial for your financial independence.';
        break;
      case 'Spend on luxuries':
        money -= 50000;
        futureSecurity = 'Low ↓';
        happiness = 'Very High ↑↑';
        futurePlanFeedback = 'Enjoying luxuries is good, but don\'t forget future planning!';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      futurePlan: choice,
      money: money,
      futureSecurity: futureSecurity,
      happiness: happiness,
    }));
    setMascotDialogues([
      { text: futurePlanFeedback, audioSrc: null }
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
      {(showParenthoodChoices || showMiniEvent || showFuturePlanning || showSummary) && (
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
                      width: showParenthoodChoices ? '25%' :
                             showMiniEvent ? '50%' :
                             showFuturePlanning ? '75%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showParenthoodChoices ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showFuturePlanning ? '3/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showParenthoodChoices && "Parenthood & Future Planning"}
                {showMiniEvent && "Life's Little Surprises!"}
                {showFuturePlanning && "Planning for Tomorrow"}
                {showSummary && "Round 6 Complete!"}
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
              
              {/* Parenthood Choices */}
              {showParenthoodChoices && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">What's your choice on parenthood?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleParenthoodChoice('Have Kids Now')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Have Kids Now</h3>
                        <p className="text-red-500 font-bold text-xl">Expenses ↑↑, Happiness ↑, Stress ↑</p>
                      </div>
                      <div className="text-3xl">👨‍👩‍👧‍👦</div>
                    </div>
                    <p className="text-gray-400 text-sm">Embark on the journey of parenthood now, with all its joys and financial demands.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleParenthoodChoice('Delay Parenthood')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Delay Parenthood</h3>
                        <p className="text-orange-400 font-bold text-xl">Money ↑, Happiness Stable, Family Nagging ↑</p>
                      </div>
                      <div className="text-3xl">⏳</div>
                    </div>
                    <p className="text-gray-400 text-sm">Postpone having children to focus on financial stability and personal growth.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleParenthoodChoice('Stay Child-Free')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md-text-xl font-bold text-white mb-1">Stay Child-Free</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Freedom ↑, Society Gossip ↑</p>
                      </div>
                      <div className="text-3xl">🧘‍♀️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Opt for a child-free lifestyle, maximizing personal freedom and financial resources.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: School admission fees / doctor bills */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Life's Little Surprises!</h2>
                  <p className="text-gray-300 text-center mb-6">Parenthood often brings unexpected expenses. Let's see what you encounter.</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Impact</span>
                    <span className="text-xl">💸</span>
                  </button>
                </div>
              )}

              {/* Future Planning Question */}
              {showFuturePlanning && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">What's your future plan?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleFuturePlanning('Education fund for kid')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">📚</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Education fund for kid</h3>
                        <p className="text-gray-400 text-sm">Secure your child's future education.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleFuturePlanning('Retirement savings for self')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">👴👵</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Retirement savings for self</h3>
                        <p className="text-gray-400 text-sm">Prioritize your long-term financial independence.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleFuturePlanning('Spend on luxuries')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💎</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Spend on luxuries</h3>
                        <p className="text-gray-400 text-sm">Enjoy the finer things in life now.</p>
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 6 Complete!</h2>
                    <p className="text-gray-300">You've made crucial decisions about parenthood and your future!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Parenthood Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.parenthoodChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Happiness</p>
                        <p className="font-bold text-white text-lg">{userChoices.happiness}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Stress Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.stressLevel}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Freedom</p>
                        <p className="font-bold text-white text-lg">{userChoices.freedom}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Family Nagging</p>
                        <p className="font-bold text-white text-lg">{userChoices.familyNagging}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Society Gossip</p>
                        <p className="font-bold text-white text-lg">{userChoices.societyGossip}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Future Plan</p>
                        <p className="font-bold text-white text-lg">{userChoices.futurePlan || 'None'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Now your choices are not just about you, but about your family and your future."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        saveUserProgress();
                        // window.location.href = '/level1/round7'; // Assuming round 7 or next level exists
                      }}
                    >
                      <span>Complete Level 1</span>
                      <span className="text-xl">🎉</span>
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

export default Round6;