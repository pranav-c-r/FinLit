import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import LessonCard from '../components/lessons/LessonCard';
import { lessons } from '../data/mockData';

const Lessons = () => {
  const { state } = useApp();
  const { user } = state;
  const categories = [...new Set(lessons.map(lesson => lesson.category))];
  const categoryRefs = useRef([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredLessons, setFilteredLessons] = useState(lessons);

  useEffect(() => {
    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.remove('opacity-0', 'scale-90');
          ref.classList.add('opacity-100', 'scale-100');
        }, index * 150);
      }
    });
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredLessons(lessons);
    } else {
      setFilteredLessons(lessons.filter(lesson => lesson.category === activeCategory));
    }
  }, [activeCategory]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Budgeting': '💰',
      'Investing': '📈',
      'Saving': '🏦',
      'Credit': '💳',
      'Debt': '📉',
      'Retirement': '👵',
      'Taxes': '🧾',
      'Insurance': '🛡️'
    };
    return icons[category] || '📚';
  };

  const getProgressPercentage = () => {
    const completed = user.completedLessons.length;
    const total = lessons.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-background-dark">
      {/* Header Section */}
      <div className="relative z-10 mb-10 text-center">
        <div className="inline-block bg-gradient-to-r from-primary-light to-primary p-1 rounded-full mb-4">
          <div className="bg-gray-800 rounded-full p-3">
            <span className="text-2xl">🎓</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text-secondary">
          Financial Adventure
        </h1>
        <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
          Embark on a journey to master your finances. Complete lessons, earn badges, and level up your financial knowledge!
        </p>
        
        {/* Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Your Progress</span>
            <span className="text-sm font-bold text-primary-light">{getProgressPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-primary-light to-primary h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">{user.completedLessons.length} lessons completed</span>
            <span className="text-xs text-gray-400">{lessons.length - user.completedLessons.length} to go</span>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="mb-10 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Path</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
              activeCategory === 'All' 
                ? 'bg-gradient-to-r from-primary-light to-primary text-white shadow-lg transform -translate-y-1' 
                : 'bg-gray-800 text-gray-300 shadow-md hover:bg-gray-700'
            }`}
          >
            <span className="mr-2">🌠</span> All Topics
          </button>
          
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              ref={el => categoryRefs.current[index] = el}
              className={`px-5 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-primary-light to-primary text-white shadow-lg transform -translate-y-1' 
                  : 'bg-gray-800 text-gray-300 shadow-md hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span> {category}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeCategory === 'All' ? 'All Quests' : activeCategory + ' Quests'}
          </h2>
          <div className="flex items-center bg-gray-800 py-1 px-3 rounded-full shadow-sm">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="text-sm font-medium text-gray-300">{filteredLessons.length} lessons</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`relative rounded-2xl overflow-hidden game-card ${
                user.completedLessons.includes(lesson.id) 
                  ? 'border-2 border-green-500' 
                  : 'border-2 border-transparent'
              }`}>
                {/* Lesson Header with Gradient */}
                <div className="h-4 bg-gradient-to-r from-primary-light to-primary"></div>
                
                <div className="p-6 bg-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      user.completedLessons.includes(lesson.id) 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-gray-700 text-primary-light'
                    }`}>
                      {user.completedLessons.includes(lesson.id) ? '✓' : lesson.emoji}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {lesson.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{lesson.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">⏱️</span>
                      <span className="text-xs text-gray-400">{lesson.duration} min</span>
                    </div>
                    
                    <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      user.completedLessons.includes(lesson.id)
                        ? 'bg-green-900 text-green-300'
                        : 'bg-gradient-to-r from-primary-light to-primary text-white hover:shadow-md'
                    }`}>
                      {user.completedLessons.includes(lesson.id) ? 'Completed' : 'Start Quest'}
                    </button>
                  </div>
                </div>
                
                {/* XP Badge */}
                <div className="absolute top-3 right-3 bg-yellow-900 text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">
                  +{lesson.xp} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Callout */}
      <div className="mt-12 bg-gradient-to-r from-primary-light to-primary rounded-2xl p-6 text-center text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-2">Unlock Achievements!</h3>
        <p className="mb-4">Complete lessons to earn badges and climb the leaderboard.</p>
        <button className="bg-gray-800 text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-700 transition">
          View Achievements
        </button>
      </div>
    </div>
  );
};

export default Lessons;