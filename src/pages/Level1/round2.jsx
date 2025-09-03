import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress as saveProgress } from '../../utils/firebaseUtils';

const Round2 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showLivingOptions, setShowLivingOptions] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showMonthlySavingsChoice, setShowMonthlySavingsChoice] = useState(false);
  const [showRandomLifeTwist, setShowRandomLifeTwist] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    livingChoice: null,
    monthlyExpense: 0,
    savingsImpact: 'Medium', 
    freedom: 'Balanced', 
    stressLevel: 'Low', 
    asset: 'None', 
    miniEventOutcome: null,
    monthlySavingsAction: null,
    randomLifeTwistOutcome: null,
    happiness: 'Stable',
    money: 0,
    riskLevel: 'Medium',
  });
  const [selectedLivingType, setSelectedLivingType] = useState(null);
  const [miniEventChoices, setMiniEventChoices] = useState([]);

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
    setShowLivingOptions(true);
    setMascotDialogues([
      { text: "Congratulations! You’ve settled into your job. Now comes a big question — where are you going to live? Your choice will shape both your monthly expenses and your lifestyle.", audioSrc: null },
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
      if (showLivingOptions) {
        setShowLivingOptions(false);
        setShowMiniEvent(true); 
      } else if (showMiniEvent) {
        setShowMiniEvent(false);
        setShowMonthlySavingsChoice(true); 
      } else if (showMonthlySavingsChoice) {
        setShowMonthlySavingsChoice(false);
        setShowRandomLifeTwist(true); 
      } else if (showRandomLifeTwist) {
        setShowRandomLifeTwist(false);
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
    await saveProgress('level1', 'round2', userChoices);
  };

  const handleLivingOptionSelection = (option) => {
    stopSpeaking();
    
    let monthlyExpense = 0;
    let savingsImpact = 'Medium';
    let freedom = 'Balanced';
    let stressLevel = 'Medium';
    let asset = 'None';
    let livingDescription = '';
    let livingType = '';
    
    switch (option) {
      case 'Stay with Parents':
        monthlyExpense = 10000;
        savingsImpact = 'High';
        freedom = 'Limited';
        stressLevel = 'Low';
        livingType = 'parents';
        livingDescription = "You save a lot of money and have family support, but you miss out on independence and growth experiences.";
        break;
      case 'Rent a Flat with Friends':
        monthlyExpense = 25000;
        savingsImpact = 'Medium–Low';
        freedom = 'High';
        stressLevel = 'Medium';
        livingType = 'friends';
        livingDescription = "Lots of fun, more independence. But your bank balance shrinks faster.";
        break;
      case 'Buy Your Own Flat on Loan (EMI)':
        monthlyExpense = 40000;
        savingsImpact = 'Very Low';
        freedom = 'High';
        stressLevel = 'High';
        asset = 'Property';
        livingType = 'own_flat';
        livingDescription = "Prestige! You now own a flat, but a heavy EMI locks you into years of debt.";
        break;
      default:
        livingDescription = "An unexpected living situation!";
    }
    
    setUserChoices(prev => ({
      ...prev,
      livingChoice: option,
      monthlyExpense: monthlyExpense,
      savingsImpact: savingsImpact,
      freedom: freedom,
      stressLevel: stressLevel,
      asset: asset,
    }));
    
    setSelectedLivingType(livingType);
    
    setMascotDialogues([
      { text: livingDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventChoice = (choice) => {
    stopSpeaking();
    let miniEventOutcome = '';
    let happiness = userChoices.happiness;
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;

    switch (selectedLivingType) {
      case 'parents':
        if (choice === 'help_fully') {
          money -= 50000;
          happiness = 'High ↑';
          miniEventOutcome = 'You contributed ₹50,000 for home renovation. Your family respects you more.';
        } else if (choice === 'help_partially') {
          money -= 25000; 
          happiness = 'Medium';
          miniEventOutcome = 'You contributed partially to home renovation. A balanced decision.';
        } else if (choice === 'refuse') {
          happiness = 'Low ↓';
          stressLevel = 'High';
          miniEventOutcome = 'You refused to help with home renovation. Your savings are intact, but family respect decreased.';
        }
        break;
      case 'friends':
        if (choice === 'pay_his_rent') {
          money -= userChoices.monthlyExpense / 2; 
          happiness = 'High ↑';
          miniEventOutcome = 'You helped your friend with rent. Your friendship strengthened.';
        } else if (choice === 'say_no') {
          happiness = 'Low ↓';
          stressLevel = 'Medium ↑';
          miniEventOutcome = 'You chose not to pay your friend\'s rent. Your money is stable, but friendship is strained.';
        }
        break;
      case 'own_flat':
        if (choice === 'accept') {
          money -= 5000; 
          stressLevel = 'Very High ↑↑';
          miniEventOutcome = 'You accepted the increased EMI. Your savings are further reduced due to higher payments.';
        } else if (choice === 'prepay') {
          money -= 500000; 
          stressLevel = 'Medium ↓';
          miniEventOutcome = 'You prepaid with savings to reduce the EMI burden. Your savings drastically decreased but future stress is lower.';
        }
        break;
      default:
        miniEventOutcome = 'No specific outcome for this choice.';
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventOutcome,
      happiness: happiness,
      money: money,
      stressLevel: stressLevel,
    }));

    setMascotDialogues([
      { text: miniEventOutcome, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMonthlySavingsChoice = (choice) => {
    stopSpeaking();
    let savingsMessage = '';
    let happiness = userChoices.happiness;
    let money = userChoices.money;

    switch (choice) {
      case 'spend_trips':
        happiness = 'High ↑';
        savingsMessage = 'Great memories, but future savings don’t grow.';
        break;
      case 'invest_mutual_funds':
        money += (userChoices.money * 0.1); 
        savingsMessage = 'Smart! Money compounds with time.';
        break;
      case 'keep_savings_account':
        savingsMessage = 'Safe, but inflation eats value.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      monthlySavingsAction: choice,
      happiness: happiness,
      money: money,
    }));

    setMascotDialogues([
      { text: savingsMessage, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleRandomLifeTwist = (choice) => {
    stopSpeaking();
    let twistOutcome = '';
    let happiness = userChoices.happiness;
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;

    switch (choice) {
      case 'yes_goa':
        happiness = 'High ↑';
        money -= 15000;
        stressLevel = 'Medium ↑';
        twistOutcome = 'You went to Goa! Happiness increased, but money decreased, and stress slightly increased.';
        break;
      case 'no_goa':
        money += 5000; 
        happiness = 'Stable';
        stressLevel = 'Low ↓';
        twistOutcome = 'You skipped the Goa trip. Money increased, happiness is stable, and stress decreased.';
        break;
      case 'cheaper_trip':
        money -= 5000;
        happiness = 'Medium ↑';
        stressLevel = 'Low';
        twistOutcome = 'You convinced friends for a cheaper trip. Balanced outcome.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      randomLifeTwistOutcome: choice,
      happiness: happiness,
      money: money,
      stressLevel: stressLevel,
    }));

    setMascotDialogues([
      { text: twistOutcome, audioSrc: null }
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
      {(showLivingOptions || showMiniEvent || showMonthlySavingsChoice || showRandomLifeTwist || showSummary) && (
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
                      width: showLivingOptions ? '20%' :
                             showMiniEvent ? '40%' :
                             showMonthlySavingsChoice ? '60%' :
                             showRandomLifeTwist ? '80%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showLivingOptions ? '1/4' :
                   showMiniEvent ? '2/4' :
                   showMonthlySavingsChoice ? '3/4' :
                   showRandomLifeTwist ? '4/4' : '4/4'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showLivingOptions && "Where Will You Live?"}
                {showMiniEvent && "A Surprise Event!"}
                {showMonthlySavingsChoice && "Your Monthly Savings"}
                {showRandomLifeTwist && "Life's Little Surprises"}
                {showSummary && "Round 2 Complete!"}
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
              
              {/* Living Options */}
              {showLivingOptions && (
                <div className="space-y-4">
                  {/* Stay with Parents Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLivingOptionSelection('Stay with Parents')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Stay with Parents</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹10,000/month</p>
                      </div>
                      <div className="text-3xl">🏡</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">High Savings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">Limited Freedom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">Low Stress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-lg">Description: You save a lot of money and have family support, but you miss out on independence and growth experiences.</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rent a Flat with Friends Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLivingOptionSelection('Rent a Flat with Friends')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Rent a Flat with Friends</h3>
                        <p className="text-orange-400 font-bold text-xl">₹25,000/month</p>
                      </div>
                      <div className="text-3xl">🏠</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">Medium–Low Savings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">High Freedom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">Medium Stress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-lg">Description: Lots of fun, more independence. But your bank balance shrinks faster.</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Buy Your Own Flat on Loan (EMI) Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLivingOptionSelection('Buy Your Own Flat on Loan (EMI)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy Your Own Flat on Loan (EMI)</h3>
                        <p className="text-red-500 font-bold text-xl">₹40,000/month EMI</p>
                      </div>
                      <div className="text-3xl">🏦</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">Very Low Savings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">Property Asset</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">High Stress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-lg">Description: Prestige! You now own a flat, but a heavy EMI locks you into years of debt.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mini Event */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Extra Mini Event!</h2>
                  {selectedLivingType === 'parents' && (
                    <>
                      <p className="text-gray-300 text-center mb-4">Parents say: "Beta, can you contribute ₹50,000 for home renovation this year?"</p>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('help_fully')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">🤝</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Help fully</h3>
                            <p className="text-gray-400 text-sm">Savings ↓, Respect ↑</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('help_partially')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">👍</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Help partially</h3>
                            <p className="text-gray-400 text-sm">Balanced outcome</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('refuse')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">🙅‍♀️</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Refuse</h3>
                            <p className="text-gray-400 text-sm">Savings ↑, Family Respect ↓</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedLivingType === 'friends' && (
                    <>
                      <p className="text-gray-300 text-center mb-4">One friend loses job. What do you do?</p>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('pay_his_rent')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">🫂</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Pay his rent</h3>
                            <p className="text-gray-400 text-sm">Money ↓, Friendship ↑</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('say_no')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">🥶</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Say no</h3>
                            <p className="text-gray-400 text-sm">Money stable, Friendship ↓</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedLivingType === 'own_flat' && (
                    <>
                      <p className="text-gray-300 text-center mb-4">Bank calls: "Interest rate up! EMI is now ₹45,000."</p>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('accept')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">😩</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Accept</h3>
                            <p className="text-gray-400 text-sm">Savings ↓ further</p>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleMiniEventChoice('prepay')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">💸</div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Prepay with savings</h3>
                            <p className="text-gray-400 text-sm">Savings ↓ drastically</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Monthly Savings Choice */}
              {showMonthlySavingsChoice && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">At the end of the month, you still manage to save something. What will you do with it?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMonthlySavingsChoice('spend_trips')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🎉</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Spend on weekend trips & parties</h3>
                        <p className="text-gray-400 text-sm">Great memories, but future savings don’t grow.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMonthlySavingsChoice('invest_mutual_funds')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Invest in Mutual Funds / SIP</h3>
                        <p className="text-gray-400 text-sm">Smart! Money compounds with time.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleMonthlySavingsChoice('keep_savings_account')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🏦</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Keep in Savings Account only</h3>
                        <p className="text-gray-400 text-sm">Safe, but inflation eats value.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Random Life Twist */}
              {showRandomLifeTwist && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Random Life Twist: College friend calls: "Goa trip! ₹15,000 per head. Are you in?"</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleRandomLifeTwist('yes_goa')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">YES</h3>
                        <p className="text-gray-400 text-sm">Happiness ↑, Money ↓, Stress ↑</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleRandomLifeTwist('no_goa')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">❌</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">NO</h3>
                        <p className="text-gray-400 text-sm">Money ↑, Happiness stable, Stress ↓</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleRandomLifeTwist('cheaper_trip')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🤝</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Convince friends for cheaper trip</h3>
                        <p className="text-gray-400 text-sm">Balanced outcome</p>
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 2 Complete!</h2>
                    <p className="text-gray-300">You've made your living choices and handled life's surprises.</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Living Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.livingChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Monthly Expense</p>
                        <p className="font-bold text-red-400 text-lg">₹{userChoices.monthlyExpense.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Savings Impact</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.savingsImpact === 'High' ? 'bg-green-500/20 text-green-400' :
                            userChoices.savingsImpact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            userChoices.savingsImpact === 'Medium–Low' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {userChoices.savingsImpact}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Freedom Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.freedom}</p>
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
                        <p className="text-gray-400 text-sm mb-1">Asset Owned</p>
                        <p className="font-bold text-white text-lg">{userChoices.asset}</p>
                      </div>
                       <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Happiness</p>
                        <p className="font-bold text-white text-lg">{userChoices.happiness}</p>
                      </div>
                       <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Every lifestyle choice comes with a price tag. Comfort and independence are important, but so is planning your future. Think wisely — your 20s are when financial habits are built."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level1/round3')}
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
