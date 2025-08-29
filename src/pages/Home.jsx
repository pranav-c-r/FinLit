import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { lessons, challenges } from '../data/mockData';

const Home = () => {
  const { state } = useApp();
  const { user } = state;
  const headerRef = useRef(null);

  // Get first 3 lessons and challenges with safe fallbacks
  const featuredLessons = lessons?.slice(0, 3) || [];
  const featuredChallenges = challenges?.slice(0, 3) || [];

  useEffect(() => {
    // Add animation class to header after component mounts
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current.classList.remove('opacity-0', '-translate-y-5');
        headerRef.current.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
  }, []);

  // Calculate progress percentage with safe fallbacks
  const progressPercentage = user?.nextLevelXp 
    ? Math.round(((user.xp || 0) / user.nextLevelXp) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background-dark">
      {/* Header with animation */}
      <div ref={headerRef} className="relative z-10 mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text-secondary">
              Welcome back, <span className="text-white">{user?.name || 'User'}!</span>
            </h1>
            <p className="text-gray-300 mt-2">Continue your financial literacy journey</p>
          </div>
          <div className="hidden md:flex items-center bg-gray-800 rounded-full px-4 py-2">
            <span className="text-yellow-500 mr-2">🔥</span>
            <span className="text-white font-semibold">{user?.streak || 0} day streak</span>
          </div>
        </div>
        
        {/* Progress indicator dots - mobile only */}
        <div className="flex items-center md:hidden mt-4">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-light to-primary rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-primary-light/70 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-primary-light/50 rounded-full"></div>
        </div>
      </div>

      {/* Mobile streak indicator */}
      <div className="md:hidden mb-6 bg-gray-800 rounded-xl p-4 flex items-center justify-center">
        <div className="flex items-center">
          <span className="text-yellow-500 text-2xl mr-3">🔥</span>
          <div>
            <p className="text-white font-semibold">{user?.streak || 0} day streak</p>
            <p className="text-gray-400 text-sm">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - optimized for mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 relative z-10">
        <div className="col-span-2 md:col-span-1 transform transition-all duration-300 hover:scale-105">
          <div className="game-card p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center text-xl">
              🎯
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Level</h3>
            <p className="text-2xl font-bold text-white">{user?.level || 1}</p>
          </div>
        </div>
        
        <div className="transform transition-all duration-300 hover:scale-105">
          <div className="game-card p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-xl">
              🪙
            </div>
            <h3 className="text-gray-300 text-sm mb-1">FinCoins</h3>
            <p className="text-2xl font-bold text-white">{user?.coins || 0}</p>
          </div>
        </div>
        
        <div className="transform transition-all duration-300 hover:scale-105">
          <div className="game-card p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center text-xl">
              ⭐
            </div>
            <h3 className="text-gray-300 text-sm mb-1">XP</h3>
            <p className="text-2xl font-bold text-white">{user?.xp || 0}</p>
          </div>
        </div>
      </div>

      {/* Progress Section - gamified */}
      <div className="relative z-10 mb-8">
        <div className="game-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold gradient-text-secondary">Level Progress</h2>
            <span className="text-primary-light font-bold">{progressPercentage}%</span>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-light to-primary h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Level {user?.level || 1}</span>
            <span>{user?.xp || 0} / {user?.nextLevelXp || 100} XP</span>
            <span>Level {(user?.level || 1) + 1}</span>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800 rounded-lg flex items-center">
            <span className="text-yellow-500 mr-2 text-lg">💡</span>
            <p className="text-sm text-gray-300">
              Complete lessons to earn XP and level up!
            </p>
          </div>
        </div>
      </div>

      {/* Featured Lessons */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold gradient-text-secondary">
            Continue Learning
          </h2>
          <Link 
            to="/lessons" 
            className="flex items-center text-primary-light hover:text-primary transition-colors duration-300 group text-sm md:text-base"
          >
            <span className="mr-1 md:mr-2">View All</span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredLessons.map((lesson, index) => {
            const completed = user?.completedLessons?.includes(lesson.id) || false;
            return (
              <div 
                key={lesson.id} 
                className="transform transition-all duration-300 hover:scale-105"
              >
                <div className={`game-card p-5 ${completed ? 'border-l-4 border-green-500' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      completed 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-gray-700 text-primary-light'
                    }`}>
                      {completed ? '✓' : lesson.emoji || '📚'}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {lesson.difficulty || 'Beginner'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{lesson.title || 'Untitled Lesson'}</h3>
                  <p className="text-gray-300 text-sm mb-4">{lesson.description || 'No description available'}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-2">⏱️</span>
                      <span>{lesson.duration || 0} min</span>
                    </div>
                    
                    <div className="flex items-center bg-yellow-900 text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">
                      +{lesson.xp || 0} XP
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Challenges */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold gradient-text-secondary">
            Active Challenges
          </h2>
          <Link 
            to="/challenges" 
            className="flex items-center text-primary-light hover:text-primary transition-colors duration-300 group text-sm md:text-base"
          >
            <span className="mr-1 md:mr-2">View All</span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredChallenges.map((challenge, index) => {
            const completed = user?.completedChallenges?.includes(challenge.id) || false;
            const reward = challenge.reward || { xp: 0, coins: 0 };
            
            return (
              <div 
                key={challenge.id} 
                className="transform transition-all duration-300 hover:scale-105"
              >
                <div className={`game-card p-5 ${completed ? 'border-l-4 border-green-500' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      completed 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-gray-700 text-primary-light'
                    }`}>
                      {completed ? '✓' : '🎯'}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {challenge.difficulty || 'Medium'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{challenge.title || 'Untitled Challenge'}</h3>
                  <p className="text-gray-300 text-sm mb-4">{challenge.description || 'No description available'}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-2">⏱️</span>
                      <span>{challenge.duration || '7 days'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-yellow-900 text-yellow-300 text-xs font-bold px-2 py-1 rounded-full mr-2">
                        +{reward.xp || 0} XP
                      </div>
                      <div className="bg-blue-900 text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                        +{reward.coins || 0} 🪙
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions - Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3 md:hidden z-20">
        <div className="grid grid-cols-4 gap-2">
          <Link to="/lessons" className="flex flex-col items-center text-xs text-gray-300 hover:text-primary-light">
            <span className="text-lg">📚</span>
            <span>Lessons</span>
          </Link>
          <Link to="/challenges" className="flex flex-col items-center text-xs text-gray-300 hover:text-primary-light">
            <span className="text-lg">🎯</span>
            <span>Challenges</span>
          </Link>
          <Link to="/goals" className="flex flex-col items-center text-xs text-gray-300 hover:text-primary-light">
            <span className="text-lg">🏆</span>
            <span>Goals</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-xs text-gray-300 hover:text-primary-light">
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;