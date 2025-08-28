import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import LessonCard from '../components/lessons/LessonCard';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { lessons, challenges } from '../data/mockData';

const Home = () => {
  const { state } = useApp();
  const { user } = state;
  const headerRef = useRef(null);

  // Get first 3 lessons and challenges
  const featuredLessons = lessons.slice(0, 3);
  const featuredChallenges = challenges.slice(0, 3);

  useEffect(() => {
    // Add animation class to header after component mounts
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current.classList.remove('opacity-0', '-translate-y-5');
        headerRef.current.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Additional animated elements specific to Home page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full -bottom-48 -right-48 animate-pulse-slower animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-primary-light/25 rounded-full top-1/4 -right-32 animate-float animate-delay-2000"></div>
      </div>

      {/* Header with animation */}
      <div ref={headerRef} className="relative z-10 mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Welcome back, <span className="text-white">{user.name}!</span>
        </h1>
        <p className="text-gray-300 mt-2">Continue your financial literacy journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-light to-primary rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-primary-light/70 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-primary-light/50 rounded-full"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
          <StatsCard 
            title="Current Level" 
            value={user.level} 
            icon="🎯" 
            color="#F4E87C" 
            delay={0.1}
          />
        </div>
        <div className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-xl animate-delay-500">
          <StatsCard 
            title="FinCoins" 
            value={user.coins} 
            icon="🪙" 
            color="#80A1C1" 
            delay={0.2}
          />
        </div>
        <div className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-xl animate-delay-1000">
          <StatsCard 
            title="Streak" 
            value={user.streak || 0} 
            icon="🔥" 
            color="#F4A87C" 
            delay={0.3}
          />
        </div>
      </div>

      {/* Progress Section with 3D effect */}
      <div className="relative z-10 mb-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
        <div className="bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
          <h2 className="text-xl font-semibold heading-gradient mb-4">Your Progress</h2>
          <ProgressChart 
            xp={user.xp} 
            nextLevelXp={user.nextLevelXp} 
          />
        </div>
      </div>

      {/* Featured Lessons */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold heading-gradient relative inline-block">
            Continue Learning
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F4E87C] rounded-full"></span>
          </h2>
          <Link 
            to="/lessons" 
            className="flex items-center text-[#80A1C1] hover:text-[#F4E87C] transition-colors duration-300 group"
          >
            <span className="mr-2">See all</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <LessonCard 
                lesson={lesson} 
                completed={user.completedLessons.includes(lesson.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Challenges */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white relative inline-block">
            Active Challenges
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F4E87C] rounded-full"></span>
          </h2>
          <Link 
            to="/challenges" 
            className="flex items-center text-[#80A1C1] hover:text-[#F4E87C] transition-colors duration-300 group"
          >
            <span className="mr-2">See all</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredChallenges.map((challenge, index) => (
            <div 
              key={challenge.id} 
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ChallengeCard 
                challenge={challenge} 
                completed={user.completedChallenges.includes(challenge.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;