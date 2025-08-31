// Social data for the FinLit app
export const socialData = {
  friends: [
    {
      id: 'friend1',
      userId: 'user123',
      name: 'Alex Johnson',
      avatar: '👨‍💼',
      level: 5,
      xp: 1250,
      status: 'online',
      lastSeen: '2024-01-15T10:30:00Z',
      mutualFriends: 3,
      achievements: ['Budget Master', 'Savings Samurai'],
      isOnline: true
    },
    {
      id: 'friend2',
      userId: 'user456',
      name: 'Sarah Chen',
      avatar: '👩‍🎓',
      level: 3,
      xp: 800,
      status: 'offline',
      lastSeen: '2024-01-14T18:45:00Z',
      mutualFriends: 2,
      achievements: ['Financial Beginner'],
      isOnline: false
    },
    {
      id: 'friend3',
      userId: 'user789',
      name: 'Mike Rodriguez',
      avatar: '👨‍💻',
      level: 7,
      xp: 2100,
      status: 'online',
      lastSeen: '2024-01-15T11:15:00Z',
      mutualFriends: 5,
      achievements: ['Investment Explorer', 'Streak Master'],
      isOnline: true
    }
  ],

  friendRequests: [
    {
      id: 'req1',
      fromUserId: 'user101',
      fromName: 'Emma Wilson',
      fromAvatar: '👩‍🏫',
      fromLevel: 4,
      message: 'Hey! I saw you on the leaderboard. Would love to connect and learn together!',
      timestamp: '2024-01-15T09:20:00Z',
      status: 'pending'
    },
    {
      id: 'req2',
      fromUserId: 'user202',
      fromName: 'David Kim',
      fromAvatar: '👨‍🔬',
      fromLevel: 6,
      message: 'Great job on the savings challenge! Let\'s be friends and motivate each other.',
      timestamp: '2024-01-14T16:30:00Z',
      status: 'pending'
    }
  ],

  notifications: [
    {
      id: 'notif1',
      type: 'friend_request',
      title: 'New Friend Request',
      message: 'Emma Wilson sent you a friend request',
      timestamp: '2024-01-15T09:20:00Z',
      read: false,
      actionUrl: '/social/friends'
    },
    {
      id: 'notif2',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Budget Boss" title!',
      timestamp: '2024-01-15T08:45:00Z',
      read: false,
      actionUrl: '/profile'
    },
    {
      id: 'notif3',
      type: 'challenge',
      title: 'Challenge Completed',
      message: 'Congratulations! You completed the "No-Spend Week" challenge',
      timestamp: '2024-01-14T20:15:00Z',
      read: true,
      actionUrl: '/challenges'
    }
  ],

  leaderboard: [
    {
      rank: 1,
      userId: 'user789',
      name: 'Mike Rodriguez',
      avatar: '👨‍💻',
      level: 7,
      xp: 2100,
      streak: 25,
      achievements: 8
    },
    {
      rank: 2,
      userId: 'user123',
      name: 'Alex Johnson',
      avatar: '👨‍💼',
      level: 5,
      xp: 1250,
      streak: 18,
      achievements: 5
    },
    {
      rank: 3,
      userId: 'user456',
      name: 'Sarah Chen',
      avatar: '👩‍🎓',
      level: 3,
      xp: 800,
      streak: 12,
      achievements: 3
    },
    {
      rank: 4,
      userId: 'user101',
      name: 'Emma Wilson',
      avatar: '👩‍🏫',
      level: 4,
      xp: 950,
      streak: 15,
      achievements: 4
    },
    {
      rank: 5,
      userId: 'user202',
      name: 'David Kim',
      avatar: '👨‍🔬',
      level: 6,
      xp: 1800,
      streak: 22,
      achievements: 6
    }
  ]
};

// Helper function to get friends list
export const getFriendsList = (userId) => {
  return socialData.friends.filter(friend => friend.userId !== userId);
};

// Helper function to get friend requests
export const getFriendRequests = () => {
  return socialData.friendRequests.filter(request => request.status === 'pending');
};

// Helper function to get notifications
export const getNotifications = (limit = 10) => {
  return socialData.notifications
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

// Helper function to get unread notifications count
export const getUnreadNotificationsCount = () => {
  return socialData.notifications.filter(notification => !notification.read).length;
};

// Helper function to get leaderboard
export const getLeaderboard = (limit = 10) => {
  return socialData.leaderboard.slice(0, limit);
};

// Helper function to get user rank
export const getUserRank = (userId) => {
  const user = socialData.leaderboard.find(entry => entry.userId === userId);
  return user ? user.rank : null;
};

// Helper function to search users
export const searchUsers = (query) => {
  // This would typically search through all users in the system
  // For now, we'll return a mock result
  const mockUsers = [
    {
      id: 'search1',
      name: 'John Doe',
      avatar: '👨',
      level: 2,
      mutualFriends: 1
    },
    {
      id: 'search2',
      name: 'Jane Smith',
      avatar: '👩',
      level: 4,
      mutualFriends: 2
    }
  ];
  
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Helper function to send friend request
export const sendFriendRequest = (fromUserId, toUserId, message = '') => {
  // This would typically make an API call
  // For now, we'll just return success
  return {
    success: true,
    message: 'Friend request sent successfully'
  };
};

// Helper function to accept friend request
export const acceptFriendRequest = (requestId) => {
  // This would typically make an API call
  // For now, we'll just return success
  return {
    success: true,
    message: 'Friend request accepted'
  };
};

// Helper function to decline friend request
export const declineFriendRequest = (requestId) => {
  // This would typically make an API call
  // For now, we'll just return success
  return {
    success: true,
    message: 'Friend request declined'
  };
};

// Helper function to remove friend
export const removeFriend = (friendId) => {
  // This would typically make an API call
  // For now, we'll just return success
  return {
    success: true,
    message: 'Friend removed successfully'
  };
};
