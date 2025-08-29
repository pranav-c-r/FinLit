import React from 'react';
import { useApp } from '../../context/AppContext';

const SocialNotifications = () => {
  const { state } = useApp();
  
  // Mock notifications data - in a real app, this would come from the state
  const notifications = [
    { 
      id: 1, 
      type: 'friend_request', 
      from: 'Alex Johnson', 
      timestamp: new Date(Date.now() - 3600000).toISOString(), 
      read: false 
    },
    { 
      id: 2, 
      type: 'achievement', 
      from: 'Jamie Smith', 
      achievement: 'Savings Master', 
      timestamp: new Date(Date.now() - 86400000).toISOString(), 
      read: true 
    },
    { 
      id: 3, 
      type: 'level_up', 
      from: 'Taylor Wilson', 
      newLevel: 5, 
      timestamp: new Date(Date.now() - 172800000).toISOString(), 
      read: true 
    }
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case 'friend_request':
        return `${notification.from} sent you a friend request`;
      case 'achievement':
        return `${notification.from} earned the ${notification.achievement} achievement`;
      case 'level_up':
        return `${notification.from} reached level ${notification.newLevel}`;
      default:
        return 'New notification';
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'friend_request':
        return '👥';
      case 'achievement':
        return '🏆';
      case 'level_up':
        return '⭐';
      default:
        return '📣';
    }
  };

  return (
    <div className="social-notifications">
      <h3 className="text-xl font-semibold heading-gradient mb-4">Notifications</h3>
      
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-xl flex items-start gap-3 transition-all duration-300 hover:scale-[1.02] ${notification.read ? 'bg-[#0C291C]' : 'bg-[#0C291C] border-l-4 border-[#F4E87C]'}`}
            >
              <div className="text-2xl bg-gradient-to-br from-primary-light/30 to-primary/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                {getNotificationIcon(notification)}
              </div>
              <div className="flex-grow">
                <p className="text-white text-sm">{getNotificationContent(notification)}</p>
                <p className="text-[#80A1C1] text-xs mt-1">{formatTime(notification.timestamp)}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-[#F4E87C] flex-shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-[#0C291C] rounded-xl">
          <p className="text-[#80A1C1]">No notifications yet</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button className="text-[#80A1C1] text-sm hover:text-white transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default SocialNotifications;