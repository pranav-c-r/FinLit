import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-dark/90 backdrop-blur-md border-t border-accent/30 py-6 mt-auto w-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-64 h-64 bg-primary-light/30 rounded-full blur-3xl -bottom-32 -left-32 animate-pulse-slow" />
        <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-2xl -top-24 right-16 animate-pulse-slower animate-delay-1000" />
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
        <div className="space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">FinLit</h3>
          <p className="text-gray-300 text-sm">Empowering financial literacy through interactive learning.</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <div className="flex flex-col space-y-2">
            <Link to="/lessons" className="text-gray-300 hover:text-white transition-colors">Lessons</Link>
            <Link to="/challenges" className="text-gray-300 hover:text-white transition-colors">Challenges</Link>
            <Link to="/goals" className="text-gray-300 hover:text-white transition-colors">Goals</Link>
            <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex flex-col space-y-2">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Discord Community</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-accent/30">
        <p className="text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} FinLit. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;