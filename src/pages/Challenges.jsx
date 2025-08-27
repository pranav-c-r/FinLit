import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { challenges } from '../data/mockData';

const Challenges = () => {
  const { state } = useApp();
  const { user } = state;
  const categories = [...new Set(challenges.map(challenge => challenge.category))];
  const categoryRefs = useRef([]);

  useEffect(() => {
    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.remove('opacity-0', 'translate-y-10');
          ref.classList.add('opacity-100', 'translate-y-0');
        }, index * 150);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#01110A] p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#80A1C1] rounded-full -top-36 -left-36 opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#F4E87C] rounded-full -bottom-48 -right-48 opacity-10"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4E87C] to-[#80A1C1] bg-clip-text text-transparent">
          Financial Challenges
        </h1>
        <p className="text-[#80A1C1] mt-2">Test your knowledge with real-world financial challenges</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-[#F4E87C] rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-[#80A1C1] rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-[#80A1C1] rounded-full"></div>
        </div>
      </div>

      <div className="categories-section mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 relative inline-block">
          Categories
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F4E87C] rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category} 
              ref={el => categoryRefs.current[index] = el}
              className="bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transition-all duration-500 opacity-0 translate-y-10 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            >
              <h3 className="text-[#F4E87C] text-lg font-semibold mb-2">{category}</h3>
              <p className="text-[#80A1C1] text-sm">{challenges.filter(c => c.category === category).length} challenges</p>
            </div>
          ))}
        </div>
      </div>

      <div className="all-challenges-section relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 relative inline-block">
          All Challenges
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F4E87C] rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => (
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

export default Challenges;