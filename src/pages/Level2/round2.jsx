import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';

const Round2 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showHospitalChoice, setShowHospitalChoice] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [showComplicationTwist, setShowComplicationTwist] = useState(false);
  const [showSeniorDoctorQuestion, setShowSeniorDoctorQuestion] = useState(false); // New state for Level 2
  const [showHospitalExtras, setShowHospitalExtras] = useState(false);
  const [showGoingHome, setShowGoingHome] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    hospital: null,
    deliveryCost: 0,
    paymentMethod: null,
    complicationOutcome: null,
    seniorDoctorPaid: null, // New choice for Level 2
    privateRoom: null,
    stemCellBanking: null,
    giftsExpense: 0,
    finalCosts: {},
    money: 0, 
    debt: false,
    happiness: 'High',
    stressLevel: 'Medium',
    futureSecurity: 'Medium',
  });
  const [selectedHospitalType, setSelectedHospitalType] = useState(null);

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
    setShowHospitalChoice(true);
    setMascotDialogues([
      { text: "Big news! 🚨 Your partner is going into labor. You rush to the hospital. Excitement, stress, and money are all running at the same time. Let’s see how you handle this life-changing event!", audioSrc: null },
      { text: "The ambulance arrives. Where will you admit your partner?", audioSrc: null }
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
      if (showHospitalChoice) {
        setShowHospitalChoice(false);
        setShowPaymentChoice(true);
        setMascotDialogues([{ text: "Bill generated at discharge 🧾", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showPaymentChoice) {
        setShowPaymentChoice(false);
        setShowComplicationTwist(true);
        setMascotDialogues([
          { text: "Doctors inform: Baby needs NICU care for a few days.", audioSrc: null }, 
          { text: "Extra Bill: ₹1,00,000", audioSrc: null }
        ]);
        setCurrentDialogueIndex(0);
      } else if (showComplicationTwist) {
        if (selectedHospitalType === 'Government Hospital') {
          setShowComplicationTwist(false);
          setShowSeniorDoctorQuestion(true);
          setMascotDialogues([
            { text: "Your wife is in a critical stage and we need to call a highly trained senior doctor but he would charge ₹2,00,000. Are you ready to pay for it?", audioSrc: null }
          ]);
          setCurrentDialogueIndex(0);
        } else {
          setShowComplicationTwist(false);
          setShowHospitalExtras(true);
          setMascotDialogues([{ text: "While in hospital, you face quick-fire decisions:", audioSrc: null }]);
          setCurrentDialogueIndex(0);
        }
      } else if (showSeniorDoctorQuestion) {
        setShowSeniorDoctorQuestion(false);
        setShowHospitalExtras(true);
        setMascotDialogues([{ text: "While in hospital, you face quick-fire decisions:", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showHospitalExtras) {
        setShowHospitalExtras(false);
        setShowGoingHome(true);
        setMascotDialogues([{ text: "The baby is healthy and ready to go home! Before you leave, there are some final costs:", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showGoingHome) {
        setShowGoingHome(false);
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
        await updateDoc(userProgressRef, { "level2.round2": userChoices, "round2_completed": true });
      } else {
        await setDoc(userProgressRef, { "level2": { "round2": userChoices }, "round2_completed": true });
      }
      console.log("Level 2 Round 2 Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleHospitalSelection = (hospitalType) => {
    stopSpeaking();
    let deliveryCost = 0;
    let happiness = userChoices.happiness;
    let stressLevel = userChoices.stressLevel;
    let hospitalDescription = '';
    let money = userChoices.money;

    switch (hospitalType) {
      case 'Government Hospital':
        deliveryCost = 50000;
        happiness = 'Medium';
        stressLevel = 'Low';
        hospitalDescription = 'risky delivery but more money intact ✅';
        break;
      case 'Private Hospital (Standard)':
        deliveryCost = 150000;
        happiness = 'High ↑';
        stressLevel = 'Medium';
        hospitalDescription = 'Comfortable stay, big cut in savings ❌';
        break;
      case 'Luxury Hospital Suite':
        deliveryCost = 300000;
        happiness = 'Very High ↑↑';
        stressLevel = 'High';
        hospitalDescription = 'Baby + luxury = joy, but wallet cries 💸';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      hospital: hospitalType,
      deliveryCost: deliveryCost,
      happiness: happiness,
      stressLevel: stressLevel,
      money: prev.money - deliveryCost, 
    }));
    setSelectedHospitalType(hospitalType);
    setMascotDialogues([
      { text: hospitalDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handlePaymentChoice = (method) => {
    stopSpeaking();
    let money = userChoices.money;
    let debt = userChoices.debt;
    let futureSecurity = userChoices.futureSecurity;
    let paymentFeedback = '';

    switch (method) {
      case 'Cash/Savings':
        money -= userChoices.deliveryCost;
        paymentFeedback = 'Safe but savings drain';
        break;
      case 'Credit Card EMI':
        debt = true;
        paymentFeedback = 'Easy today, but future EMI burden';
        break;
      case 'Health Insurance':
        paymentFeedback = 'Zero expense ✅';
        futureSecurity = 'Higher';
        break;
      case 'Borrow from Relatives':
        debt = true;
        paymentFeedback = 'Immediate relief, but Independence ↓';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      paymentMethod: method,
      money: money,
      debt: debt,
      futureSecurity: futureSecurity,
    }));
    setMascotDialogues([
      { text: paymentFeedback, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleComplicationChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;
    let complicationOutcome = '';
    let futureSecurity = userChoices.futureSecurity;

    switch (choice) {
      case 'Agree Immediately':
        money -= 100000; 
        complicationOutcome = 'Money ↓, but baby safe ✅';
        break;
      case 'Delay & Ask for Government Aid':
        money -= 50000; 
        stressLevel = 'High ↑';
        complicationOutcome = 'Money partly saved, Stress ↑, Risk Medium';
        break;
      case 'Insurance Covers NICU':
        complicationOutcome = 'Bill covered, Happiness ↑↑, Risk Low';
        futureSecurity = 'Higher';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      complicationOutcome: choice,
      money: money,
      stressLevel: stressLevel,
      futureSecurity: futureSecurity,
    }));
    setMascotDialogues([
      { text: complicationOutcome, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleSeniorDoctorPayment = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let stressLevel = userChoices.stressLevel;
    let seniorDoctorFeedback = '';

    if (choice === 'Yes') {
      money -= 200000; 
      stressLevel = 'Very High ↑';
      seniorDoctorFeedback = 'You paid for the senior doctor. It was expensive, but your wife is safe. Huge financial impact.';
    } else {
      stressLevel = 'Extreme ↑↑';
      seniorDoctorFeedback = 'You refused to pay for the senior doctor. This was a risky choice and led to more stress.';
    }
    setUserChoices(prev => ({ ...prev, seniorDoctorPaid: choice, money: money, stressLevel: stressLevel }));
    setMascotDialogues([
      { text: seniorDoctorFeedback, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleHospitalExtraChoice = (type, choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let happiness = userChoices.happiness;
    let stressLevel = userChoices.stressLevel;
    let futureSecurity = userChoices.futureSecurity;
    let feedback = '';

    if (type === 'private_room') {
      if (choice === 'Accept') {
        money -= 20000; 
        happiness = 'High ↑';
        feedback = 'Comfort ↑, Money ↓';
      } else {
        stressLevel = 'High ↑';
        feedback = 'Savings Safe, Stress ↑';
      }
      setUserChoices(prev => ({ ...prev, privateRoom: choice, money: money, happiness: happiness, stressLevel: stressLevel }));
    } else if (type === 'stem_cell') {
      if (choice === 'Accept') {
        money -= 50000; 
        futureSecurity = 'Higher';
        feedback = 'Future benefit, Money ↓';
      } else {
        feedback = 'Money Safe, Possible regret later';
      }
      setUserChoices(prev => ({ ...prev, stemCellBanking: choice, money: money, futureSecurity: futureSecurity }));
    } else if (type === 'gifts') {
      if (choice === 'Accept') {
        money -= 10000; 
        happiness = 'High ↑';
        feedback = 'Gifts ↑ (Happiness ↑) but Expenses ↑ (you spend on treats, snacks, etc. ₹10K)';
      } else {
        feedback = 'Declined gifts, savings safe.';
      }
      setUserChoices(prev => ({ ...prev, giftsExpense: 10000, money: money, happiness: happiness }));
    }
    setMascotDialogues([
      { text: feedback, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleGoingHome = () => {
    stopSpeaking();
    let money = userChoices.money;
    money -= 25000; 
    money -= 40000; 
    money -= 5000;  

    setUserChoices(prev => ({ ...prev, finalCosts: { medicine: 25000, essentials: 40000, transport: 5000 }, money: money }));
    setMascotDialogues([
      { text: "Final costs applied. Time to go home with your baby!", audioSrc: null }
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
      {(showHospitalChoice || showPaymentChoice || showComplicationTwist || showSeniorDoctorQuestion || showHospitalExtras || showGoingHome || showSummary) && (
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
                      width: showHospitalChoice ? '16%' :
                             showPaymentChoice ? '32%' :
                             showComplicationTwist ? '48%' :
                             showSeniorDoctorQuestion ? '64%' :
                             showHospitalExtras ? '80%' :
                             showGoingHome ? '96%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showHospitalChoice ? '1/6' :
                   showPaymentChoice ? '2/6' :
                   showComplicationTwist ? '3/6' :
                   showSeniorDoctorQuestion ? '4/6' :
                   showHospitalExtras ? '5/6' :
                   showGoingHome ? '6/6' : '6/6'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showHospitalChoice && "Choosing the Hospital"}
                {showPaymentChoice && "Paying the Delivery Bill"}
                {showComplicationTwist && "Complications Twist!"}
                {showSeniorDoctorQuestion && "Critical Decision!"}
                {showHospitalExtras && "Hospital Extras"}
                {showGoingHome && "Going Home with Baby"}
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
              
              {/* Hospital Choice */}
              {showHospitalChoice && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Where will you admit your partner?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalSelection('Government Hospital')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Government Hospital</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Cost: ₹50,000</p>
                      </div>
                      <div className="text-3xl">🏥</div>
                    </div>
                    <p className="text-gray-400 text-sm">Facilities: Basic, Happiness: Medium, Stress: Low (affordable), Outcome: risky delivery but more money intact ✅</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalSelection('Private Hospital (Standard)')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Private Hospital (Standard)</h3>
                        <p className="text-orange-400 font-bold text-xl">Cost: ₹1,50,000</p>
                      </div>
                      <div className="text-3xl">🏨</div>
                    </div>
                    <p className="text-gray-400 text-sm">Facilities: Good, Happiness: High ↑, Stress: Medium, Outcome: Comfortable stay, big cut in savings ❌</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalSelection('Luxury Hospital Suite')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Luxury Hospital Suite</h3>
                        <p className="text-red-500 font-bold text-xl">Cost: ₹3,00,000</p>
                      </div>
                      <div className="text-3xl">💎</div>
                    </div>
                    <p className="text-gray-400 text-sm">Facilities: 5-star style (AC, deluxe room, services), Happiness: Very High ↑↑, Stress: High (debt risk), Outcome: Baby + luxury = joy, but wallet cries 💸</p>
                  </div>
                </div>
              )}
              
              {/* Payment Choice */}
              {showPaymentChoice && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Paying the Delivery Bill 🧾</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handlePaymentChoice('Cash/Savings')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💰</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Pay with Cash/Savings</h3>
                        <p className="text-gray-400 text-sm">Safe but savings drain</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handlePaymentChoice('Credit Card EMI')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">💳</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Swipe Credit Card EMI</h3>
                        <p className="text-gray-400 text-sm">Easy today, but future EMI burden</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handlePaymentChoice('Health Insurance')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Use Health Insurance (if bought earlier)</h3>
                        <p className="text-gray-400 text-sm">Zero expense ✅</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handlePaymentChoice('Borrow from Relatives')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">👨‍👩‍👧‍👦</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Borrow from Relatives</h3>
                        <p className="text-gray-400 text-sm">Immediate relief, but Independence ↓</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complications Twist */}
              {showComplicationTwist && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Doctors inform: Baby needs NICU care for a few days. Extra Bill: ₹1,00,000</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleComplicationChoice('Agree Immediately')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">👶</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Agree Immediately</h3>
                        <p className="text-gray-400 text-sm">Money ↓, but baby safe ✅</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleComplicationChoice('Delay & Ask for Government Aid')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">⏳</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Delay & Ask for Government Aid</h3>
                        <p className="text-gray-400 text-sm">Money partly saved, Stress ↑, Risk Medium</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleComplicationChoice('Insurance Covers NICU')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">📋</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Insurance Covers NICU (if eligible)</h3>
                        <p className="text-gray-400 text-sm">Bill covered, Happiness ↑↑, Risk Low</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Senior Doctor Question (Only if Government Hospital and Complication) */}
              {showSeniorDoctorQuestion && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Doctor: "Your wife is in a critical stage and we need to call a highly trained senior doctor but he would charge ₹2,00,000. Are you ready to pay for it?"</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleSeniorDoctorPayment('Yes')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Yes, pay for the senior doctor</h3>
                        <p className="text-gray-400 text-sm">Wife safe, but huge financial impact.</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleSeniorDoctorPayment('No')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">❌</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">No, rely on current care</h3>
                        <p className="text-gray-400 text-sm">Risky choice, increased stress.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hospital Extras */}
              {showHospitalExtras && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Hospital Extras: Quick-fire decisions!</h2>
                  
                  {/* Private Room Upgrade */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('private_room', 'Accept')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🏨</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Nurse offers Private Room Upgrade (₹20K/day) - Accept</h3>
                        <p className="text-gray-400 text-sm">Comfort ↑, Money ↓</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('private_room', 'Reject')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🛌</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Nurse offers Private Room Upgrade (₹20K/day) - Reject</h3>
                        <p className="text-gray-400 text-sm">Savings Safe, Stress ↑</p>
                      </div>
                    </div>
                  </div>

                  {/* Stem Cell Banking */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('stem_cell', 'Accept')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🧬</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Doctor Suggests Stem Cell Banking (₹50K one-time) - Accept</h3>
                        <p className="text-gray-400 text-sm">Future benefit, Money ↓</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('stem_cell', 'Reject')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🚫</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Doctor Suggests Stem Cell Banking (₹50K one-time) - Reject</h3>
                        <p className="text-gray-400 text-sm">Money Safe, Possible regret later</p>
                      </div>
                    </div>
                  </div>

                  {/* Relatives Gifts */}
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('gifts', 'Accept')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🎁</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Relatives Flood In with Gifts - Accept</h3>
                        <p className="text-gray-400 text-sm">Gifts ↑ (Happiness ↑) but Expenses ↑ (you spend on treats, snacks, etc. ₹10K)</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleHospitalExtraChoice('gifts', 'Reject')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🙅‍♀️</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Relatives Flood In with Gifts - Reject</h3>
                        <p className="text-gray-400 text-sm">Declined gifts, savings safe.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Going Home with Baby */}
              {showGoingHome && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">The baby is healthy and ready to go home!</h2>
                  <p className="text-gray-300 text-center mb-6">Before you leave, there are some final costs:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>Medicine & Vaccines Starter Pack: ₹25K</li>
                    <li>Baby Essentials Kit (crib, clothes, stroller): ₹40K</li>
                    <li>Car Ride Home / Ambulance Home: ₹5K</li>
                  </ul>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleGoingHome}
                  >
                    <span>Acknowledge Final Costs & Go Home</span>
                    <span className="text-xl">🏠</span>
                  </button>
                </div>
              )}
              
              {/* Summary Screen */}
              {showSummary && (
                <div className="space-y-6">
                  {/* Celebration */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Congratulations!</h2>
                    <p className="text-gray-300">Your baby is here! You've experienced your first big test of financial + emotional balance.</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Hospital Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.hospital || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Total Delivery Cost</p>
                        <p className="font-bold text-red-400 text-lg">₹{userChoices.deliveryCost.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                        <p className="font-bold text-white text-lg">{userChoices.paymentMethod || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Complication Outcome</p>
                        <p className="font-bold text-white text-lg">{userChoices.complicationOutcome || 'None'}</p>
                      </div>
                      {userChoices.seniorDoctorPaid && (
                        <div className="bg-white/5 p-4 rounded-xl">
                          <p className="text-gray-400 text-sm mb-1">Senior Doctor Paid</p>
                          <p className="font-bold text-white text-lg">{userChoices.seniorDoctorPaid === 'Yes' ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money Remaining</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Debt Incurred</p>
                        <p className="font-bold text-white text-lg">{userChoices.debt ? <span className="text-red-400">Yes</span> : <span className="text-[#58cc02]">No</span>}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Happiness</p>
                        <p className="font-bold text-white text-lg">{userChoices.happiness}</p>
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
                        <p className="text-gray-400 text-sm mb-1">Future Security</p>
                        <p className="font-bold text-white text-lg">{userChoices.futureSecurity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lesson Card */}
                  <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 p-6 rounded-2xl border-2 border-[#58cc02]/30">
                    <h3 className="text-xl font-bold mb-3 text-[#58cc02] flex items-center justify-center gap-2">
                      <span>💡</span> Financial Lesson
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      "Parenthood is expensive, but the happiness is priceless. Ready for the next challenge?"
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        saveUserProgress();
                        window.location.href = '/level2/round3';
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

export default Round2;
