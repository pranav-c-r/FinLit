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
      description: `${user.completedLessons.length} of 5 lessons completed`,
      bgClass: 'from-primary-light/30 to-primary/20'
    },
    {
      icon: '🎯',
      title: 'Challenge Champion',
      description: `${user.completedChallenges.length} of 3 challenges completed`,
      bgClass: 'from-primary-light/30 to-primary/20'
    },
    {
      icon: '🏆',
      title: 'Goal Getter',
      description: `${user.goals.length} goals set`,
      bgClass: 'from-primary-light/30 to-primary/20'
    },
    {
      icon: '⭐',
      title: 'FinLit Novice',
      description: 'Reach level 5',
      bgClass: 'from-primary-light/30 to-primary/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {achievements.map((achievement, index) => (
        <div 
          key={index}
          ref={el => achievementRefs.current[index] = el}
          className="flex items-center gap-4 p-4 bg-[#0C291C] rounded-xl transition-all duration-500 opacity-0 translate-y-10 transform hover:scale-105 hover:shadow-xl"
        >
          <div className={`text-4xl bg-gradient-to-br ${achievement.bgClass} w-16 h-16 rounded-full flex items-center justify-center`}>
            {achievement.icon}
          </div>
          <div className="achievement-info">
            <h3 className="heading-gradient text-lg font-semibold mb-1">{achievement.title}</h3>
            <p className="text-[#80A1C1] text-sm">{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;