import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const FriendRequests = () => {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock friend requests data - in a real app, this would come from the state
  const friendRequests = [
    { id: 1, name: 'Alex Johnson', avatar: null, level: 5 },
    { id: 2, name: 'Jamie Smith', avatar: null, level: 3 }
  ];

  // Mock suggested friends - in a real app, this would be fetched from an API
  const suggestedFriends = [
    { id: 3, name: 'Taylor Wilson', avatar: null, level: 7 },
    { id: 4, name: 'Jordan Lee', avatar: null, level: 4 },
    { id: 5, name: 'Casey Brown', avatar: null, level: 6 }
  ];

  const handleAcceptRequest = (friendId) => {
    // In a real app, this would dispatch an action to update the state
    console.log(`Accepted friend request from ${friendId}`);
    // dispatch({ type: 'ADD_FRIEND', payload: { friendId } });
  };

  const handleRejectRequest = (friendId) => {
    // In a real app, this would dispatch an action to update the state
    console.log(`Rejected friend request from ${friendId}`);
    // dispatch({ type: 'REJECT_FRIEND_REQUEST', payload: { friendId } });
  };

  const handleSendRequest = (friendId) => {
    // In a real app, this would dispatch an action to update the state
    console.log(`Sent friend request to ${friendId}`);
    // dispatch({ type: 'SEND_FRIEND_REQUEST', payload: { friendId } });
  };

  const filteredSuggestions = suggestedFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="friend-requests">
      <div className="mb-6">
        <h3 className="text-xl font-semibold heading-gradient mb-4">Friend Requests</h3>
        {friendRequests.length > 0 ? (
          <div className="space-y-4">
            {friendRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center gap-3">
                  {request.avatar ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1C3B2A]">
                      <img src={request.avatar} alt={request.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white flex items-center justify-center text-xl font-bold">
                      {request.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white">{request.name}</h4>
                    <p className="text-xs text-[#80A1C1]">Level {request.level}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-3 py-1 bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-3 py-1 bg-[#0A1F14] text-[#80A1C1] text-sm rounded-lg hover:bg-[#1C3B2A] transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-[#0C291C] rounded-xl">
            <p className="text-[#80A1C1]">No pending friend requests</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold heading-gradient mb-4">Find Friends</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-[#0C291C] border border-[#1C3B2A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#80A1C1]"
          />
        </div>
        
        <div className="space-y-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center gap-3">
                  {friend.avatar ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1C3B2A]">
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white flex items-center justify-center text-xl font-bold">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white">{friend.name}</h4>
                    <p className="text-xs text-[#80A1C1]">Level {friend.level}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSendRequest(friend.id)}
                  className="px-3 py-1 bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Friend
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-[#0C291C] rounded-xl">
              <p className="text-[#80A1C1]">No users found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;