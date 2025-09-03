import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLessonsByDifficulty, getLessonsByCategory, getAvailableLessons } from '../data/lessons';

const Lessons = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCompleteLesson = (lessonId) => {
    dispatch({
      type: 'COMPLETE_LESSON',
      payload: { lessonId }
    });
  };

  const getFilteredLessons = () => {
    let lessons = state.lessons;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      lessons = lessons.filter(lesson => lesson.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      lessons = lessons.filter(lesson => lesson.category === selectedCategory);
    }

    return lessons;
  };

  const getLessonStatus = (lesson) => {
    if (state.user.completedLessons.includes(lesson.id)) {
      return 'completed';
    }
    
    const availableLessons = getAvailableLessons(state.user);
    if (availableLessons.some(l => l.id === lesson.id)) {
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

  const renderLessonCard = (lesson) => {
    const status = getLessonStatus(lesson);
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';

    return (
      <div
        key={lesson.id}
        className={`p-6 rounded-lg border transition-all duration-200 ${
          isCompleted
            ? 'border-green-500/50 bg-green-500/10'
            : isAvailable
            ? 'border-blue-500/50 bg-blue-500/10'
            : 'border-accent/30 bg-background-dark/50 opacity-60'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{lesson.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
              <p className="text-gray-300">{lesson.description}</p>
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
              <span className="text-white capitalize">{lesson.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{lesson.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Difficulty:</span>
              <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(lesson.difficulty)}`}>
                {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-white">{lesson.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">💰</span>
              <span className="text-white">{lesson.coinReward} Coins</span>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">What you'll learn:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lesson.topics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{topic}</span>
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
              onClick={() => handleCompleteLesson(lesson.id)}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Start Lesson
            </button>
          ) : (
            <div className="text-gray-400 text-sm">
              Complete previous lessons to unlock
            </div>
          )}

          {/* Quiz Info */}
          {lesson.quiz && (
            <div className="text-sm text-gray-400">
              {lesson.quiz.length} questions
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const filteredLessons = getFilteredLessons();
    const completedLessons = filteredLessons.filter(lesson => 
      state.user.completedLessons.includes(lesson.id)
    );
    const availableLessons = filteredLessons.filter(lesson => 
      getLessonStatus(lesson) === 'available'
    );
    const lockedLessons = filteredLessons.filter(lesson => 
      getLessonStatus(lesson) === 'locked'
    );

    return (
      <div className="space-y-6">
        {/* Lesson Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedLessons.length}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-blue-400 mb-2">📚</div>
            <div className="text-2xl font-bold text-white">{availableLessons.length}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-gray-400 mb-2">🔒</div>
            <div className="text-2xl font-bold text-white">{lockedLessons.length}</div>
            <div className="text-sm text-gray-300">Locked</div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {filteredLessons.length > 0 ? (
            filteredLessons.map(renderLessonCard)
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📚</div>
              <p>No lessons available with the selected filters</p>
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Financial Lessons</h1>
        <p className="text-gray-300">Learn essential financial concepts and earn rewards</p>
      </div>

      {/* Filters */}
      <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="budgeting">Budgeting</option>
              <option value="saving">Saving</option>
              <option value="debt">Debt</option>
              <option value="investing">Investing</option>
              <option value="retirement">Retirement</option>
              <option value="taxes">Taxes</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          {/* Progress Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Progress</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-background-dark border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Lessons</option>
              <option value="completed">Completed</option>
              <option value="available">Available</option>
              <option value="locked">Locked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Learning Benefits */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Why Learn Financial Literacy?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💰</div>
            <div>
              <h4 className="font-semibold text-white">Build Wealth</h4>
              <p className="text-sm text-gray-300">Learn strategies to save, invest, and grow your money</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🛡️</div>
            <div>
              <h4 className="font-semibold text-white">Financial Security</h4>
              <p className="text-sm text-gray-300">Create emergency funds and protect against financial risks</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h4 className="font-semibold text-white">Achieve Goals</h4>
              <p className="text-sm text-gray-300">Plan and reach your financial objectives</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🚀</div>
            <div>
              <h4 className="font-semibold text-white">Future Planning</h4>
              <p className="text-sm text-gray-300">Prepare for retirement and long-term financial success</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;