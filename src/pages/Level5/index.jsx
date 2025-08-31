import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import { FaLock, FaRedo } from 'react-icons/fa';
import RoundIntroModal from '../../components/lessons/RoundIntroModal'; // Re-use if generic
import MascotDialogue from '../../components/lessons/MascotDialogue'; // Re-use if generic

const Level5Overview = () => {
  const [roundProgress, setRoundProgress] = useState(Array(6).fill(false)); // 6 rounds for Level 5
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [mascotDialogues, setMascotDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const initialMascotDialogue = [
    { text: "Welcome to Level 5: Retirement Game Journey! You're nearing and in retirement, facing decisions about your finances, health, family, and legacy.", speaker: "Mascot" },
    { text: "Each round presents crucial choices that will shape your retirement years.", speaker: "Mascot" },
    { text: "Are you ready to enjoy the fruits of your labor, or navigate new challenges?", speaker: "Mascot" }
  ];

  const handleStartRound = () => {
    setShowIntro(false);
    setMascotDialogues(initialMascotDialogue);
    setCurrentDialogueIndex(0);
  };

  const nextDialogue = () => {
    if (currentDialogueIndex < mascotDialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else {
      console.log("All dialogues completed for intro.");
      // Optionally transition to another state or just keep the overview
    }
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(database, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const newRoundProgress = Array(6).fill(false);
          for (let i = 0; i < 6; i++) {
            if (userData.level5 && userData.level5[`round${i + 1}_completed`]) {
              newRoundProgress[i] = true;
            }
          }
          setRoundProgress(newRoundProgress);
        } else {
          // If no user document, create one
          await setDoc(userRef, {
            level: 1, // Default to Level 1, Round 1 for new users
            round: 1,
            level1: { round1_completed: false },
            level2: {},
            level3: {},
            level4: {},
            level5: {},
          }, { merge: true });
        }
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  const resetProgress = async (levelToReset = 'current') => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(database, 'users', auth.currentUser.uid);
      if (levelToReset === 'current') {
        await updateDoc(userRef, {
          level5: {}, // Reset all rounds for Level 5
          level: 5, // Keep user in Level 5
          round: 1, // Reset to Round 1 of Level 5
        });
      } else if (levelToReset === 'game') {
        await updateDoc(userRef, {
          level1: { round1_completed: false }, // Level 1 Round 1 should be unlocked
          level2: {},
          level3: {},
          level4: {},
          level5: {},
          level: 1,
          round: 1,
        });
      }
      // Re-fetch progress to update UI
      window.location.reload();
    } catch (err) {
      console.error("Error resetting progress:", err);
      alert("Failed to reset progress.");
    }
  };


  if (showIntro) {
    return (
      <RoundIntroModal
        title="Level 5: Retirement Game Journey (Age 54-60)"
        description="Embark on your retirement journey, making choices about your finances, health, and legacy. Your decisions will define your golden years."
        onStart={handleStartRound}
      />
    );
  }

  if (loading) {
    return <div className="text-center text-white text-xl">Loading progress...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  }

  const rounds = [
    { id: 1, title: "Retirement Fund Dilemma" },
    { id: 2, title: "Health Scare" },
    { id: 3, title: "Kids & Big Dreams" },
    { id: 4, title: "House Decisions" },
    { id: 5, title: "Late Career Surprise" },
    { id: 6, title: "Legacy Planning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-emerald-400">Level 5: Retirement Game Journey</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-emerald-600">
          <MascotDialogue
            dialogues={mascotDialogues}
            currentDialogueIndex={currentDialogueIndex}
            onDialogueEnd={nextDialogue}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rounds.map((round, index) => (
            <div
              key={round.id}
              className={`relative bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-300
                ${roundProgress[index] ? 'border-2 border-green-400 hover:shadow-xl' : 'border border-gray-600'}`}
            >
              {!roundProgress[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                  <FaLock className="text-red-500 text-5xl" />
                </div>
              )}
              <Link
                to={`/level5/round${round.id}`}
                className={`block ${!roundProgress[index] ? 'pointer-events-none opacity-50' : ''}`}
                onClick={(e) => {
                  if (!roundProgress[index]) {
                    e.preventDefault();
                    alert("This round is locked! Complete the previous rounds to unlock it.");
                  }
                }}
              >
                <h2 className="text-2xl font-semibold mb-2 text-emerald-300">Round {round.id}</h2>
                <p className="text-gray-300 mb-4">{round.title}</p>
                {roundProgress[index] && (
                  <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => resetProgress('current')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-colors duration-300"
          >
            <FaRedo /> Restart Level
          </button>
          <button
            onClick={() => resetProgress('game')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-colors duration-300"
          >
            <FaRedo /> Restart Entire Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level5Overview;
