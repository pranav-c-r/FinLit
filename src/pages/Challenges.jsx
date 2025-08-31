import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getChallengesByDifficulty, getChallengesByCategory, getAvailableChallenges } from '../data/challenges';

const Challenges = () => {
  const { state, dispatch } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const handleCompleteChallenge = (challengeId) => {
    dispatch({
      type: 'COMPLETE_CHALLENGE',
      payload: { challengeId }
    });
    setSelectedChallenge(null);
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

  const renderChallengeCard = (challenge) => {
    const status = getChallengeStatus(challenge);
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';

    return (
      <div
        key={challenge.id}
        className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${
          isCompleted
            ? 'border-green-500/50 bg-green-500/10'
            : isAvailable
            ? 'border-blue-500/50 bg-blue-500/10 hover:border-blue-400/60'
            : 'border-accent/30 bg-background-dark/50 opacity-60'
        }`}
        onClick={() => isAvailable && setSelectedChallenge(challenge)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{challenge.icon}</div>
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
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Requirements:</h4>
          <div className="space-y-1">
            {challenge.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-blue-400">•</span>
                <span className="text-gray-300">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tips:</h4>
          <div className="space-y-1">
            {challenge.tips.map((tip, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-green-400">💡</span>
                <span className="text-gray-300">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
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
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Start Challenge
            </button>
          ) : (
            <div className="text-gray-400 text-sm">
              Complete previous challenges to unlock
            </div>
          )}

          {/* Rarity Badge */}
          {challenge.rarity && (
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              challenge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
              challenge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
              challenge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {challenge.rarity.charAt(0).toUpperCase() + challenge.rarity.slice(1)}
            </div>
          )}
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
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedChallenges.length}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-blue-400 mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">{availableChallenges.length}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
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

      {/* Filters */}
      <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">{selectedChallenge.description}</p>
                
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
                  <button
                    onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Complete Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;