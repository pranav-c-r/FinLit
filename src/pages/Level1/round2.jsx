import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import ParentDialogue from '../../components/lessons/ParentDialogue';
import oldManVideoSrc from '../../assets/oldman.mp4';
import doctorVideoSrc from '../../assets/doctoravatar.mp4';
import managerVideoSrc from '../../assets/manager.mp4';

const Level12 = () => {
  // State variables for controlling the flow of the game
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showParentScene, setShowParentScene] = useState(false);
  const [showGroceryScene, setShowGroceryScene] = useState(false);
  const [showTravelScene, setShowTravelScene] = useState(false);
  const [showLifestyleScene, setShowLifestyleScene] = useState(false);
  const [showEmergencyScene, setShowEmergencyScene] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // Dialogue state
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [parentDialogues, setParentDialogues] = useState([]);
  const [shopkeeperDialogues, setShopkeeperDialogues] = useState([]);
  const [friendDialogues, setFriendDialogues] = useState([]);
  const [doctorDialogues, setDoctorDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // User choices and progress
  const [userChoices, setUserChoices] = useState({
    round1: {}, // Will be loaded from Firebase
    groceryChoice: null,
    travelChoice: null,
    lifestyleChoice: null,
    emergencyChoice: null,
    expenses: {},
    balance: 0,
    financialHealthScore: 'Average'
  });
  
  // Refs for speech synthesis
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Initialize voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    // Load voices immediately if available
    loadVoices();

    // Set up event listener for voices changed
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Load user's Round 1 data from Firebase
    loadUserRound1Data();

    return () => {
      // Cleanup
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Load user's Round 1 data from Firebase
  const loadUserRound1Data = async () => {
    if (!auth.currentUser) return;
    try {
      // Load from Users/{uid}/UserProgress/Level1/round1
      const round1Ref = doc(database, "Users", auth.currentUser.uid, "UserProgress", "Level1");
      const round1Doc = await getDoc(round1Ref);
      if (round1Doc.exists()) {
        const level1Data = round1Doc.data();
        if (level1Data.round1) {
          setUserChoices(prev => ({
            ...prev,
            round1: level1Data.round1,
            balance: level1Data.round1.money || 0
          }));
        }
      }
    } catch (error) {
      console.error("Error loading Round 1 data:", error);
    }
  };

  // Text-to-speech function
  const speakText = (text) => {
    if (!speechSynthesisRef.current) return;
    
    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = speechSynthesisRef.current.getVoices();
    
    // Try to find a good male voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Male') || 
      voice.name.includes('male') || 
      voice.name.includes('David') || 
      voice.name.includes('Mark')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesisRef.current.speak(utterance);
  };

  // Stop any ongoing speech
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle start journey button click
  const handleStartJourney = () => {
    setShowIntro(false);
    setShowGuide(true);
    
    // Set initial mascot dialogues
    setMascotDialogues([
      { 
        text: "Welcome to Round 2! Now that you've chosen your job and allocated your first salary, let's see how you manage your monthly expenses.", 
        audioSrc: null 
      },
      { 
        text: "You'll face different scenarios like grocery shopping, commuting, lifestyle choices, and even emergencies.", 
        audioSrc: null 
      },
      { 
        text: "Your choices will affect your financial health score at the end of the month. Ready to begin?", 
        audioSrc: null 
      }
    ]);
  };

  // Handle continue button click on guide screen
  const handleContinue = () => {
    setShowGuide(false);
    setShowParentScene(true);
    setCurrentDialogueIndex(0);
    
    // Set parent dialogues
    setParentDialogues([
      { 
        text: `Son, now that you've got your salary of ₹${userChoices.round1.money || 0} and allocated it in Round 1, let's see how you manage the month. You have to handle groceries, travel, lifestyle, and any emergencies within your budget. Ready?`, 
        audioSrc: null 
      }
    ]);
  };

  // Play current dialogue audio/TTS
  const playCurrentDialogue = () => {
    let currentDialogue;
    
    if (showParentScene) {
      currentDialogue = parentDialogues[currentDialogueIndex];
    } else if (showGroceryScene) {
      currentDialogue = shopkeeperDialogues[currentDialogueIndex];
    } else if (showTravelScene || showLifestyleScene) {
      currentDialogue = friendDialogues[currentDialogueIndex];
    } else if (showEmergencyScene) {
      currentDialogue = doctorDialogues[currentDialogueIndex];
    } else {
      currentDialogue = mascotDialogues[currentDialogueIndex];
    }
    
    if (!currentDialogue) return;
    
    // Stop any current speech first
    stopSpeaking();
    
    // If there's an audio source, try to play it
    if (currentDialogue.audioSrc) {
      try {
        const audio = new Audio(currentDialogue.audioSrc);
        audio.onloadeddata = () => {
          audio.play().catch(error => {
            speakText(currentDialogue.text);
          });
        };
        audio.onerror = () => {
          speakText(currentDialogue.text);
        };
      } catch (error) {
        speakText(currentDialogue.text);
      }
    } else {
      // No audio source, use text-to-speech
      speakText(currentDialogue.text);
    }
  };

  // Move to next dialogue
  const nextDialogue = () => {
    let currentDialogues;
    
    if (showParentScene) {
      currentDialogues = parentDialogues;
    } else if (showGroceryScene) {
      currentDialogues = shopkeeperDialogues;
    } else if (showTravelScene || showLifestyleScene) {
      currentDialogues = friendDialogues;
    } else if (showEmergencyScene) {
      currentDialogues = doctorDialogues;
    } else {
      currentDialogues = mascotDialogues;
    }
    
    if (currentDialogueIndex < currentDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // Handle dialogue completion based on current scene
      if (showParentScene) {
        handleParentDialogueEnd();
      } else if (showGroceryScene) {
        // Show grocery choices
      } else if (showTravelScene) {
        // Show travel choices
      } else if (showLifestyleScene) {
        // Show lifestyle choices
      } else if (showEmergencyScene) {
        // Show emergency choices
      } else {
        // Guide screen dialogues completed
      }
    }
  };
  
  // Auto-play dialogue when currentDialogueIndex changes
  useEffect(() => {
    let currentDialogues;
    
    if (showParentScene) {
      currentDialogues = parentDialogues;
    } else if (showGroceryScene) {
      currentDialogues = shopkeeperDialogues;
    } else if (showTravelScene || showLifestyleScene) {
      currentDialogues = friendDialogues;
    } else if (showEmergencyScene) {
      currentDialogues = doctorDialogues;
    } else {
      currentDialogues = mascotDialogues;
    }
    
    if (currentDialogues.length > 0 && currentDialogueIndex < currentDialogues.length) {
      playCurrentDialogue();
    }
  }, [currentDialogueIndex, mascotDialogues, parentDialogues, shopkeeperDialogues, friendDialogues, doctorDialogues, showParentScene, showGroceryScene, showTravelScene, showLifestyleScene, showEmergencyScene]);

  // Save user progress to Firebase
  const saveUserProgress = async () => {
    if (!auth.currentUser) return;
    try {
      // Save round2 at Users/{uid}/UserProgress/Level1/round2
      const round2Ref = doc(database, "Users", auth.currentUser.uid, "UserProgress", "Level1");
      const round2Doc = await getDoc(round2Ref);
      let dataToUpdate = {};
      if (round2Doc.exists()) {
        dataToUpdate = round2Doc.data();
      }
      dataToUpdate.round2 = userChoices;
      await setDoc(round2Ref, dataToUpdate, { merge: true });
      // Update level and round at Users/{uid}
      const userRef = doc(database, "Users", auth.currentUser.uid);
      await updateDoc(userRef, { level: 1, round: 2 });
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Handle when parent dialogue ends
  const handleParentDialogueEnd = () => {
    // Transition to grocery scene
    setShowParentScene(false);
    setShowGroceryScene(true);
    setCurrentDialogueIndex(0);
    
    // Set shopkeeper dialogues
    setShopkeeperDialogues([
      { 
        text: `Your family needs rice, vegetables, and milk for the month. You have only ₹${Math.floor(userChoices.round1.money * 0.2)} allocated for groceries. What will you do?`, 
        audioSrc: null 
      }
    ]);
  };

  // Handle grocery choice
  const handleGroceryChoice = (choice) => {
    // Stop any current speech
    stopSpeaking();
    
    let outcome = '';
    let spendAmount = 0;
    
    switch (choice) {
      case 'essentials':
        outcome = "You saved money but meals are basic. Your family understands your financial situation.";
        spendAmount = Math.floor(userChoices.round1.money * 0.15);
        break;
      case 'balanced':
        outcome = "Good balance between essentials and some treats. Your family is satisfied.";
        spendAmount = Math.floor(userChoices.round1.money * 0.2);
        break;
      case 'premium':
        outcome = "You overspent on premium items. Your budget is now tight for other expenses.";
        spendAmount = Math.floor(userChoices.round1.money * 0.3);
        break;
    }
    
    // Update user choices
    setUserChoices(prev => ({
      ...prev,
      groceryChoice: choice,
      expenses: {
        ...prev.expenses,
        grocery: spendAmount
      },
      balance: prev.balance - spendAmount
    }));
    
    // Show outcome dialogue
    setShopkeeperDialogues([
      { text: outcome, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // After a delay, move to travel scene
    setTimeout(() => {
      setShowGroceryScene(false);
      setShowTravelScene(true);
      setCurrentDialogueIndex(0);
      
      // Set friend dialogues for travel
      setFriendDialogues([
        { 
          text: "Hey, how will you travel daily to office/college?", 
          audioSrc: null 
        }
      ]);
    }, 5000);
  };

  // Handle travel choice
  const handleTravelChoice = (choice) => {
    // Stop any current speech
    stopSpeaking();
    
    let outcome = '';
    let spendAmount = 0;
    
    switch (choice) {
      case 'bus':
        outcome = "You spent less but travel takes more time. You can use the commute time to read or learn something new.";
        spendAmount = Math.floor(userChoices.round1.money * 0.05);
        break;
      case 'cab':
        outcome = "Comfortable travel but expensive. Almost half your remaining budget is gone on transportation.";
        spendAmount = Math.floor(userChoices.round1.money * 0.25);
        break;
      case 'bike':
        outcome = "One-time big investment, but cheaper in the long run. Good balance of comfort and cost.";
        spendAmount = Math.floor(userChoices.round1.money * 0.15);
        break;
    }
    
    // Update user choices
    setUserChoices(prev => ({
      ...prev,
      travelChoice: choice,
      expenses: {
        ...prev.expenses,
        travel: spendAmount
      },
      balance: prev.balance - spendAmount
    }));
    
    // Show outcome dialogue
    setFriendDialogues([
      { text: outcome, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // After a delay, move to lifestyle scene
    setTimeout(() => {
      setShowTravelScene(false);
      setShowLifestyleScene(true);
      setCurrentDialogueIndex(0);
      
      // Set friend dialogues for lifestyle
      setFriendDialogues([
        { 
          text: "Let's go shopping this weekend. What do you want to buy?", 
          audioSrc: null 
        }
      ]);
    }, 5000);
  };

  // Handle lifestyle choice
  const handleLifestyleChoice = (choice) => {
    // Stop any current speech
    stopSpeaking();
    
    let outcome = '';
    let spendAmount = 0;
    let parentReaction = '';
    
    switch (choice) {
      case 'budget':
        outcome = "You found good deals on budget clothes. Smart shopping!";
        parentReaction = "Good choice, son! You're learning to manage money well.";
        spendAmount = Math.floor(userChoices.round1.money * 0.1);
        break;
      case 'branded':
        outcome = "The branded clothes look great, but they cost a lot.";
        parentReaction = "These are expensive! Are you sure this is the right time to spend so much?";
        spendAmount = Math.floor(userChoices.round1.money * 0.3);
        break;
      case 'skip':
        outcome = "You decided to skip shopping this month to save money.";
        parentReaction = "That's very responsible of you. Saving is important when you're just starting out.";
        spendAmount = 0;
        break;
    }
    
    // Update user choices
    setUserChoices(prev => ({
      ...prev,
      lifestyleChoice: choice,
      expenses: {
        ...prev.expenses,
        lifestyle: spendAmount
      },
      balance: prev.balance - spendAmount
    }));
    
    // Show outcome dialogue
    setFriendDialogues([
      { text: outcome, audioSrc: null },
      { text: parentReaction, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // After a delay, move to emergency scene
    setTimeout(() => {
      setShowLifestyleScene(false);
      setShowEmergencyScene(true);
      setCurrentDialogueIndex(0);
      
      // Set doctor dialogues for emergency
      setDoctorDialogues([
        { 
          text: `Suddenly, an emergency occurs! ${userChoices.round1.job === 'Government Exams' ? 'Your laptop needs urgent repair for ₹15,000.' : 'You need medical treatment costing ₹15,000.'}`, 
          audioSrc: null 
        }
      ]);
    }, 8000);
  };

  // Handle emergency choice
  const handleEmergencyChoice = (choice) => {
    // Stop any current speech
    stopSpeaking();
    
    let outcome = '';
    let financialImpact = 0;
    const emergencyCost = 15000;
    
    switch (choice) {
      case 'savings':
        outcome = "You used your savings to handle the emergency. Good thing you had set some money aside!";
        financialImpact = emergencyCost;
        break;
      case 'borrow':
        outcome = "You borrowed money to cover the emergency. Remember you'll need to repay this next month.";
        financialImpact = 0; // No immediate impact, but debt added
        break;
      case 'ignore':
        outcome = userChoices.round1.job === 'Government Exams' 
          ? "Without your laptop, studying became difficult. This might affect your exam preparation." 
          : "Ignoring your health issue made it worse. You ended up spending more later and missed work.";
        financialImpact = 0; // No immediate financial impact, but negative consequences
        break;
    }
    
    // Update user choices
    setUserChoices(prev => ({
      ...prev,
      emergencyChoice: choice,
      expenses: {
        ...prev.expenses,
        emergency: choice === 'savings' ? emergencyCost : 0
      },
      balance: choice === 'savings' ? prev.balance - emergencyCost : prev.balance,
      debt: choice === 'borrow' ? emergencyCost : 0
    }));
    
    // Show outcome dialogue
    setDoctorDialogues([
      { text: outcome, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
    
    // After a delay, move to summary
    setTimeout(() => {
      calculateFinancialHealthScore();
      setShowEmergencyScene(false);
      setShowSummary(true);
      saveUserProgress();
    }, 5000);
  };

  // Calculate financial health score
  const calculateFinancialHealthScore = () => {
    let score = 0;
    
    // Grocery choice scoring
    if (userChoices.groceryChoice === 'essentials') score += 3;
    else if (userChoices.groceryChoice === 'balanced') score += 2;
    else if (userChoices.groceryChoice === 'premium') score += 1;
    
    // Travel choice scoring
    if (userChoices.travelChoice === 'bus') score += 3;
    else if (userChoices.travelChoice === 'bike') score += 2;
    else if (userChoices.travelChoice === 'cab') score += 1;
    
    // Lifestyle choice scoring
    if (userChoices.lifestyleChoice === 'skip') score += 3;
    else if (userChoices.lifestyleChoice === 'budget') score += 2;
    else if (userChoices.lifestyleChoice === 'branded') score += 1;
    
    // Emergency choice scoring
    if (userChoices.emergencyChoice === 'savings') score += 3;
    else if (userChoices.emergencyChoice === 'borrow') score += 2;
    else if (userChoices.emergencyChoice === 'ignore') score += 0;
    
    // Determine final score
    let healthScore = 'Poor';
    if (score >= 10) healthScore = 'Good';
    else if (score >= 6) healthScore = 'Average';
    
    // Update user choices with score
    setUserChoices(prev => ({
      ...prev,
      financialHealthScore: healthScore
    }));
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Intro Modal */}
      {showIntro && (
        <RoundIntroModal
          title="Round 2: Managing Monthly Expenses"
          description="Now that you've chosen your job and allocated your first salary, let's see how you manage your monthly expenses."
          buttonText="Start Journey"
          onButtonClick={handleStartJourney}
          roundNumber={2}
          challenges={[
            "Manage your grocery budget",
            "Choose your transportation method",
            "Make smart lifestyle choices",
            "Handle unexpected emergencies"
          ]}
        />
      )}
      
      {/* Guide Screen */}
      {showGuide && (
        <GuideScreen
          title="Round 2: Managing Monthly Expenses"
          description="In this round, you'll face different scenarios like grocery shopping, commuting, lifestyle choices, and even emergencies. Your choices will affect your financial health score at the end of the month."
          steps={[
            "Step 1: Grocery & Essentials - Manage your food budget",
            "Step 2: Travel & Daily Commute - Choose your transportation method",
            "Step 3: Lifestyle & Shopping - Make shopping decisions",
            "Step 4: Emergency Situation - Handle unexpected expenses",
            "Step 5: End of Month Summary - Review your financial health"
          ]}
          buttonText="Continue"
          onButtonClick={handleContinue}
        />
      )}
      
      {/* Main game interface - Mobile-first design with Duolingo style */}
      {(showParentScene || showGroceryScene || showTravelScene || showLifestyleScene || showEmergencyScene || showSummary) && (
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
                      width: showParentScene ? '20%' : 
                             showGroceryScene ? '40%' : 
                             showTravelScene ? '60%' : 
                             showLifestyleScene ? '80%' : 
                             showEmergencyScene ? '90%' : '100%' 
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showParentScene ? '1/5' : 
                   showGroceryScene ? '2/5' : 
                   showTravelScene ? '3/5' : 
                   showLifestyleScene ? '4/5' : 
                   showEmergencyScene ? '5/5' : 'Complete'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showParentScene && "Family Discussion"}
                {showGroceryScene && "Grocery & Essentials"}
                {showTravelScene && "Travel & Daily Commute"}
                {showLifestyleScene && "Lifestyle & Shopping"}
                {showEmergencyScene && "Emergency Situation"}
                {showSummary && "End of Month Summary"}
              </h1>
            </div>
          </div>

          {/* Character/Dialogue Section */}
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
                      videoSrc={oldManVideoSrc}
                    />
                  ) : showGroceryScene ? (
                    <ParentDialogue
                      dialogues={shopkeeperDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={nextDialogue}
                      character="shopkeeper"
                      videoSrc={managerVideoSrc}
                    />
                  ) : showEmergencyScene ? (
                    <ParentDialogue
                      dialogues={doctorDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={nextDialogue}
                      character="doctor"
                      videoSrc={doctorVideoSrc}
                    />
                  ) : (showTravelScene || showLifestyleScene) ? (
                    <ParentDialogue
                      dialogues={friendDialogues}
                      currentDialogueIndex={currentDialogueIndex}
                      onDialogueEnd={nextDialogue}
                      character="friend"
                      videoSrc={managerVideoSrc}
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
              
              {/* Grocery Options */}
              {showGroceryScene && shopkeeperDialogues.length > 0 && currentDialogueIndex >= shopkeeperDialogues.length - 1 && (
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-bold text-center text-[#58cc02] mb-4">Choose your grocery strategy:</h2>
                  
                  {/* Essential Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleGroceryChoice('essentials')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy only essentials</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.15)}</p>
                      </div>
                      <div className="text-3xl">🍚</div>
                    </div>
                    <p className="text-gray-300">Basic rice, vegetables, milk - no extras</p>
                  </div>
                  
                  {/* Balanced Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleGroceryChoice('balanced')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Essentials + some snacks</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.2)}</p>
                      </div>
                      <div className="text-3xl">🥗</div>
                    </div>
                    <p className="text-gray-300">Good balance between necessities and treats</p>
                  </div>
                  
                  {/* Premium Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleGroceryChoice('premium')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Branded food & extras</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.3)}</p>
                      </div>
                      <div className="text-3xl">🛒</div>
                    </div>
                    <p className="text-gray-300">Premium items, organic produce, and fancy snacks</p>
                  </div>
                </div>
              )}
              
              {/* Travel Options */}
              {showTravelScene && friendDialogues.length > 0 && currentDialogueIndex >= friendDialogues.length - 1 && (
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-bold text-center text-[#58cc02] mb-4">Choose your travel method:</h2>
                  
                  {/* Bus Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleTravelChoice('bus')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Take bus pass</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.05)}</p>
                      </div>
                      <div className="text-3xl">🚌</div>
                    </div>
                    <p className="text-gray-300">Cheap, but slow and crowded</p>
                  </div>
                  
                  {/* Cab Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleTravelChoice('cab')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Use cab/auto daily</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.25)}</p>
                      </div>
                      <div className="text-3xl">🚕</div>
                    </div>
                    <p className="text-gray-300">Comfortable but expensive</p>
                  </div>
                  
                  {/* Bike Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleTravelChoice('bike')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy second-hand bike</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.15)}</p>
                      </div>
                      <div className="text-3xl">🏍️</div>
                    </div>
                    <p className="text-gray-300">One-time cost, convenient in the long run</p>
                  </div>
                </div>
              )}
              
              {/* Lifestyle Options */}
              {showLifestyleScene && friendDialogues.length > 0 && currentDialogueIndex >= friendDialogues.length - 1 && (
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-bold text-center text-[#58cc02] mb-4">Choose your shopping approach:</h2>
                  
                  {/* Budget Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLifestyleChoice('budget')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Budget clothes</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.1)}</p>
                      </div>
                      <div className="text-3xl">👕</div>
                    </div>
                    <p className="text-gray-300">Affordable options that get the job done</p>
                  </div>
                  
                  {/* Branded Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLifestyleChoice('branded')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Branded clothes</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹{Math.floor(userChoices.round1.money * 0.3)}</p>
                      </div>
                      <div className="text-3xl">👔</div>
                    </div>
                    <p className="text-gray-300">Premium brands, high quality but expensive</p>
                  </div>
                  
                  {/* Skip Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleLifestyleChoice('skip')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Skip shopping</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹0</p>
                      </div>
                      <div className="text-3xl">💰</div>
                    </div>
                    <p className="text-gray-300">Save money by not buying any new clothes this month</p>
                  </div>
                </div>
              )}
              
              {/* Emergency Options */}
              {showEmergencyScene && doctorDialogues.length > 0 && currentDialogueIndex >= doctorDialogues.length - 1 && (
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-bold text-center text-[#58cc02] mb-4">How will you handle this emergency?</h2>
                  
                  {/* Savings Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleEmergencyChoice('savings')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Use your savings</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹15,000</p>
                      </div>
                      <div className="text-3xl">🏦</div>
                    </div>
                    <p className="text-gray-300">Pay from your own pocket</p>
                  </div>
                  
                  {/* Borrow Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleEmergencyChoice('borrow')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Borrow from parents/friends</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Debt: ₹15,000</p>
                      </div>
                      <div className="text-3xl">🤝</div>
                    </div>
                    <p className="text-gray-300">Get help now, but you'll need to repay later</p>
                  </div>
                  
                  {/* Ignore Option */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleEmergencyChoice('ignore')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Ignore/skip expense</h3>
                        <p className="text-[#58cc02] font-bold text-xl">₹0</p>
                      </div>
                      <div className="text-3xl">❌</div>
                    </div>
                    <p className="text-gray-300">Avoid spending now, but there may be consequences</p>
                  </div>
                </div>
              )}
              
              {/* Summary Screen */}
              {showSummary && (
                <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-lg">
                  <h2 className="text-2xl font-bold text-center text-white mb-6">Monthly Financial Summary</h2>
                  
                  <div className="space-y-4">
                    {/* Salary */}
                    <div className="flex justify-between items-center border-b border-[#374151] pb-3">
                      <span className="text-gray-300">Starting Amount:</span>
                      <span className="text-[#58cc02] font-bold">₹{userChoices.round1.money || 0}</span>
                    </div>
                    
                    {/* Expenses */}
                    <div className="border-b border-[#374151] pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Expenses:</span>
                        <span className="text-red-400 font-bold">-₹{Object.values(userChoices.expenses).reduce((a, b) => a + b, 0)}</span>
                      </div>
                      
                      <div className="pl-4 space-y-1 text-sm">
                        {userChoices.expenses.grocery && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Groceries:</span>
                            <span className="text-gray-300">₹{userChoices.expenses.grocery}</span>
                          </div>
                        )}
                        {userChoices.expenses.travel && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Travel:</span>
                            <span className="text-gray-300">₹{userChoices.expenses.travel}</span>
                          </div>
                        )}
                        {userChoices.expenses.lifestyle && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Lifestyle:</span>
                            <span className="text-gray-300">₹{userChoices.expenses.lifestyle}</span>
                          </div>
                        )}
                        {userChoices.expenses.emergency && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Emergency:</span>
                            <span className="text-gray-300">₹{userChoices.expenses.emergency}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Balance */}
                    <div className="flex justify-between items-center border-b border-[#374151] pb-3">
                      <span className="text-gray-300">Remaining Balance:</span>
                      <span className={`font-bold ${userChoices.balance >= 0 ? 'text-[#58cc02]' : 'text-red-500'}`}>
                        ₹{userChoices.balance}
                      </span>
                    </div>
                    
                    {/* Debt */}
                    {userChoices.debt > 0 && (
                      <div className="flex justify-between items-center border-b border-[#374151] pb-3">
                        <span className="text-gray-300">Debt to Repay:</span>
                        <span className="text-red-500 font-bold">₹{userChoices.debt}</span>
                      </div>
                    )}
                    
                    {/* Financial Health Score */}
                    <div className="mt-6 p-4 rounded-xl bg-[#111827] text-center">
                      <h3 className="text-lg font-bold mb-2">Financial Health Score</h3>
                      <div className={`text-2xl font-bold ${userChoices.financialHealthScore === 'Good' ? 'text-green-500' : userChoices.financialHealthScore === 'Average' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {userChoices.financialHealthScore}
                      </div>
                      
                      {/* Parent Reaction */}
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#374151]">
                          <img src={oldManVideoSrc} alt="Parent" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-300">Your dad says:</p>
                          <p className="text-white">
                            {userChoices.financialHealthScore === 'Good' 
                              ? "I'm proud of you! You're managing your money wisely." 
                              : userChoices.financialHealthScore === 'Average' 
                                ? "Not bad, but there's room for improvement." 
                                : "We need to work on your financial habits, son."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Continue Button */}
                    <div className="mt-6 flex justify-center">
                      <button 
                        onClick={() => {
                          // Navigate to next round or lessons page
                          window.location.href = '/lessons';
                        }}
                        className="bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-3 px-8 rounded-full shadow transition-colors"
                      >
                        Continue to Next Round
                      </button>
                    </div>
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

export default Level12;