import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getLessonsByDifficulty, getLessonsByCategory, getAvailableLessons } from '../data/lessons';

const Lessons = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Reset quiz when lesson changes
  useEffect(() => {
    if (activeLesson && !showQuiz) {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setQuizScore(0);
      setShowResults(false);
    }
  }, [activeLesson, showQuiz]);

  const handleCompleteLesson = (lessonId) => {
    dispatch({
      type: 'COMPLETE_LESSON',
      payload: { lessonId }
    });
    
    // If lesson has a quiz, show it instead of marking as complete immediately
    const lesson = state.lessons.find(l => l.id === lessonId);
    if (lesson && lesson.quiz) {
      setActiveLesson(lesson);
      setShowQuiz(true);
    } else {
      // Show completion animation
      setTimeout(() => {
        setActiveLesson(null);
      }, 1500);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    // Check if answer is correct
    const currentQuiz = activeLesson.quiz;
    if (currentQuiz && currentQuiz[currentQuestion].correctAnswer === answerIndex) {
      setQuizScore(prev => prev + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < currentQuiz.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const finishQuiz = () => {
    // Calculate if user passed (at least 70% correct)
    const passThreshold = Math.ceil(activeLesson.quiz.length * 0.7);
    const passed = quizScore >= passThreshold;
    
    if (passed) {
      // Only complete the lesson if quiz is passed
      dispatch({
        type: 'COMPLETE_LESSON',
        payload: { lessonId: activeLesson.id }
      });
    }
    
    setShowQuiz(false);
    setActiveLesson(null);
  };

  const getFilteredLessons = () => {
    let lessons = state.lessons;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      lessons = lessons.filter(lesson => lezsson.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      lessons = lessons.filter(lesson => lesson.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      lessons = lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(query) || 
        lesson.description.toLowerCase().includes(query) ||
        lesson.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Filter by progress status
    if (activeTab !== 'all') {
      lessons = lessons.filter(lesson => getLessonStatus(lesson) === activeTab);
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

  const renderQuiz = () => {
    if (!activeLesson || !activeLesson.quiz) return null;
    
    const quiz = activeLesson.quiz;
    const currentQ = quiz[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.length - 1;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-background-dark rounded-xl max-w-2xl w-full p-6 border border-primary/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">{activeLesson.title} - Quiz</h3>
            <button
              onClick={() => {
                setShowQuiz(false);
                setActiveLesson(null);
              }}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {!showResults ? (
            <>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Question {currentQuestion + 1} of {quiz.length}</span>
                  <span className="text-primary font-semibold">Score: {quizScore}/{quiz.length}</span>
                </div>
                <h4 className="text-xl text-white mb-4">{currentQ.question}</h4>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnswer === index
                          ? index === currentQ.correctAnswer
                            ? 'bg-green-500/20 border-green-500 text-white'
                            : 'bg-red-500/20 border-red-500 text-white'
                          : 'border-accent/30 bg-background-light/10 hover:bg-background-light/20 text-gray-300'
                      } ${selectedAnswer !== null && index === currentQ.correctAnswer ? 'bg-green-500/20 border-green-500' : ''}`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">{quizScore >= quiz.length * 0.7 ? '🎉' : '😔'}</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {quizScore >= quiz.length * 0.7 ? 'Congratulations!' : 'Try Again'}
              </h3>
              <p className="text-gray-300 mb-2">
                You scored {quizScore} out of {quiz.length} questions correctly.
              </p>
              <p className="text-gray-300 mb-6">
                {quizScore >= quiz.length * 0.7 
                  ? 'You have successfully completed the lesson!'
                  : 'You need at least 70% correct answers to complete this lesson.'}
              </p>
              
              <button
                onClick={finishQuiz}
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                {quizScore >= quiz.length * 0.7 ? 'Continue Learning' : 'Retry Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLessonCard = (lesson) => {
    const status = getLessonStatus(lesson);
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';

    return (
      <div
        key={lesson.id}
        className={`p-6 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] ${
          isCompleted
            ? 'border-green-500/50 bg-green-500/10'
            : isAvailable
            ? 'border-blue-500/50 bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20'
            : 'border-accent/30 bg-background-dark/50 opacity-60'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500/20' : isAvailable ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
              <div className="text-2xl">{lesson.icon}</div>
            </div>
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
            {lesson.quiz && (
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">❓</span>
                <span className="text-white">{lesson.quiz.length} question quiz</span>
              </div>
            )}
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
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Lesson</span>
            </button>
          ) : (
            <div className="text-gray-400 text-sm">
              Complete previous lessons to unlock
            </div>
          )}

          {/* Preview button for locked lessons */}
          {!isAvailable && !isCompleted && (
            <button className="text-gray-400 hover:text-white text-sm flex items-center">
              Preview
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
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
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-green-500/10 hover:border-green-500/30"
            onClick={() => setActiveTab('completed')}
          >
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedLessons.length}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-blue-500/10 hover:border-blue-500/30"
            onClick={() => setActiveTab('available')}
          >
            <div className="text-2xl text-blue-400 mb-2">📚</div>
            <div className="text-2xl font-bold text-white">{availableLessons.length}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div 
            className="bg-background-dark/50 p-4 rounded-xl border border-accent/30 text-center cursor-pointer transition-all hover:bg-gray-500/10"
            onClick={() => setActiveTab('locked')}
          >
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
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setActiveTab('all');
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Financial Lessons</h1>
        <p className="text-gray-300">Learn essential financial concepts and earn rewards</p>
      </div>

      {/* Search Bar */}
      <div className="bg-background-dark/50 p-4 rounded-xl border border-accent/30">
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
            className="block w-full pl-10 pr-3 py-3 bg-background-dark border border-accent/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search lessons by title, description, or topics..."
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background-dark/50 p-4 rounded-xl border border-accent/30">
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

      {/* Quiz Modal */}
      {showQuiz && renderQuiz()}
    </div>
  );
};

export default Lessons;