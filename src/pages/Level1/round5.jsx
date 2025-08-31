import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { auth, database } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';

const Round5 = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showAssetChoices, setShowAssetChoices] = useState(false);
  const [showMiniEvent, setShowMiniEvent] = useState(false);
  const [showInsuranceQuestion, setShowInsuranceQuestion] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userChoices, setUserChoices] = useState({
    assetChoice: null,
    miniEventOutcome: null,
    insurancePurchase: null,
    money: 0,
    lifestyle: 'Stable',
    asset: 'None',
    debt: false,
    futureSecurity: 'Medium',
  });
  const [selectedAssetType, setSelectedAssetType] = useState(null);

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
    setShowAssetChoices(true);
    setMascotDialogues([
      { text: "Assets should secure your life, not trap you in debt.", audioSrc: null },
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
      if (showAssetChoices) {
        setShowAssetChoices(false);
        setShowMiniEvent(true);
        setMascotDialogues([{ text: "Mini Event: Unexpected medical expense. If no insurance → big loss.", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showMiniEvent) {
        setShowMiniEvent(false);
        setShowInsuranceQuestion(true);
        setMascotDialogues([{ text: "Do you buy insurance now?", audioSrc: null }]);
        setCurrentDialogueIndex(0);
      } else if (showInsuranceQuestion) {
        setShowInsuranceQuestion(false);
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
        await updateDoc(userProgressRef2, { "level1.round5": userChoices });
      } else {
        await setDoc(userProgressRef, { "level1": { "round5": userChoices } });
      }
      if (docSnap2.exists()) {
        await updateDoc(userProgressRef, { "level":1, "round":5, "round5_completed": true });
      } else {
        await setDoc(userProgressRef, { "level":1, "round":5, "level1": { "round5": userChoices }, "round5_completed": true });
      }
      console.log("Progress saved successfully");
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleAssetChoice = (choice) => {
    stopSpeaking();
    let money = userChoices.money;
    let lifestyle = userChoices.lifestyle;
    let asset = userChoices.asset;
    let debt = userChoices.debt;
    let assetDescription = '';

    switch (choice) {
      case 'Buy a Car':
        money -= 200000; 
        lifestyle = 'High ↑';
        debt = true;
        asset = 'Car';
        assetDescription = 'You bought a car! Lifestyle ↑, but also loan EMI and debt.';
        break;
      case 'Buy a House':
        money -= 500000; 
        lifestyle = 'Very High ↑↑';
        debt = true;
        asset = 'House';
        assetDescription = 'You bought a house! Huge EMI, but a significant asset.';
        break;
      case 'Keep Renting & Invest Instead':
        money += 100000; 
        lifestyle = 'Stable';
        asset = 'None';
        assetDescription = 'You chose to keep renting and invest. Money ↑, but no prestige of ownership.';
        break;
      default:
        break;
    }

    setUserChoices(prev => ({
      ...prev,
      assetChoice: choice,
      money: money,
      lifestyle: lifestyle,
      asset: asset,
      debt: debt,
    }));
    setSelectedAssetType(choice);
    setMascotDialogues([
      { text: assetDescription, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleMiniEventOutcome = () => {
    stopSpeaking();
    let money = userChoices.money;
    let miniEventText = '';
    let futureSecurity = userChoices.futureSecurity;

    if (userChoices.insurancePurchase === 'No' || userChoices.insurancePurchase === null) {
      money -= 50000; // Unexpected medical expense
      miniEventText = 'Unexpected medical expense hit! Since you had no insurance, you faced a big loss.';
      futureSecurity = 'Low ↓';
    } else {
      miniEventText = 'Unexpected medical expense hit, but your insurance covered it! Good planning.';
      futureSecurity = 'High ↑';
    }

    setUserChoices(prev => ({
      ...prev,
      miniEventOutcome: miniEventText,
      money: money,
      futureSecurity: futureSecurity,
    }));
    setMascotDialogues([
      { text: miniEventText, audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleInsuranceQuestion = (choice) => {
    stopSpeaking();
    let futureSecurity = userChoices.futureSecurity;
    let insuranceFeedback = '';

    if (choice === 'Yes') {
      futureSecurity = 'High ↑';
      insuranceFeedback = 'Smart move! Buying insurance now secures your future.';
    } else {
      futureSecurity = 'Low ↓';
      insuranceFeedback = 'You chose not to buy insurance. Risk remains high.';
    }

    setUserChoices(prev => ({
      ...prev,
      insurancePurchase: choice,
      futureSecurity: futureSecurity,
    }));
    setMascotDialogues([
      { text: insuranceFeedback, audioSrc: null }
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
      {(showAssetChoices || showMiniEvent || showInsuranceQuestion || showSummary) && (
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
                      width: showAssetChoices ? '25%' :
                             showMiniEvent ? '50%' :
                             showInsuranceQuestion ? '75%' :
                             showSummary ? '100%' : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-[#58cc02] font-bold text-sm">
                  {showAssetChoices ? '1/3' :
                   showMiniEvent ? '2/3' :
                   showInsuranceQuestion ? '3/3' :
                   showSummary ? '3/3' : '0/3'}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-white">
                {showAssetChoices && "First Big Asset Purchase"}
                {showMiniEvent && "Unexpected Expense!"}
                {showInsuranceQuestion && "Insurance Check!"}
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
              
              {/* Asset Choices */}
              {showAssetChoices && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">What's your first big asset purchase?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleAssetChoice('Buy a Car')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy a Car</h3>
                        <p className="text-orange-400 font-bold text-xl">Loan EMI, Lifestyle ↑</p>
                      </div>
                      <div className="text-3xl">🚗</div>
                    </div>
                    <p className="text-gray-400 text-sm">Adds convenience and status, but comes with loan payments and depreciation.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleAssetChoice('Buy a House')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Buy a House</h3>
                        <p className="text-red-500 font-bold text-xl">Huge EMI, Asset ↑</p>
                      </div>
                      <div className="text-3xl">🏠</div>
                    </div>
                    <p className="text-gray-400 text-sm">A significant investment and asset, but involves a long-term financial commitment.</p>
                  </div>
                  
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-5 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleAssetChoice('Keep Renting & Invest Instead')}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">Keep Renting & Invest Instead</h3>
                        <p className="text-[#58cc02] font-bold text-xl">Money ↑, No Prestige</p>
                      </div>
                      <div className="text-3xl">📈</div>
                    </div>
                    <p className="text-gray-400 text-sm">Flexibility and potential for higher returns, but lacks the stability of ownership.</p>
                  </div>
                </div>
              )}
              
              {/* Mini Event: Medical Expense */}
              {showMiniEvent && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Mini Event: Unexpected Medical Expense!</h2>
                  <p className="text-gray-300 text-center mb-6">You face a sudden medical emergency. Let's see how prepared you are.</p>
                  <button 
                    className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={handleMiniEventOutcome}
                  >
                    <span>See Impact</span>
                    <span className="text-xl">🏥</span>
                  </button>
                </div>
              )}

              {/* Insurance Question */}
              {showInsuranceQuestion && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4 text-center">Do you buy insurance now?</h2>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleInsuranceQuestion('Yes')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Yes</h3>
                        <p className="text-gray-400 text-sm">Future secure</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] hover:border-[#58cc02] active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    onClick={() => handleInsuranceQuestion('No')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">❌</div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">No</h3>
                        <p className="text-gray-400 text-sm">Risk ↑</p>
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#58cc02] mb-2">Round 5 Complete!</h2>
                    <p className="text-gray-300">You've made a big asset purchase decision!</p>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border-2 border-[#374151] shadow-xl">
                    <h3 className="text-xl font-bold mb-4 text-white text-center flex items-center justify-center gap-2">
                      <span>📊</span> Your Current Stats
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Asset Choice</p>
                        <p className="font-bold text-white text-lg">{userChoices.assetChoice || 'None'}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Money</p>
                        <p className="font-bold text-white text-lg">₹{userChoices.money.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Lifestyle</p>
                        <p className="font-bold text-white text-lg">{userChoices.lifestyle}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Asset Owned</p>
                        <p className="font-bold text-white text-lg">{userChoices.asset}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Debt</p>
                        <p className="font-bold text-white text-lg">{userChoices.debt ? <span className="text-red-400">Yes</span> : <span className="text-[#58cc02]">No</span>}</p>
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
                      "Assets should secure your life, not trap you in debt."
                    </p>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <button 
                      className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        window.location.href = '/level1/round6';
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
