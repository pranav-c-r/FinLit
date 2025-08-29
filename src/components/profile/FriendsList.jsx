import React from 'react';
import { useApp } from '../../context/AppContext';

const FriendsList = () => {
  const { state } = useApp();
  const { user } = state;

  // If no friends, show a message
  if (!user.friends || user.friends.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-[#80A1C1] mb-4">You haven't added any friends yet</p>
        <button className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-4 py-2 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Find Friends
        </button>
      </div>
    );
  }

  return (
    <div className="friends-list">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user.friends.map((friend, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-[#0C291C] rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {friend.avatar ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1C3B2A]">
                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white flex items-center justify-center text-xl font-bold">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="friend-info">
              <h3 className="heading-gradient text-md font-semibold">{friend.name}</h3>
              <p className="text-[#80A1C1] text-xs">Level {friend.level}</p>
            </div>
            <div className="ml-auto">
              <button className="text-xs bg-[#0A1F14] text-[#80A1C1] px-2 py-1 rounded-lg hover:bg-[#1C3B2A] transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;