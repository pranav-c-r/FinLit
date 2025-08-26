import React from 'react';
import { useApp } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';


const Profile = () => {
  const { state } = useApp();
  const { user } = state;

  const completedCount = user.completedLessons.length + user.completedChallenges.length;

  return (
    <div className="p-4 md:p-8">
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Track your financial literacy journey</p>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-duolingo-green text-white flex items-center justify-center text-4xl font-bold mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2 className="text-gray-700 text-2xl font-semibold mb-1">{user.name}</h2>
            <p className="text-gray-700">Financial Explorer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-4xl font-bold text-duolingo-green mb-1">{user.level}</div>
            <div className="text-gray-700 text-sm">Level</div>
          </div>
          <div className="stat">
            <div className="text-4xl font-bold text-duolingo-green mb-1">{completedCount}</div>
            <div className="text-gray-700 text-sm">Completed</div>
          </div>
          <div className="stat">
            <div className="text-4xl font-bold text-duolingo-green mb-1">{user.coins}</div>
            <div className="text-gray-700 text-sm">FinCoins</div>
          </div>
        </div>
      </div>

      <div className="progress-section card mb-2">
        <h2 className="section-title">Level Progress</h2>
        <ProgressChart 
          xp={user.xp} 
          nextLevelXp={user.nextLevelXp} 
        />
      </div>

      <div className="card mb-8">
        <h2 className="section-title">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <div className="text-4xl">📚</div>
            <div className="achievement-info">
              <h3 className="text-duolingo-light-green text-lg font-semibold mb-1">Lesson Master</h3>
              <p className="text-gray-700 text-sm">{user.completedLessons.length} of 5 lessons completed</p>
            </div>
          </div>
          <div className="achievement">
            <div className="text-4xl">🎯</div>
            <div className="achievement-info">
              <h3 className="text-duolingo-light-green text-lg font-semibold mb-1">Challenge Champion</h3>
              <p className="text-gray-700 text-sm">{user.completedChallenges.length} of 3 challenges completed</p>
            </div>
          </div>
          <div className="achievement">
            <div className="text-4xl">🏆</div>
            <div className="achievement-info">
              <h3 className="text-duolingo-light-green text-lg font-semibold mb-1">Goal Getter</h3>
              <p className="text-gray-700 text-sm">{user.goals.length} goals set</p>
            </div>
          </div>
          <div className="achievement">
            <div className="text-4xl">⭐</div>
            <div className="achievement-info">
              <h3 className="text-duolingo-light-green text-lg font-semibold mb-1">FinLit Novice</h3>
              <p className="text-gray-700 text-sm">Reach level 5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8 flex-col md:flex-row">
        <button className="btn btn-secondary">Edit Profile</button>
        <button className="btn btn-primary">Share Progress</button>
      </div>
    </div>
  );
};

export default Profile;