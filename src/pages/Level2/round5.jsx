import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress as saveProgress } from '../../utils/firebaseUtils';

const Round5 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showHealthOptions, setShowHealthOptions] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    healthChoice: null,
    miniEventOutcome: null,
    money: 0,
    healthStatus: 'Normal',
    medicalBills: 0,
    happiness: 'Stable',
    stressLevel: 'Low',
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
    setShowHealthOptions(true);
    setMascotDialogues([
      { text: "Sedentary job, junk food, zero exercise. Cholesterol levels laugh at you.", audioSrc: null },
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
      if (showHealthOptions) {
        setShowHealthOptions(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: Health Scare at 36", audioSrc: null }]);
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
      await saveProgress(2, 5, userChoices);
      console.log("Level 2 Round 5 Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleHealthChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let healthStatus = userChoices.healthStatus;
    let medicalBills = userChoices.medicalBills;
    let happiness = userChoices.happiness;
    let stressLevel = userChoices.stressLevel;
    let consequence = '';

    switch (choice) {
      case 'Proper Fitness Routine':
        money -= 30000; 
        healthStatus = 'Healthy';
        medicalBills = 0;
        happiness = 'Very High ↑↑';
        stressLevel = 'Low';
        consequence = 'Long-term health, lower medical bills.';
        break;
      case 'Half-Hearted Gym + Quit Soon':
        money -= 10000; 
        healthStatus = 'Unchanged';
        medicalBills = 0;
        happiness = 'Medium';
        stressLevel = 'Medium';
        consequence = 'Money gone, health unchanged.';
        break;
      case 'Home Workouts + Discipline':
        money -= 5000; 
        healthStatus = 'Healthy';
        medicalBills = 0;
        happiness = 'High ↑';
        stressLevel = 'Low';
        consequence = 'Low cost, works if consistent.';
        break;
      case 'Ignore Health, Work Harder':
        healthStatus = 'Poor';
        medicalBills = 0; // Will incur later
        happiness = 'Low ↓';
        stressLevel = 'High';
        consequence = 'Hospital bills waiting at 40.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      healthChoice: choice,
      money: money,
      healthStatus: healthStatus,
      medicalBills: medicalBills,
      happiness: happiness,
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
    let medicalBills = userChoices.medicalBills;
    let healthStatus = userChoices.healthStatus;
    let stressLevel = userChoices.stressLevel;

    switch (userChoices.healthChoice) {
      case 'Proper Fitness Routine':
      case 'Home Workouts + Discipline':
        miniEventText = 'Just routine check-ups. Your healthy lifestyle paid off!';
        break;
      case 'Half-Hearted Gym + Quit Soon':
        medicalBills = 50000; 
        money -= medicalBills;
        stressLevel = 'High ↑';
        miniEventText = 'A minor health scare! Medical expenses eat into your savings.';
        break;
      case 'Ignore Health, Work Harder':
        medicalBills = 200000; 
        money -= medicalBills;
        healthStatus = 'Critical';
        stressLevel = 'Very High ↑↑';
        miniEventText = 'A major health scare at 36! Huge medical expenses and critical health condition.';
        break;
      default:
        miniEventText = 'The mini-event had a neutral impact on your health.';
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      medicalBills: medicalBills,
      healthStatus: healthStatus,
      stressLevel: stressLevel,
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
      {(showHealthOptions || showMiniEvent || showSummary) && (
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
                      width: showHealthOptions ? '33%' :
                             showMiniEvent ? '66%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showHealthOptions ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showHealthOptions && "Health Reality Check"}
                {showMiniEvent && "Health Scare at 36!"}
                {showSummary && "Round 5 Complete!"}
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
              
              {/* Health Options */}
              {showHealthOptions && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose your health path!</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHealthChoice('Proper Fitness Routine')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Proper Fitness Routine</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Cost: ₹30K/year gym + diet</p>
                      </div>
                      <div className="text-3xl">🏋️‍♀️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Long-term health, lower medical bills.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHealthChoice('Half-Hearted Gym + Quit Soon')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Half-Hearted Gym + Quit Soon</h3>
                        <p className="text-orange-400 font-bold text-xl">Cost: ₹10K wasted</p>
                      </div>
                      <div className="text-3xl">🤷‍♀️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Money gone, health unchanged.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHealthChoice('Home Workouts + Discipline')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Home Workouts + Discipline</h3>
                        <p className="text-purple-400 font-bold text-xl">Cost: ₹5K</p>
                      </div>
                      <div className="text-3xl">🏠💪</div>
                    </div>
                    <p className="text-gray-400 text-sm">Low cost, works if consistent.</p>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHealthChoice('Ignore Health, Work Harder')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Ignore Health, Work Harder</h3>
                        <p className="text-red-500 font-bold text-xl">Cost: ₹0 now</p>
                      </div>
                      <div className="text-3xl">🚫❤️</div>
                    </div>
                    <p className="text-gray-400 text-sm">Hospital bills waiting at 40.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Health Scare */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Health Scare at 36!</h2>
                  <p className="text-gray-300 text-center mb-6">A sudden health issue arises. How does your lifestyle choices affect the outcome?</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Outcome</span>
                    <span className="text-xl">💔</span>
                  </button>
                </div>
              )}

              {/* Summary Screen */}
              {showSummary && (
                <div className="space-y-6">
                  {/* Celebration */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 5 Complete!</h2>
                    <p className="text-gray-300">You've faced a health reality check!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Health Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.healthChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Health Status</p>
                        <p className="font-bold text-white text-lg">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userChoices.healthStatus === 'Healthy' ? 'bg-green-500/20 text-green-400' :
                            userChoices.healthStatus === 'Unchanged' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {userChoices.healthStatus}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Medical Bills Incurred</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.medicalBills.toLocaleString()}</p>
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
                      "Investing in your health is investing in your future. Neglecting it can lead to significant financial and personal costs."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        saveUserProgress();
                        navigate('/level2/round6');
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

export default Round5;
