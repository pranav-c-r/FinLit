import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#1a1f2e] via-[#1a1f2e] to-[#111827] text-white overflow-hidden relative">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[#58cc02]/20 rounded-full blur-3xl -top-40 -left-40 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-[#2fa946]/20 rounded-full blur-2xl -bottom-32 -right-32 animate-pulse" />
        <div className="absolute w-[200px] h-[200px] bg-[#58cc02]/10 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
        
        {/* Navigation */}
  <nav className="flex justify-between items-center py-8 px-8 md:px-16 lg:px-32">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#58cc02] to-[#2fa946] bg-clip-text text-transparent">
              FinLit
            </div>
            <div className="hidden md:flex space-x-6 ml-10">
              <a href="#learn" className="text-gray-300 hover:text-white transition-colors">LEARN</a>
              <a href="#practice" className="text-gray-300 hover:text-white transition-colors">PRACTICE</a>
              <a href="#leaderboards" className="text-gray-300 hover:text-white transition-colors">LEADERBOARDS</a>
              <a href="#quests" className="text-gray-300 hover:text-white transition-colors">QUESTS</a>
              <a href="#shop" className="text-gray-300 hover:text-white transition-colors">SHOP</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/signin" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signin" 
              className="px-6 py-2 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center flex-1 text-center pt-8 pb-16 px-4 md:px-0">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-[#58cc02] to-[#2fa946] bg-clip-text text-transparent">Learn Financial Skills.</span>
            <span className="block mt-2">Earn <span className="bg-gradient-to-r from-[#58cc02] to-[#2fa946] bg-clip-text text-transparent">Real Rewards.</span></span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
            Master money management through fun lessons, challenges, and games.<br />Build wealth while learning financial literacy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
            <Link 
              to="/signin" 
              className="px-10 py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-full font-extrabold text-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              Start Learning Free
            </Link>
            <Link 
              to="/lessons" 
              className="px-10 py-4 border-2 border-[#58cc02] text-[#58cc02] rounded-full font-extrabold text-xl hover:bg-[#58cc02] hover:bg-opacity-10 transition-all hover:scale-105"
            >
              Explore Lessons
            </Link>
          </div>
        </section>

        {/* Stats Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4 md:px-16 lg:px-32">
          <div className="text-center p-8 bg-gradient-to-br from-[#1e293b] to-[#1a1f2e] rounded-xl border border-[#374151] shadow-lg">
            <div className="text-4xl font-bold text-[#58cc02] mb-2">10M+</div>
            <div className="text-gray-300 text-lg">Active Learners</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-[#1e293b] to-[#1a1f2e] rounded-xl border border-[#374151] shadow-lg">
            <div className="text-4xl font-bold text-[#58cc02] mb-2">92%</div>
            <div className="text-gray-300 text-lg">Success Rate</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-[#1e293b] to-[#1a1f2e] rounded-xl border border-[#374151] shadow-lg">
            <div className="text-4xl font-bold text-[#58cc02] mb-2">100+</div>
            <div className="text-gray-300 text-lg">Lessons & Challenges</div>
          </div>
        </div>

        {/* Features Section */}
  <div className="mb-20 px-4 md:px-16 lg:px-32">
          <h2 className="text-3xl font-bold text-center mb-12">Why FinLit Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-[#1e293b] to-[#1a1f2e] rounded-xl border border-[#374151] shadow-lg">
              <div className="w-14 h-14 rounded-full bg-[#58cc02] bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Gamified Learning</h3>
              <p className="text-gray-300">
                Earn points, level up, and compete with friends while mastering financial concepts.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-[#1e293b] to-[#1a1f2e] rounded-xl border border-[#374151] shadow-lg">
              <div className="w-14 h-14 rounded-full bg-[#58cc02] bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real Rewards</h3>
              <p className="text-gray-300">
                Complete challenges to earn actual financial rewards and discounts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
  <div className="text-center px-4 md:px-16 lg:px-32">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your financial future?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join millions who are taking control of their finances one lesson at a time.
          </p>
          <Link 
            to="/signin" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Get Started For Free
          </Link>
        </div>

        {/* Footer */}
  <footer className="mt-20 pt-8 border-t border-[#374151] text-center text-gray-400 px-4 md:px-16 lg:px-32">
          <p>© {new Date().getFullYear()} FinLit. All rights reserved.</p>
        </footer>
  </div>
  );
};

export default Landing;