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

const Level11 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [showParentScene, setShowParentScene] = useState(false);
  const [showExpenseAllocation, setShowExpenseAllocation] = useState(false);
  const [showSalaryOptions, setShowSalaryOptions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [parentDialogues, setParentDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    job: null,
    salary: null,
    money: 0,
    savings: false,
    riskLevel: 'Low',
    happiness: 'Medium',
    expenses: {},
    financialPlan: null
  });
  const [selectedJobType, setSelectedJobType] = useState(null); // 'mnc', 'startup', or 'government'
  
  // Refs for speech synthesis
  const speechSynthesisRef = useRef(window.speechSynthesis);

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
      { text: "You've just graduated! Congratulations! The real world is waiting.", audioSrc: null },
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
    }
  };
  
  // Auto-play dialogue when currentDialogueIndex changes
  useEffect(() => {
    if (mascotDialogues.length > 0 && currentDialogueIndex < mascotDialogues.length) {
      playCurrentDialogue();
    }
  }, [currentDialogueIndex, mascotDialogues]);

  // Save user progress to Firebase
  const saveUserProgress = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userProgressRef = doc(database, "Users", auth.currentUser.uid);
      const userProgressRef2 = doc(userProgressRef, "UserProgress");
      const docSnap = await getDoc(userProgressRef, "UserProgress");
      const docSnap2 = await getDoc(userProgressRef);
      if (docSnap.exists()) {
        await updateDoc(userProgressRef2, {
          "level1.round1": userChoices
        });
      } else {
        await setDoc(userProgressRef, {
          "level1": {
            "round1": userChoices
          }
        });
      }
      if (docSnap2.exists()) {
        await updateDoc(userProgressRef, {
          "level":1,
          "round":1
        });
      } else {
        await setDoc(userProgressRef, {
          "level1": {
            "round1": userChoices
          }
        });
      }
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
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
    
    // Show mascot dialogue first with job description
    setMascotDialogues([
      { text: jobDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // After mascot dialogue, transition to parent scene
    setShowJobOptions(false);
    
    // Set up parent dialogues based on job choice
    setTimeout(() => {
      let parentDialogue = '';
      
      switch (jobType) {
        case 'mnc':
          parentDialogue = "Son, you're earning ₹75,000 now. That's a very good salary. But remember, money needs planning. How will you split it?";
          break;
        case 'startup':
          parentDialogue = "Son, your salary is just ₹25,000. It's not easy to manage everything with this. But if you are confident, we will support you. Tell us, how will you manage with this amount?";
          break;
        case 'government':
          parentDialogue = "Son, you don't have a salary right now, but you will get one after you succeed. Until then, how will you manage your expenses?";
          break;
      }
      
      setParentDialogues([
        { text: parentDialogue, audioSrc: null }
      ]);
      
      setShowParentScene(true);
    }, 0); // Show parent scene after mascot dialogue finishes
  };
  
  // Handle when parent dialogue ends
  const handleParentDialogueEnd = () => {
    // Transition to expense allocation screen
    setShowParentScene(false);
    setShowExpenseAllocation(true);
  };
  
  // Handle expense allocation completion
  const handleExpenseAllocationComplete = (result) => {
    setUserChoices(prev => ({
      ...prev,
      expenses: result.allocations,
      financialPlan: result.selectedOption,
      // Update other relevant fields based on the result
      savings: result.feedback.financial_health === 'excellent' || 
               result.feedback.financial_health === 'good' || 
               result.feedback.financial_discipline === 'high',
      happiness: result.feedback.independence === 'high' ? 'High' : 'Medium'
    }));
    
    // Show summary screen
    setShowExpenseAllocation(false);
    setShowSummary(true);
    saveUserProgress();
  };
  
  const handleSalaryChoice = (choice) => {
    stopSpeaking();
    
    let happiness = 'Medium';
    let savings = false;
    let feedback = '';
    
    switch (choice) {
      case 'spend':
        happiness = 'High';
        feedback = "Fun today, broke tomorrow. Careful with overspending!";
        break;
      case 'save':
        happiness = 'Medium';
        savings = true;
        feedback = "Smart! Saving early builds your financial safety net.";
        break;
      case 'family':
        happiness = 'High';
        feedback = "Family first! Good decision, but don't forget to save too.";
        break;
    }
    
    setUserChoices(prev => ({
      ...prev,
      salary: choice,
      happiness: happiness,
      savings: savings
    }));
    
    // Show consequence based on choice
    let consequence = '';
    if (choice === 'spend') {
      consequence = "Next month's rent/expense hits suddenly. See? Money runs out faster than you think.";
    } else if (choice === 'save') {
      consequence = "Good! This small habit will help in emergencies later.";
    } else {
      consequence = "Your family feels proud of you. But make sure to also secure your own future.";
    }
    
    setMascotDialogues([
      { text: feedback, audioSrc: null },
      { text: consequence, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // Move to summary after a delay
    setTimeout(() => {
      setShowSalaryOptions(false);
      setShowSummary(true);
      saveUserProgress();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white overflow-hidden">
      {/* Show intro modal first */}
      {showIntro && <RoundIntroModal onClose={handleStartJourney} />}
      
      {/* Show guide screen after modal closes */}
      {showGuide && <GuideScreen onNext={handleContinue} />}
      
      {/* Main game interface - Mobile-first design with Duolingo style */}
      {(showJobOptions || showParentScene || showExpenseAllocation || showSalaryOptions || showSummary) && (
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
                             showParentScene ? '40%' : 
                             showExpenseAllocation ? '60%' : 
                             showSalaryOptions ? '80%' : '100%' 
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showJobOptions ? '1/5' : 
                   showParentScene ? '2/5' : 
                   showExpenseAllocation ? '3/5' : 
                   showSalaryOptions ? '4/5' : '5/5'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showJobOptions && "Choose Your First Job"}
                {showParentScene && "Family Discussion"}
                {showExpenseAllocation && "Plan Your Finances"}
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
                  {showParentScene ? (
                    <ParentDialogue
                      dialogues={parentDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={handleParentDialogueEnd}
                      character="father"
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
              
              {/* Expense Allocation */}
              {showExpenseAllocation && (
                <ExpenseAllocation 
                  jobType={selectedJobType}
                  salary={userChoices.money}
                  onComplete={handleExpenseAllocationComplete}
                />
              )}
              
              {/* Job Options */}
              {showJobOptions && (
                <div className="space-y-4">
                  {/* MNC Job Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleJobSelection('MNC Job')}
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
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleJobSelection('Startup Job')}
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
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleJobSelection('Government Exams')}
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
                          {userChoices.savings ? (
                            <span className="text-[#58cc02]">✅ Yes</span>
                          ) : (
                            <span className="text-red-400">❌ No</span>
                          )}
                        </p>
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
                      "Every rupee choice today changes your tomorrow. Balance between enjoying today and saving for tomorrow is key."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        // Navigate to next round or level
                        window.location.href = '/home';
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

export default Level11;