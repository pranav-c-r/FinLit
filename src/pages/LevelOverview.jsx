import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const LevelOverview = () => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const levels = [
    { id: 1, title: "Level 1: Age 24-30", rounds: 6, roundTitles: ["Your First Job", "Where Will You Live?", "Wedding & Wallet Drama", "Career Growth vs. Stability", "First Big Asset Purchase", "Parenthood & Future Planning"] },
    { id: 2, title: "Level 2: Age 30-35", rounds: 6, roundTitles: ["The EMI Web", "Side Hustle or Promotion?", "Family Planning & Finances", "Investment Jargon Jungle", "Debt Dragon's Den", "Building a Financial Fortress"] },
    { id: 3, title: "Level 3: Age 36-45", rounds: 5, roundTitles: ["Sandwich Generation Squeeze", "Career Peak or Plateau", "Kids' Education Investment", "Health Reality & Insurance Strategy", "Retirement Acceleration or Lifestyle Upgrade"] },
    { id: 4, title: "Level 4: Age 45-54", rounds: 6, roundTitles: ["Career Peak or Mid-Life Switch?", "Parents’ Retirement & Your Responsibility", "Mid-Life Crisis or Growth?", "Retirement Planning Countdown", "Health vs Wealth", "The Near-Retirement Dilemma"] },
    { id: 5, title: "Level 5: Age 54-60", rounds: 6, roundTitles: ["Retirement Fund Dilemma", "Health Scare", "Kids & Big Dreams", "House Decisions", "Late Career Surprise", "Legacy Planning"] },
  ];

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userProgressRef = doc(database, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(userProgressRef);
        if (docSnap.exists()) {
          setUserProgress(docSnap.data());
        } else {
          console.log("No user progress found, initializing new progress.");
          // Initialize progress for a new user
          await setDoc(userProgressRef, { level: 0, round: 0 }); 
          setUserProgress({ level: 0, round: 0 });
        }
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError("Failed to load progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  const isRoundUnlocked = (levelId, roundNumber) => {
    if (!userProgress) return false;
    // Always unlock Level 1 Round 1 and Round 2
    if ((levelId === 1 && (roundNumber === 1 || roundNumber === 2)) || (levelId === 2 && roundNumber === 2)) return true;
    const { level, round } = userProgress;

    if (levelId < level) return true; // Previous levels are unlocked
    if (levelId === level) {
      if (levelId === 1) {
        return roundNumber <= userProgress[`round${roundNumber}_completed`] || roundNumber === 1; // For Level 1, check specific round completion or if it's the first round
      } else if (levelId === 2) {
        return userProgress.level1?.round6_completed && (roundNumber <= userProgress[`round${roundNumber}_completed`] || roundNumber === 1); // Level 2 unlocked after Level 1 Round 6
      } else if (levelId === 3) {
        return userProgress.level2?.round6_completed && (roundNumber <= userProgress[`round${roundNumber}_completed`] || roundNumber === 1); // Level 3 unlocked after Level 2 Round 6
      } else if (levelId === 4) {
        return userProgress.level3?.round5_completed && (roundNumber <= userProgress[`round${roundNumber}_completed`] || roundNumber === 1); // Level 4 unlocked after Level 3 Round 5
      } else if (levelId === 5) {
        return userProgress.level4?.round6_completed && (roundNumber <= userProgress[`round${roundNumber}_completed`] || roundNumber === 1); // Level 5 unlocked after Level 4 Round 6
      }
    }
    return false;
  };

  const handleRestartLevel = async (levelId) => {
    if (!auth.currentUser) return;
    if (window.confirm(`Are you sure you want to restart Level ${levelId}? All your progress for this level will be reset.`)) {
      try {
        const userProgressRef = doc(database, "Users", auth.currentUser.uid);
        const updateData = {};
        for (let i = 1; i <= levels[levelId - 1].rounds; i++) {
          updateData[`level${levelId}.round${i}_completed`] = false;
          updateData[`level${levelId}.round${i}`] = null;
        }
        await updateDoc(userProgressRef, updateData);
        // Refresh progress
        const docSnap = await getDoc(userProgressRef);
        setUserProgress(docSnap.data());
        navigate(`/level${levelId}/round1`);
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
        await setDoc(userProgressRef, { level: 0, round: 0 }); // Clear all user progress
        setUserProgress({ level: 0, round: 0 });
        navigate('/level1/round1');
      } catch (err) {
        console.error("Error restarting game:", err);
        alert("Failed to restart game. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white flex items-center justify-center">Loading Level Overview...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-red-400 flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#58cc02] mb-8 text-center leading-tight">
        Financial Journey Map
      </h1>

      <div className="flex flex-col gap-10 w-full max-w-4xl">
        {levels.map(level => (
          <div key={level.id} className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border-2 border-[#374151]">
            <h2 className="text-2xl font-bold text-white mb-4">{level.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: level.rounds }).map((_, idx) => {
                const roundNumber = idx + 1;
                const unlocked = isRoundUnlocked(level.id, roundNumber);
                const roundLink = `/level${level.id}/round${roundNumber}`;

                const stoneClasses = `
                  relative w-28 h-28 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform
                  ${unlocked ? 'bg-gradient-to-br from-[#58cc02] to-[#2fa946] hover:scale-105 active:scale-95 cursor-pointer' : 'bg-gray-700 opacity-60 cursor-not-allowed'}
                  ${(userProgress.level === level.id && userProgress.round === roundNumber) ? 'border-4 border-yellow-400 animate-pulse' : 'border-2 border-gray-600'}
                `;

                const lockIcon = !unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2V7a3 3 0 10-6 0v2h6z" clipRule="evenodd" />
                    </svg>
                  </div>
                );

                return (
                  <Link 
                    key={roundNumber}
                    to={unlocked ? roundLink : '#'}
                    onClick={(e) => {
                      if (!unlocked) {
                        e.preventDefault();
                        alert(`Complete Level ${userProgress.level} Round ${userProgress.round} to unlock this!`);
                      }
                    }}
                    className={stoneClasses}
                  >
                    <div className="text-center z-10">
                      <p className="text-white font-bold text-lg">Round {roundNumber}</p>
                      <p className="text-gray-200 text-xs mt-1 leading-tight">{level.roundTitles[idx]}</p>
                    </div>
                    {lockIcon}
                  </Link>
                );
              })}
            </div>
            <button 
              onClick={() => handleRestartLevel(level.id)}
              className="mt-6 w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12V8m5.418-5H17.5a2.5 2.5 0 012.5 2.5V17.5a2.5 2.5 0 01-2.5 2.5H6a2.5 2.5 0 01-2.5-2.5V8.04L7 11.5M4 12v5a8.001 8.001 0 0015.356-2.582l-3.593-3.592M15 11l-3 3-3-3" />
              </svg>
              Restart Level {level.id}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-md">
        <button 
          onClick={handleRestartGame}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0l-3 3m3-3l3 3m-3 3v2m0-7V8m0-7a9 9 0 00-9 9 9 0 009 9 9 0 009-9A9 0 0012 1zm0 0V3m0 18v-2" />
          </svg>
          Restart Entire Game
        </button>
      </div>
    </div>
  );
};

export default LevelOverview;
