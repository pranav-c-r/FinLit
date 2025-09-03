import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, database } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Level1Overview = () => {
  const navigate = useNavigate();
  const [roundProgress, setRoundProgress] = useState({
    round1_completed: false,
    round2_completed: false,
    round3_completed: false,
    round4_completed: false,
    round5_completed: false,
    round6_completed: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoundProgress = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userProgressRef = doc(database, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(userProgressRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRoundProgress({
            round1_completed: data.round1_completed || false,
            round2_completed: data.round2_completed || false,
            round3_completed: data.round3_completed || false,
            round4_completed: data.round4_completed || false,
            round5_completed: data.round5_completed || false,
            round6_completed: data.round6_completed || false,
          });
        } else {
          console.log("No user progress found, starting fresh.");
        }
      } catch (err) {
        console.error("Error fetching round progress:", err);
        setError("Failed to load progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoundProgress();
  }, []);

  const renderRoundStone = (roundNumber, title) => {
    const isUnlocked = roundNumber === 1 || roundProgress[`round${roundNumber - 1}_completed`];
    const isCurrent = roundNumber === 1 ? true : (roundProgress[`round${roundNumber - 1}_completed`] && !roundProgress[`round${roundNumber}_completed`]);

    const stoneClasses = `
      relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform
      ${isUnlocked ? 'bg-gradient-to-br from-[#58cc02] to-[#2fa946] hover:scale-105 active:scale-95 cursor-pointer' : 'bg-gray-700 opacity-60 cursor-not-allowed'}
      ${isCurrent ? 'border-4 border-yellow-400 animate-pulse' : 'border-2 border-gray-600'}
    `;

    const lockIcon = !isUnlocked && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 10-6 0v2h6z" clipRule="evenodd" />
        </svg>
      </div>
    );

    return (
      <Link 
        key={roundNumber}
        to={isUnlocked ? `/level1/round${roundNumber}` : '#'}
        onClick={(e) => !isUnlocked && e.preventDefault()}
        className={stoneClasses}
      >
        <div className="text-center z-10">
          <p className="text-white font-bold text-lg sm:text-xl">Round {roundNumber}</p>
          <p className="text-gray-200 text-xs sm:text-sm mt-1 leading-tight">{title}</p>
        </div>
        {lockIcon}
      </Link>
    );
  };

  const handleRestartLevel = async () => {
    if (!auth.currentUser) return;
    if (window.confirm("Are you sure you want to restart Level 1? All your progress for this level will be reset.")) {
      try {
        const userProgressRef = doc(database, "Users", auth.currentUser.uid);
        await updateDoc(userProgressRef, {
          round1_completed: false,
          round2_completed: false,
          round3_completed: false,
          round4_completed: false,
          round5_completed: false,
          round6_completed: false,
          "level1.round1": null, // Reset round-specific data
          "level1.round2": null,
          "level1.round3": null,
          "level1.round4": null,
          "level1.round5": null,
          "level1.round6": null,
        });
        setRoundProgress({
          round1_completed: false,
          round2_completed: false,
          round3_completed: false,
          round4_completed: false,
          round5_completed: false,
          round6_completed: false,
        });
        navigate('/level1/round1'); // Redirect to the first round of the level
      } catch (err) {
        console.error("Error restarting level:", err);
        alert("Failed to restart level. Please try again.");
      }
    }
  };

  const handleRestartGame = async () => {
    if (!auth.currentUser) return;
    if (window.confirm("Are you sure you want to restart the entire game? All your progress will be lost.")) {
      try {
        const userProgressRef = doc(database, "Users", auth.currentUser.uid);
        await setDoc(userProgressRef, {}); // Clear all user progress
        setRoundProgress({
          round1_completed: false,
          round2_completed: false,
          round3_completed: false,
          round4_completed: false,
          round5_completed: false,
          round6_completed: false,
        });
        navigate('/level1/round1'); // Redirect to the very first round
      } catch (err) {
        console.error("Error restarting game:", err);
        alert("Failed to restart game. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white flex items-center justify-center">Loading Level 1 Progress...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-red-400 flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#58cc02] mb-8 text-center leading-tight">
        Level 1: Age 24-30
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto w-full mb-12">
        {renderRoundStone(1, "Your First Job")}
        {renderRoundStone(2, "Where Will You Live?")}
        {renderRoundStone(3, "Wedding & Wallet Drama")}
        {renderRoundStone(4, "Career Growth vs. Stability")}
        {renderRoundStone(5, "First Big Asset Purchase")}
        {renderRoundStone(6, "Parenthood & Future Planning")}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={handleRestartLevel}
          className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12V8m5.418-5H17.5a2.5 2.5 0 012.5 2.5V17.5a2.5 2.5 0 01-2.5 2.5H6a2.5 2.5 0 01-2.5-2.5V8.04L7 11.5M4 12v5a8.001 8.001 0 0015.356-2.582l-3.593-3.592M15 11l-3 3-3-3" />
          </svg>
          Restart Level
        </button>
        <button 
          onClick={handleRestartGame}
          className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0l-3 3m3-3l3 3m-3 3v2m0-7V8m0-7a9 9 0 00-9 9 9 0 009 9 9 0 009-9A9 9 0 0012 1zm0 0V3m0 18v-2" />
          </svg>
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default Level1Overview;

