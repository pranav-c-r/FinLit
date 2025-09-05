import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FriendRequests from '../components/social/FriendRequests';
import FriendsList from '../components/profile/FriendsList';
import SocialNotifications from '../components/social/SocialNotifications';
import { motion, AnimatePresence } from 'framer-motion';

const Social = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [onlineFriends, setOnlineFriends] = useState(3);
  const [pendingRequests, setPendingRequests] = useState(2);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [showFriendAdded, setShowFriendAdded] = useState(false);
  const [newFriend, setNewFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    progressSharing: true,
    friendRequests: true,
    leaderboard: true
  });
  
  const { state } = useApp();

  // Simulate receiving a friend request
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && pendingRequests < 5) {
        setPendingRequests(prev => prev + 1);
        setUnreadNotifications(prev => prev + 1);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [pendingRequests]);

  // Simulate online friends count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineFriends(Math.floor(Math.random() * 5) + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAddFriend = (friendName) => {
    setNewFriend(friendName);
    setShowFriendAdded(true);
    setPendingRequests(prev => prev - 1);
    setTimeout(() => setShowFriendAdded(false), 3000);
  };

  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const FriendAddedToast = () => (
    <AnimatePresence>
      {showFriendAdded && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center"
        >
          <span className="text-xl mr-2">🎉</span>
          <span>You're now friends with <strong>{newFriend}</strong>!</span>
          <button 
            onClick={() => setShowFriendAdded(false)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const TabButton = ({ tab, icon, label, count }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300 flex items-center ${
        activeTab === tab 
          ? 'bg-slate-800 text-blue-400 border-t-2 border-x-2 border-blue-400/50 shadow-lg' 
          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 hover:text-white'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      <span className="flex items-center">
        {icon}
        {label}
        {count > 0 && (
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
            activeTab === tab ? 'bg-blue-500 text-white' : 'bg-blue-600/30 text-blue-300'
          }`}>
            {count}
          </span>
        )}
      </span>
    </motion.button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <FriendAddedToast />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-400/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Social Hub
        </motion.h1>
        <p className="text-slate-300 mt-2">Connect with friends and level up your financial journey</p>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg border border-blue-500/30">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-slate-300">{onlineFriends} friends online</span>
          </div>
          <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg border border-blue-500/30">
            <span className="text-sm text-slate-300">👥 {state.user?.friends?.length || 0} total friends</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 mb-6"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-slate-800/70 border border-blue-500/30 rounded-xl text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            placeholder="Search friends or users..."
          />
        </div>
      </motion.div>

      {/* Gamified Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex mb-6 relative z-10 gap-2 overflow-x-auto pb-2"
      >
        <TabButton 
          tab="friends" 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          label="My Friends"
        />
        <TabButton 
          tab="requests" 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>}
          label="Friend Requests"
          count={pendingRequests}
        />
        <TabButton 
          tab="notifications" 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>}
          label="Notifications"
          count={unreadNotifications}
        />
        <TabButton 
          tab="privacy" 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
          label="Privacy"
        />
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {activeTab === 'friends' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <FriendsList searchQuery={searchQuery} />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <FriendRequests onAddFriend={handleAddFriend} />
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <SocialNotifications onMarkAsRead={() => setUnreadNotifications(0)} />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <h2 className="text-xl font-semibold text-blue-400 mb-6">
              Privacy Settings
            </h2>
            
            <div className="space-y-6">
              {[
                { key: 'profileVisibility', title: 'Profile Visibility', desc: 'Allow other users to view your profile' },
                { key: 'progressSharing', title: 'Progress Sharing', desc: 'Share your learning progress with friends' },
                { key: 'friendRequests', title: 'Friend Requests', desc: 'Allow users to send you friend requests' },
                { key: 'leaderboard', title: 'Leaderboard Participation', desc: 'Show your name and progress on the leaderboard' }
              ].map((setting) => (
                <motion.div 
                  key={setting.key}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 cursor-pointer"
                  onClick={() => handlePrivacyChange(setting.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{setting.title}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={privacySettings[setting.key]}
                        onChange={() => {}}
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        privacySettings[setting.key] 
                          ? 'bg-blue-500 after:border-white' 
                          : 'bg-slate-600'
                      }`}></div>
                    </label>
                  </div>
                  <p className="text-sm text-slate-300">{setting.desc}</p>
                </motion.div>
              ))}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
              >
                Save Privacy Settings
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30 shadow-lg z-20"
      >
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Friend
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            Messages
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Social;