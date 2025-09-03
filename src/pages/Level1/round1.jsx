import React from 'react'
import { useState, useRef, useEffect } from 'react';
// Force refresh with timestamp: 2
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import ParentDialogue from '../../components/lessons/ParentDialogue';
import ExpenseAllocation from '../../components/lessons/ExpenseAllocation';
import level11Audio from '../../assets/level11.mp3';
import oldManVideoSrc from '../../assets/oldman.mp4';
import { useNavigate } from 'react-router-dom';
import { saveUserProgress as saveProgress } from '../../utils/firebaseUtils';

const Round1 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [showSalaryOptions, setShowSalaryOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    job: null,
    salaryAction: null, // Changed from 'salary' to 'salaryAction' to avoid confusion with money amount
    money: 0,
    savingsHabit: 'No', // Changed from 'savings' to 'savingsHabit' and default to 'No'
    riskLevel: 'Low',
    happiness: 'Stable', // Default to 'Stable'
  });
  const [selectedJobType, setSelectedJobType] = useState(null); // 'mnc', 'startup', or 'government'
  
  // Refs for speech synthesis
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  // Initialize voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length, 'voices available');
      console.log('Voice details:', availableVoices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices immediately if available
    loadVoices();

    // Also set up the event listener for when voices change
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Force voice loading on some browsers
    if (window.speechSynthesis.getVoices().length === 0) {
      console.log('No voices initially, triggering voice load...');
      try {
        const emptyUtterance = new SpeechSynthesisUtterance('');
        emptyUtterance.onend = () => {
          console.log('Empty utterance completed, voices should be loaded');
          loadVoices();
        };
        window.speechSynthesis.speak(emptyUtterance);
      } catch (error) {
        console.log('Could not trigger voice loading, will wait for onvoiceschanged');
      }
    }

    // Cleanup
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  // Text-to-speech function (adapted from your first document)
  const speakText = (text) => {
    if (!text || !text.trim()) return;
    
    console.log('Attempting to speak:', text);
    console.log('Speech synthesis available:', !!window.speechSynthesis);
    console.log('Current voices:', window.speechSynthesis.getVoices().length);
    
    // Stop any current speech
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    try {
      const utterance = new window.SpeechSynthesisUtterance(text);
      
      // Wait for voices to load if needed
      const speakWithVoice = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Available voices:', availableVoices.length, availableVoices.map(v => `${v.name} (${v.lang})`));
        
        // Find a good voice (prefer female voices for mascot)
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

        // Set voice properties for mascot character
        utterance.pitch = 1.2;  // Slightly higher pitch for mascot
        utterance.rate = 0.9;   // Slightly slower for clarity
        utterance.volume = 1.0;

        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          setIsSpeaking(false);
        };

        console.log('Starting speech synthesis...');
        speechSynthesisRef.current.speak(utterance);
      };

      // Check if voices are already loaded
      if (window.speechSynthesis.getVoices().length > 0) {
        speakWithVoice();
      } else {
        // Wait for voices to load
        console.log('Waiting for voices to load...');
        const handleVoicesChanged = () => {
          console.log('Voices loaded, now speaking...');
          speakWithVoice();
          // Remove the listener after using it
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        
        // Fallback: try to speak anyway after a short delay
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length > 0) {
            speakWithVoice();
          } else {
            console.log('Still no voices, trying to speak anyway...');
            speakWithVoice();
          }
        }, 1000);
      }
      
    } catch (err) {
      console.error('Error in speakText:', err);
      setIsSpeaking(false);
    }
  };

  // Stop current speech
  const stopSpeaking = () => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Called when user closes the intro modal
  const handleStartJourney = () => {
    setShowIntro(false);
    setShowGuide(true);
  };

  // Called when user clicks Continue in guide screen
  const handleContinue = () => {
    setShowGuide(false);
    setShowJobOptions(true);
    setMascotDialogues([
      { text: "You’ve just graduated! Congratulations! 🎉 The real world is waiting.", audioSrc: null },
      { text: "You now have to pick your first job — this one choice will set the foundation of your money journey.", audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  // Play current dialogue audio/TTS - now automatically triggered
  const playCurrentDialogue = () => {
    const currentDialogue = mascotDialogues[currentDialogueIndex];
    if (!currentDialogue) return;
    
    // Stop any current speech first
    stopSpeaking();
    
    // If there's an audio source, try to play it
    if (currentDialogue.audioSrc) {
      try {
        const audio = new Audio(currentDialogue.audioSrc);
        audio.onloadeddata = () => {
          audio.play().catch(error => {
            console.log('Audio playback failed, using TTS:', error);
            speakText(currentDialogue.text);
          });
        };
        audio.onerror = () => {
          console.log('Audio file not found, using TTS');
          speakText(currentDialogue.text);
        };
      } catch (error) {
        console.log('Audio error, using TTS:', error);
        speakText(currentDialogue.text);
      }
    } else {
      // No audio source, use text-to-speech
      speakText(currentDialogue.text);
    }
  };

  // Move to next dialogue - now called automatically by MascotDialogue
  const nextDialogue = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      console.log('All dialogues completed');
      
      if (showJobOptions) {
        // Reset transition state after dialogue completes
        setIsTransitioning(false);
        
        // After job description dialogue, transition to salary options if not government job
        if (userChoices.job && selectedJobType !== 'government') {
          setMascotDialogues([
            { text: "You receive your first salary / stipend. What will you do with it?", audioSrc: null }
          ]);
          setCurrentDialogueIndex(0);
          setShowJobOptions(false); // Hide job options
          setShowSalaryOptions(true); // Show salary options
        } else if (selectedJobType === 'government') {
          // If government exams, directly go to summary - but allow for longer dialogue
          setMascotDialogues([
            { text: "No income for now, but if you succeed, you'll have a secure job for life.", audioSrc: null },
            { text: "Let's see your progress so far and prepare for the next challenge!", audioSrc: null }
          ]);
          setCurrentDialogueIndex(0);
          setShowJobOptions(false); // Hide job options
          setShowSummary(true); // Show summary
        } else {
          // Fallback for unexpected state after job selection, go to summary
          setShowJobOptions(false);
          setShowSummary(true);
        }
      } else if (showSalaryOptions) {
        // After salary choice dialogues, show summary
        setShowSalaryOptions(false);
        setShowSummary(true);
      } else {
        // Fallback for unexpected state, directly go to summary
        setShowSummary(true);
      }
    }
  };
  
  // Auto-play dialogue when currentDialogueIndex changes
  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    } else if (showSummary) {
      // When all dialogues are done and summary is shown, save progress
      saveUserProgress();
    }
  }, [currentDialogueIndex, mascotDialogues, showSummary]);

  // Save user progress to Firebase using centralized utility
  const saveUserProgress = async () => {
    await saveProgress('level1', 'round1', userChoices);
  };

  const handleJobSelection = (job) => {
    // Stop any current speech first
    stopSpeaking();
    
    let money = 0;
    let riskLevel = 'Low';
    let jobDescription = '';
    let jobType = '';
    
    switch (job) {
      case 'MNC Job':
        money = 75000;
        riskLevel = 'Low';
        jobType = 'mnc';
        jobDescription = "Great! You start earning right away. Stability = steady savings. But growth might be slow.";
        break;
      case 'Startup Job':
        money = 25000;
        riskLevel = 'High';
        jobType = 'startup';
        jobDescription = "Bold move! Work is tough, but stock options might make you rich one day.";
        break;
      case 'Government Exams':
        money = 0;
        riskLevel = 'Medium';
        jobType = 'government';
        jobDescription = "No income for now, but if you succeed, you'll have a secure job for life.";
        break;
      default:
        jobDescription = "That's an interesting path! Let's explore it.";
    }
    
    setUserChoices(prev => ({
      ...prev,
      job: job,
      money: money,
      riskLevel: riskLevel
    }));
    
    setSelectedJobType(jobType);
    setIsTransitioning(true);
    
    // Show mascot dialogue first with job description
    setMascotDialogues([
      { text: jobDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // Don't hide job options immediately - let nextDialogue handle the transition
    // setShowJobOptions(false); // REMOVED - this was causing the blank screen
  };
  
  const handleSalaryChoice = (choice) => {
    stopSpeaking();
    
    let happiness = userChoices.happiness;
    let savingsHabit = userChoices.savingsHabit;
    let feedback = '';
    let consequence = '';
    
    switch (choice) {
      case 'spend':
        happiness = 'Medium ↑'; // Adjusted based on user's prompt
        feedback = "Fun today, broke tomorrow. Careful with overspending!";
        consequence = "Next month’s rent/expense hits suddenly. Guide says: “See? Money runs out faster than you think.”";
        break;
      case 'save':
        happiness = 'Stable ↑'; // Adjusted based on user's prompt
        savingsHabit = 'Yes';
        feedback = "Smart! Saving early builds your financial safety net.";
        consequence = "Guide shows savings meter go up: “Good! This small habit will help in emergencies later.”";
        break;
      case 'family':
        happiness = 'High ↑'; // Adjusted based on user's prompt
        feedback = "Family first! Good decision, but don’t forget to save too.";
        consequence = "Guide says: “Your family feels proud of you. But make sure to also secure your own future.”";
        break;
      default:
        break;
    }
    
    setUserChoices(prev => ({
      ...prev,
      salaryAction: choice,
      happiness: happiness,
      savingsHabit: savingsHabit
    }));
    
    setMascotDialogues([
      { text: feedback, audioSrc: null },
      { text: consequence, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // Move to summary after a delay, allowing both dialogues to play
    // This will be handled by the nextDialogue calling setShowSummary(true) when all dialogues are done.
    setShowSalaryOptions(false);
    // setShowSummary(true); // Direct to summary after choice and feedback - REMOVED
    // saveUserProgress(); // Moved saving to when summary is displayed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white overflow-hidden">
      {/* Show intro modal first */}
      {showIntro && (
        <RoundIntroModal 
          onButtonClick={handleStartJourney}
          roundNumber={1}
          title="Round 1: First Job & Salary"
          description="In this round, you'll discover how your first job choice shapes your entire financial future. Every decision has trade-offs — stability vs. growth, immediate money vs. long-term potential."
          challenges={[
            "Choose your first job (risk/reward trade-offs)",
            "Decide what to do with your first salary",
            "Handle an unexpected financial situation"
          ]}
        />
      )}
      
      {/* Show guide screen after modal closes */}
      {showGuide && <GuideScreen onNext={handleContinue} />}
      
      {/* Main game interface - Mobile-first design with Duolingo style */}
      {(showJobOptions || showSalaryOptions || showSummary) && (
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
                      width: showJobOptions ? '20%' : 
                             showSalaryOptions ? '40%' : 
                             showSummary ? '100%' : '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showJobOptions ? '1/3' : 
                   showSalaryOptions ? '2/3' : '3/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showJobOptions && "Choose Your First Job"}
                {showSalaryOptions && "Your First Salary"}
                {showSummary && "Round 1 Complete!"}
              </h1>
            </div>
          </div>

          {/* Mascot/Parent Section - Fixed position on mobile */}
          <div className="bg-gradient-to-r from-[#252547] to-[#2d3748] p-4 border-b border-[#374151] sticky top-0 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-sm w-full">
                  {showJobOptions ? (
                    <MascotDialogue
                      dialogues={mascotDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={nextDialogue}
                    />
                  ) : (
                    <MascotDialogue
                      dialogues={mascotDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={nextDialogue}
                    />
                  )}
                  
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
              
              {/* Job Options */}
              {showJobOptions && (
                <div className="space-y-4">
                  {/* MNC Job Option */}
                  <div 
                    className={`bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 transition-all shadow-lg ${
                      isTransitioning 
                        ? 'border-[#374151] opacity-60 cursor-not-allowed' 
                        : 'border-[#374151] hover:border-[#58cc02] active:scale-95 cursor-pointer hover:shadow-xl'
                    }`}
                    onClick={() => !isTransitioning && handleJobSelection('MNC Job')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">MNC Job</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹75,000/month</p>
                      </div>
                      <div className="text-3xl">🏢</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">High Stability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">Low Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">Slow Growth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">Low Stress</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Startup Job Option */}
                  <div 
                    className={`bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 transition-all shadow-lg ${
                      isTransitioning 
                        ? 'border-[#374151] opacity-60 cursor-not-allowed' 
                        : 'border-[#374151] hover:border-[#58cc02] active:scale-95 cursor-pointer hover:shadow-xl'
                    }`}
                    onClick={() => !isTransitioning && handleJobSelection('Startup Job')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Startup Job</h3>
                        <p className="text-orange-400 font-bold text-xl">₹25,000/month</p>
                      </div>
                      <div className="text-3xl">🚀</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">Low Stability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">High Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">Stock Options</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">High Stress</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Government Exams Option */}
                  <div 
                    className={`bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 transition-all shadow-lg ${
                      isTransitioning 
                        ? 'border-[#374151] opacity-60 cursor-not-allowed' 
                        : 'border-[#374151] hover:border-[#58cc02] active:scale-95 cursor-pointer hover:shadow-xl'
                    }`}
                    onClick={() => !isTransitioning && handleJobSelection('Government Exams')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Government Exams</h3>
                        <p className="text-red-500 font-bold text-xl">₹0/month</p>
                      </div>
                      <div className="text-3xl">📚</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg">❌</span>
                        <span className="text-white text-sm">No Income Now</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">Uncertain</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#58cc02] text-lg">✅</span>
                        <span className="text-white text-sm">Future Security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 text-lg">⚠️</span>
                        <span className="text-white text-sm">Study Stress</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Salary Options */}
              {showSalaryOptions && (
                <div className="space-y-4">
                  {/* Spend Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleSalaryChoice('spend')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🎉</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Spend on Fun!</h3>
                        <p className="text-gray-400 text-sm">Shopping, parties, and enjoyment</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Save Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleSalaryChoice('save')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Save 20-30%</h3>
                        <p className="text-gray-400 text-sm">Build your financial future</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Family Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleSalaryChoice('family')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">👨‍👩‍👦</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Help Family</h3>
                        <p className="text-gray-400 text-sm">Send money to parents</p>
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Great Job!</h2>
                    <p className="text-gray-300">You've completed your first financial decision</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Job Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.job || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Monthly Income</p>
                        <p className="font-bold text-[#58cc02] text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Savings Habit</p>
                        <p className="font-bold text-white text-lg">
                          {userChoices.savingsHabit === 'Yes' ? (
                            <span className="text-[#58cc02]">✅ Yes</span>
                          ) : (
                            <span className="text-red-400">❌ No</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Happiness Level</p>
                        <p className="font-bold text-white text-lg">{userChoices.happiness}</p>
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
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Every rupee choice today changes your tomorrow. Let’s see how you manage your next years!"
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => navigate('/level1/round2')}
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