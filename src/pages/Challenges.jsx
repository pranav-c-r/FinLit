import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { challenges } from '../data/mockData';

const Challenges = () => {
  const { state } = useApp();
  const { user } = state;
  const categories = [...new Set(challenges.map(challenge => challenge.category))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate user progress
  const completionPercentage = Math.round((user.completedChallenges.length / challenges.length) * 100);
  const userLevel = Math.floor(user.completedChallenges.length / 5) + 1;
  const points = user.completedChallenges.length * 100;
  const nextLevelThreshold = userLevel * 5;
  const progressToNextLevel = user.completedChallenges.length - ((userLevel - 1) * 5);

  // Filter challenges based on category and search
  const filteredChallenges = challenges.filter(challenge => {
    const matchesCategory = activeCategory === 'All' || challenge.category === activeCategory;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Section */}
      <div className="mb-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Financial Challenges
            </h1>
            <p className="text-green-200 mt-2">Level up your financial knowledge through fun challenges</p>
          </div>
          
          {/* User Stats */}
          <div className="flex gap-4">
            <div className="bg-gray-800 rounded-xl p-3 shadow-lg border border-green-700/30">
              <p className="text-green-400 text-sm">Level</p>
              <p className="text-2xl font-bold text-green-400">{userLevel}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3 shadow-lg border border-green-700/30">
              <p className="text-green-400 text-sm">Points</p>
              <p className="text-2xl font-bold text-green-400">{points}</p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-green-700/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-300 font-medium">Journey to Mastery</span>
            <span className="text-green-400 font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-700 shadow-md" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-green-400">
            <span>{user.completedChallenges.length} completed</span>
            <span>{challenges.length} total</span>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4 text-center">
          <p className="text-green-300 text-sm">
            {progressToNextLevel}/5 challenges to Level {userLevel + 1}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search challenges..."
            className="bg-gray-800 text-green-200 placeholder-green-400 border border-green-700/30 rounded-xl pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-400">Challenge Categories</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${view === 'grid' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-gray-800 text-green-300 border border-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${view === 'list' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-gray-800 text-green-300 border border-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex items-center ${
              activeCategory === 'All'
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg border border-green-500'
                : 'bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            All Challenges
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg border border-green-500'
                  : 'bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-400">
            {activeCategory === 'All' ? 'All Challenges' : activeCategory}
            <span className="ml-2 text-green-500 bg-green-900/30 px-2 py-1 rounded-full text-sm">
              {filteredChallenges.length}
            </span>
          </h2>
          
          <div className="text-green-300 text-sm">
            Sorted by: <span className="text-green-400 font-medium">Difficulty</span>
          </div>
        </div>
        
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-2xl border border-green-700/30 shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-green-300 text-xl font-medium">No challenges found</h3>
            <p className="text-green-400/70 mt-2">Try a different search term or category</p>
          </div>
        ) : (
          <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
            {filteredChallenges.map((challenge, index) => (
              <div 
                key={challenge.id} 
                className={`transform transition-all duration-300 hover:scale-[1.02] ${
                  view === 'list' ? 'bg-gray-800 rounded-xl p-4 shadow-lg border border-green-700/30' : ''
                }`}
              >
                <ChallengeCard 
                  challenge={challenge} 
                  completed={user.completedChallenges.includes(challenge.id)}
                  view={view}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Banner */}
      {user.completedChallenges.length > 0 && user.completedChallenges.length < challenges.length && (
        <div className="mt-8 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-4 text-green-200 text-center shadow-lg border border-green-700/50">
          <h3 className="font-bold text-lg mb-1">Keep going, Financier!</h3>
          <p className="text-sm">Complete {nextLevelThreshold - user.completedChallenges.length} more challenges to reach level {userLevel + 1}</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${(progressToNextLevel / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Completed All Banner */}
      {user.completedChallenges.length === challenges.length && (
        <div className="mt-8 bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-4 text-center shadow-lg border border-green-500/50">
          <h3 className="font-bold text-lg text-green-200 mb-1">🎉 Master Financier! 🎉</h3>
          <p className="text-green-300 text-sm">You've completed all challenges! Your financial knowledge is impressive!</p>
        </div>
      )}
    </div>
  );
};

export default Challenges;