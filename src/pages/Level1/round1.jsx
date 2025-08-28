import React from 'react'
import { useState } from 'react';
import RoundIntroModal from '../../components/lessons/RoundIntroModal';
import GuideScreen from '../../components/lessons/GuideScreen';
import MascotDialogue from '../../components/lessons/MascotDialogue';
import level11Audio from '../../assets/level11.mp3';

const Level11 = () => {
    const [showIntro, setShowIntro] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

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
      { text: "Welcome to the Job Selection!", audioSrc: level11Audio },
      { text: "Please choose a job path that interests you.", audioSrc: null }
    ]);
    setCurrentDialogueIndex(0);
  };

  const handleDialogueEnd = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // All dialogues finished, perhaps enable job selection or next step
      // For now, let's assume job selection buttons become active
    }
  };

  const handleJobSelection = (job) => {
    let newDialogues = [];
    switch (job) {
      case 'Software Engineer':
        newDialogues = [
          { text: `Excellent choice! A Software Engineer builds the digital world.`, audioSrc: null }, 
          { text: `You'll learn about coding, algorithms, and problem-solving.`, audioSrc: null }
        ];
        break;
      case 'Financial Analyst':
        newDialogues = [
          { text: `A Financial Analyst helps people make smart money decisions.`, audioSrc: null }, 
          { text: `You'll dive into investments, markets, and economic trends.`, audioSrc: null }
        ];
        break;
      case 'Marketing Specialist':
        newDialogues = [
          { text: `Great! A Marketing Specialist connects products with people.`, audioSrc: null }, 
          { text: `You'll explore strategies, branding, and consumer behavior.`, audioSrc: null }
        ];
        break;
      default:
        newDialogues = [{ text: `That's an interesting path! Let's explore it.`, audioSrc: null }];
    }
    setMascotDialogues(newDialogues);
    setCurrentDialogueIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#252547] to-[#4A004A]">
      {/* Show intro modal first */}
      {showIntro && <RoundIntroModal onClose={handleStartJourney} />}
      
      {/* Show guide screen after modal closes */}
      {showGuide && <GuideScreen onNext={handleContinue} />}
      
      {/* Show job options after guide (your next screen) */}
      {showJobOptions && (
        <div className="p-8 flex flex-col items-center">
          <MascotDialogue
            dialogues={mascotDialogues}
            currentDialogueIndex={currentDialogueIndex}
            onDialogueEnd={handleDialogueEnd}
          />
          <h2 className="text-2xl font-bold text-center mt-8">Choose Your Job Path</h2>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button
              className="bg-[#80A1C1] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4E87C] hover:text-[#01110A] transition duration-300"
              onClick={() => handleJobSelection('Software Engineer')}
            >
              Software Engineer
            </button>
            <button
              className="bg-[#80A1C1] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4E87C] hover:text-[#01110A] transition duration-300"
              onClick={() => handleJobSelection('Financial Analyst')}
            >
              Financial Analyst
            </button>
            <button
              className="bg-[#80A1C1] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4E87C] hover:text-[#01110A] transition duration-300"
              onClick={() => handleJobSelection('Marketing Specialist')}
            >
              Marketing Specialist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Level11