import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress as saveProgress } from '../../utils/firebaseUtils';

const Round6 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showMoneyOptions, setShowMoneyOptions] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    moneyChoice: null,
    miniEventOutcome: null,
    money: 0,
    risk: 'Low',
    growth: 'Stable',
    freedom: 'Medium',
    savings: 0,
  });

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
    setShowMoneyOptions(true);
    setMascotDialogues([
      { text: "Salary’s bigger now. Choices: grow wealth or blow wealth?", audioSrc: null },
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
      if (showMoneyOptions) {
        setShowMoneyOptions(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: Market Crash or Lifestyle Burnout", audioSrc: null }]);
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
    if (!auth.currentUser) return;
    try {
      await saveProgress(2, 6, userChoices);
      console.log("Level 2 Round 6 Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleMoneyChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let risk = userChoices.risk;
    let growth = userChoices.growth;
    let freedom = userChoices.freedom;
    let savings = userChoices.savings;
    let consequence = '';

    switch (choice) {
      case 'Aggressive Investments (Stocks/Crypto)':
        risk = 'High';
        growth = 'Very High';
        freedom = 'Medium';
        savings += Math.random() < 0.6 ? 200000 : -100000; // Simulate high risk, high reward/loss
        money += savings; 
        consequence = 'Rich if lucky, broke if not.';
        break;
      case 'Balanced Funds + SIPs':
        risk = 'Medium';
        growth = 'Medium';
        freedom = 'High';
        savings += 100000; 
        money += savings; 
        consequence = 'Financially free by 45 if consistent.';
        break;
      case 'Lifestyle Upgrade – Car, Gadgets, Trips':
        money -= 500000; 
        risk = 'Low';
        growth = 'None';
        freedom = 'Low';
        savings -= 100000; 
        consequence = 'YOLO life, no savings.';
        break;
      case 'Early FIRE Planning (Financial Freedom)':
        money -= (userChoices.money * 0.5); // 50% salary invested
        risk = 'Medium';
        growth = 'High';
        freedom = 'Very High ↑↑';
        savings += (userChoices.money * 0.5); 
        consequence = 'Retire early, sacrifice luxuries now.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      moneyChoice: choice,
      money: money,
      risk: risk,
      growth: growth,
      freedom: freedom,
      savings: savings,
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
    let risk = userChoices.risk;
    let growth = userChoices.growth;
    let savings = userChoices.savings;

    switch (userChoices.moneyChoice) {
      case 'Aggressive Investments (Stocks/Crypto)':
        if (Math.random() < 0.5) {
          miniEventText = 'The market crashed! Big losses on your aggressive investments.';
          money -= 300000; 
          savings -= 300000;
          risk = 'Very High';
        } else {
          miniEventText = 'Despite market volatility, your aggressive investments yielded big gains!';
          money += 300000; 
          savings += 300000;
          risk = 'Low';
        }
        break;
      case 'Balanced Funds + SIPs':
        miniEventText = 'The market saw slow, steady growth. Your balanced funds performed as expected.';
        money += 50000; 
        savings += 50000; 
        growth = 'Stable';
        break;
      case 'Lifestyle Upgrade – Car, Gadgets, Trips':
        miniEventText = 'Lifestyle burnout hit! You enjoyed the high life, but your savings are drained.';
        money -= 100000; 
        savings -= 100000; 
        break;
      case 'Early FIRE Planning (Financial Freedom)':
        miniEventText = 'Consistent investing led to long-term freedom! Your sacrifices are paying off.';
        money += 200000; 
        savings += 200000; 
        growth = 'High';
        break;
      default:
        miniEventText = 'The mini-event had a neutral impact on your financial strategy.';
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      risk: risk,
      growth: growth,
      savings: savings,
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
      {(showMoneyOptions || showMiniEvent || showSummary) && (
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
                      width: showMoneyOptions ? '33%' :
                             showMiniEvent ? '66%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showMoneyOptions ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showMoneyOptions && "Money Growth vs. Lifestyle Inflation"}
                {showMiniEvent && "Market Crash or Lifestyle Burnout!"}
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
              
              {/* Money Options */}
              {showMoneyOptions && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Grow wealth or blow wealth?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMoneyChoice('Aggressive Investments (Stocks/Crypto)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Aggressive Investments (Stocks/Crypto)</h3>
                        <p className="text-red-500 font-bold text-xl">Risk: High</p>
                      </div>
                      <div className="text-3xl">💹</div>
                    </div>
                    <p className="text-gray-400 text-sm">Rich if lucky, broke if not.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMoneyChoice('Balanced Funds + SIPs')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Balanced Funds + SIPs</h3>
                        <p className="text-orange-400 font-bold text-xl">Risk: Medium</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                    <p className="text-gray-400 text-sm">Financially free by 45 if consistent.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMoneyChoice('Lifestyle Upgrade – Car, Gadgets, Trips')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Lifestyle Upgrade – Car, Gadgets, Trips</h3>
                        <p className="text-purple-400 font-bold text-xl">Risk: Financial drain</p>
                      </div>
                      <div className="text-3xl">🚗✈️</div>
                    </div>
                    <p className="text-gray-400 text-sm">YOLO life, no savings.</p>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMoneyChoice('Early FIRE Planning (Financial Freedom)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Early FIRE Planning (Financial Freedom)</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Cost: 50% salary invested</p>
                      </div>
                      <div className="text-3xl">📈🔥</div>
                    </div>
                    <p className="text-gray-400 text-sm">Retire early, sacrifice luxuries now.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Market Crash or Lifestyle Burnout */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Market Crash or Lifestyle Burnout!</h2>
                  <p className="text-gray-300 text-center mb-6">The market shifts or your lifestyle choices catch up. What's the outcome?</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Outcome</span>
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 6 Complete!</h2>
                    <p className="text-gray-300">You've made decisions about your money growth and lifestyle!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money Growth Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.moneyChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                            userChoices.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {userChoices.risk}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Growth Potential</p>
                        <p className="font-bold text-white text-lg">{userChoices.growth}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Financial Freedom</p>
                        <p className="font-bold text-white text-lg">{userChoices.freedom}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Savings</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.savings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Salary’s bigger now. Choices: grow wealth or blow wealth? Balancing immediate gratification with long-term financial security is key."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        saveUserProgress();
                        // For now, redirect to Level 2 overview after completing Round 6
                        navigate('/levels');
                      }}
                    >
                      <span>Continue to Level 2 Overview</span>
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

export default Round6;
