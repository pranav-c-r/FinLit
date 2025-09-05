import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const AchievementsList = () => {
  const { state } = useApp();
  const { user } = state;
  const achievementRefs = useRef([]);

  useEffect(() => {
    achievementRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.remove('opacity-0', 'translate-y-10');
          ref.classList.add('opacity-100', 'translate-y-0');
        }, index * 150 + 300);
      }
    });
  }, []);

  const achievements = [
    {
      icon: '📚',
      title: 'Lesson Master',
      description: `${user.completedLessons?.length || 0} of 5 lessons completed`,
      bgClass: 'from-blue-500/30 to-blue-700/20',
      progress: Math.min(((user.completedLessons?.length || 0) / 5) * 100, 100)
    },
    {
      icon: '🎯',
      title: 'Challenge Champion',
      description: `${user.completedChallenges?.length || 0} of 3 challenges completed`,
      bgClass: 'from-blue-500/30 to-blue-700/20',
      progress: Math.min(((user.completedChallenges?.length || 0) / 3) * 100, 100)
    },
    {
      icon: '🏆',
      title: 'Goal Getter',
      description: `${user.goals?.length || 0} goals set`,
      bgClass: 'from-blue-500/30 to-blue-700/20',
      progress: Math.min(((user.goals?.length || 0) / 3) * 100, 100)
    },
    {
      icon: '⭐',
      title: 'FinLit Novice',
      description: 'Reach level 5',
      bgClass: 'from-blue-500/30 to-blue-700/20',
      progress: Math.min(((user.level || 1) / 5) * 100, 100)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {achievements.map((achievement, index) => (
        <div 
          key={index}
          ref={el => achievementRefs.current[index] = el}
          className="flex flex-col gap-4 p-5 bg-gray-800 border border-blue-700/30 rounded-xl transition-all duration-500 opacity-0 translate-y-10 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-4">
            <div className={`text-3xl bg-gradient-to-br ${achievement.bgClass} w-14 h-14 rounded-full flex items-center justify-center shadow-md`}>
              {achievement.icon}
            </div>
            <div className="achievement-info flex-1">
              <h3 className="text-blue-300 text-lg font-semibold mb-1">{achievement.title}</h3>
              <p className="text-blue-200 text-sm">{achievement.description}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${achievement.progress}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-blue-400">
            {Math.round(achievement.progress)}% Complete
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;