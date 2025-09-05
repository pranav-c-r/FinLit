import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getChallengesByDifficulty, getChallengesByCategory, getAvailableChallenges } from '../data/challenges';

const Challenges = () => {
  const { state, dispatch } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Initialize progress for challenges that require multiple steps
  useEffect(() => {
    const progressData = {};
    state.challenges.forEach(challenge => {
      if (challenge.steps && challenge.steps.length > 0) {
        progressData[challenge.id] = {
          currentStep: 0,
          completedSteps: [],
          totalSteps: challenge.steps.length
        };
      }
    });
    setChallengeProgress(progressData);
  }, [state.challenges]);

  const handleStartChallenge = (challengeId) => {
    setActiveChallenge(challengeId);
    setSelectedChallenge(state.challenges.find(c => c.id === challengeId));
  };

  const handleCompleteStep = (challengeId, stepIndex) => {
    setChallengeProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[challengeId]) {
        newProgress[challengeId] = {
          currentStep: stepIndex + 1,
          completedSteps: [stepIndex],
          totalSteps: selectedChallenge.steps.length
        };
      } else {
        newProgress[challengeId] = {
          ...newProgress[challengeId],
          currentStep: stepIndex + 1,
          completedSteps: [...newProgress[challengeId].completedSteps, stepIndex]
        };
      }
      return newProgress;
    });
  };

  const handleCompleteChallenge = (challengeId) => {
    dispatch({
      type: 'COMPLETE_CHALLENGE',
      payload: { challengeId }
    });
    
    // Show completion animation
    setShowCompletion(true);
    setTimeout(() => {
      setShowCompletion(false);
      setActiveChallenge(null);
      setSelectedChallenge(null);
    }, 2500);
  };

  const getFilteredChallenges = () => {
    let challenges = state.challenges;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      challenges = challenges.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      challenges = challenges.filter(challenge => challenge.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      challenges = challenges.filter(challenge => 
        challenge.title.toLowerCase().includes(query) || 
        challenge.description.toLowerCase().includes(query)
      );
    }

    // Sort challenges
    switch (sortBy) {
      case 'difficulty':
        challenges.sort((a, b) => {
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;
      case 'reward':
        challenges.sort((a, b) => b.xpReward - a.xpReward);
        break;
      case 'duration':
        challenges.sort((a, b) => {
          const getDurationValue = (duration) => {
            if (duration.includes('day')) return parseInt(duration) * 24;
            if (duration.includes('hour')) return parseInt(duration);
            return 0;
          };
          return getDurationValue(a.duration) - getDurationValue(b.duration);
        });
        break;
      default:
        // Default sorting: available first, then locked
        challenges.sort((a, b) => {
          const statusA = getChallengeStatus(a);
          const statusB = getChallengeStatus(b);
          if (statusA === 'available' && statusB !== 'available') return -1;
          if (statusA !== 'available' && statusB === 'available') return 1;
          return 0;
        });
    }

    return challenges;
  };

  const getChallengeStatus = (challenge) => {
    if (state.user.completedChallenges.includes(challenge.id)) {
      return 'completed';
    }
    
    const availableChallenges = getAvailableChallenges(state.user);
    if (availableChallenges.some(c => c.id === challenge.id)) {
      return 'available';
    }
    
    return 'locked';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'available':
        return 'bg-blue-500';
      case 'locked':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'available':
        return 'Available';
      case 'locked':
        return 'Locked';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderProgressBar = (challenge) => {
    const status = getChallengeStatus(challenge);
    if (status !== 'available' || !challengeProgress[challenge.id]) return null;

    const progress = challengeProgress[challenge.id];
    const percentage = (progress.completedSteps.length / progress.totalSteps) * 100;

    return (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress.completedSteps.length}/{progress.totalSteps} steps</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderChallengeCard = (challenge) => {
    const status = getChallengeStatus(challenge);
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';
    const progress = challengeProgress[challenge.id];

    return (
      <div
        key={challenge.id}
        className={`p-6 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] ${
          isCompleted
            ? 'border-green-500/50 bg-green-500/10'
            : isAvailable
            ? 'border-blue-500/50 bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer'
            : 'border-accent/30 bg-background-dark/50 opacity-60'
        }`}
        onClick={() => isAvailable && setSelectedChallenge(challenge)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500/20' : isAvailable ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
              <div className="text-2xl">{challenge.icon}</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
              <p className="text-gray-300">{challenge.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Category:</span>
              <span className="text-white capitalize">{challenge.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{challenge.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Difficulty:</span>
              <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-white">{challenge.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">💰</span>
              <span className="text-white">{challenge.coinReward} Coins</span>
            </div>
            {challenge.streakBonus && (
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">🔥</span>
                <span className="text-white">{challenge.streakBonus} day streak bonus</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress for multi-step challenges */}
        {renderProgressBar(challenge)}

        {/* Action Button */}
        <div className="flex justify-between items-center mt-4">
          {isCompleted ? (
            <div className="flex items-center space-x-2 text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Completed!</span>
            </div>
          ) : isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedChallenge(challenge);
              }}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{progress ? 'Continue' : 'Start'}</span>
            </button>
          ) : (
            <div className="text-gray-400 text-sm">
              Complete previous challenges to unlock
            </div>
          )}

          {/* Rarity Badge */}
          {challenge.rarity && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              challenge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              challenge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              challenge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {challenge.rarity.charAt(0).toUpperCase() + challenge.rarity.slice(1)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChallengeModal = () => {
    if (!selectedChallenge) return null;

    const status = getChallengeStatus(selectedChallenge);
    const isCompleted = status === 'completed';
    const progress = challengeProgress[selectedChallenge.id];
    const currentStep = progress ? progress.currentStep : 0;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-background-dark rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300">{selectedChallenge.description}</p>
              
              {/* Progress for multi-step challenges */}
              {selectedChallenge.steps && selectedChallenge.steps.length > 0 && (
                <div className="bg-background-light/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-3">Challenge Steps:</h3>
                  <div className="space-y-3">
                    {selectedChallenge.steps.map((step, index) => {
                      const isCompleted = progress && progress.completedSteps.includes(index);
                      const isCurrent = progress && progress.currentStep === index;
                      
                      return (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg border transition-all ${
                            isCompleted 
                              ? 'border-green-500/50 bg-green-500/10' 
                              : isCurrent
                              ? 'border-primary/50 bg-primary/10'
                              : 'border-accent/30 bg-background-light/5'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary' : 'bg-gray-600'
                            }`}>
                              <span className="text-white font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{step.title}</h4>
                              <p className="text-sm text-gray-300 mt-1">{step.description}</p>
                              {step.action && !isCompleted && (
                                <button
                                  onClick={() => handleCompleteStep(selectedChallenge.id, index)}
                                  className="mt-2 bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                                >
                                  Mark as Complete
                                </button>
                              )}
                            </div>
                            {isCompleted && (
                              <div className="text-green-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-background-light/20 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Requirements:</h3>
                <ul className="space-y-1">
                  {selectedChallenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-blue-400">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background-light/20 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Tips:</h3>
                <ul className="space-y-1">
                  {selectedChallenge.tips.map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="text-green-400">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-medium">{selectedChallenge.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">💰</span>
                    <span className="text-white font-medium">{selectedChallenge.coinReward} Coins</span>
                  </div>
                </div>
                
                {(!selectedChallenge.steps || 
                  (progress && progress.completedSteps.length === progress.totalSteps)) ? (
                  <button
                    onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete Challenge</span>
                  </button>
                ) : (
                  <div className="text-sm text-gray-400">
                    Complete all steps to finish
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletionAnimation = () => {
    if (!showCompletion) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Challenge Completed!</h2>
          <p className="text-xl text-gray-300">You earned {selectedChallenge.xpReward} XP and {selectedChallenge.coinReward} coins</p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const filteredChallenges = getFilteredChallenges();
    const completedChallenges = filteredChallenges.filter(challenge => 
      state.user.completedChallenges.includes(challenge.id)
    );
    const availableChallenges = filteredChallenges.filter(challenge => 
      getChallengeStatus(challenge) === 'available'
    );
    const lockedChallenges = filteredChallenges.filter(challenge => 
      getChallengeStatus(challenge) === 'locked'
    );

    return (
      <div className="space-y-6">
        {/* Challenge Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-green-500/10 hover:border-green-500/30"
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedChallenges.length}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-blue-500/10 hover:border-blue-500/30"
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            <div className="text-2xl text-blue-400 mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">{availableChallenges.length}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-gray-500/10"
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            <div className="text-2xl text-gray-400 mb-2">🔒</div>
            <div className="text-2xl font-bold text-white">{lockedChallenges.length}</div>
            <div className="text-sm text-gray-300">Locked</div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map(renderChallengeCard)
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">🏆</div>
              <p>No challenges available with the selected filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="mt-4 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Financial Challenges</h1>
        <p className="text-gray-300">Test your financial knowledge and earn rewards</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-background-dark/50 p-4 rounded-xl border border-accent/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Challenges</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-background-dark border border-accent/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search challenges..."
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-background-dark border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-background-dark border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="spending">Spending</option>
              <option value="budgeting">Budgeting</option>
              <option value="saving">Saving</option>
              <option value="debt">Debt</option>
              <option value="investing">Investing</option>
              <option value="tracking">Tracking</option>
              <option value="planning">Planning</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-300">Sort by:</span>
          <div className="flex space-x-2">
            {['default', 'difficulty', 'reward', 'duration'].map(option => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded text-sm ${
                  sortBy === option
                    ? 'bg-primary text-white'
                    : 'bg-background-light/20 text-gray-300 hover:bg-background-light/30'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Challenge Benefits */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Why Take Financial Challenges?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h4 className="font-semibold text-white">Test Knowledge</h4>
              <p className="text-sm text-gray-300">Apply what you've learned in real-world scenarios</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💰</div>
            <div>
              <h4 className="font-semibold text-white">Earn Rewards</h4>
              <p className="text-sm text-gray-300">Get XP, coins, and unlock exclusive items</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📈</div>
            <div>
              <h4 className="font-semibold text-white">Track Progress</h4>
              <p className="text-sm text-gray-300">Monitor your financial learning journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h4 className="font-semibold text-white">Build Confidence</h4>
              <p className="text-sm text-gray-300">Gain confidence in your financial decision-making</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Modal */}
      {renderChallengeModal()}

      {/* Completion Animation */}
      {renderCompletionAnimation()}
    </div>
  );
};

export default Challenges;