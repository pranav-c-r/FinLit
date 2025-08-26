import React from 'react';
import { useApp } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';
import './Profile.css';

const Profile = () => {
  const { state } = useApp();
  const { user } = state;

  const completedCount = user.completedLessons.length + user.completedChallenges.length;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Track your financial literacy journey</p>
      </div>

      <div className="profile-card card mb-2">
        <div className="profile-header flex-center">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>Financial Explorer</p>
          </div>
        </div>

        <div className="profile-stats grid grid-3 gap-1">
          <div className="stat">
            <div className="stat-value">{user.level}</div>
            <div className="stat-label">Level</div>
          </div>
          <div className="stat">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user.coins}</div>
            <div className="stat-label">FinCoins</div>
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

      <div className="achievements-section card mb-2">
        <h2 className="section-title">Achievements</h2>
        <div className="achievements-grid grid grid-2 gap-1">
          <div className="achievement">
            <div className="achievement-icon">📚</div>
            <div className="achievement-info">
              <h3>Lesson Master</h3>
              <p>{user.completedLessons.length} of 5 lessons completed</p>
            </div>
          </div>
          <div className="achievement">
            <div className="achievement-icon">🎯</div>
            <div className="achievement-info">
              <h3>Challenge Champion</h3>
              <p>{user.completedChallenges.length} of 3 challenges completed</p>
            </div>
          </div>
          <div className="achievement">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-info">
              <h3>Goal Getter</h3>
              <p>{user.goals.length} goals set</p>
            </div>
          </div>
          <div className="achievement">
            <div className="achievement-icon">⭐</div>
            <div className="achievement-info">
              <h3>FinLit Novice</h3>
              <p>Reach level 5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <button className="btn btn-secondary">Edit Profile</button>
        <button className="btn btn-primary">Share Progress</button>
      </div>
    </div>
  );
};

export default Profile;