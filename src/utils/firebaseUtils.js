import { auth, database } from '../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Centralized function to save user progress to Firebase
 * Fixes the recurring issue with incorrect getDoc() calls
 * @param {string} level - The level (e.g., "level1", "level2", "level3")
 * @param {string} round - The round (e.g., "round1", "round2", etc.)
 * @param {Object} userChoices - The user choices object to save
 * @param {Object} metadata - Additional metadata like completed flags
 * @returns {Promise<boolean>} - Returns true if save was successful, false otherwise
 */
export const saveUserProgress = async (level, round, userChoices, metadata = {}) => {
  if (!auth.currentUser) {
    console.error("No authenticated user found");
    return false;
  }
  
  try {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(database, "Users", userId);
    
    // Check if user document exists
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      // User document exists, update it
      const updateData = {
        [`${level}.${round}`]: userChoices,
        level: parseInt(level.replace('level', '')),
        round: parseInt(round.replace('round', '')),
        [`${round}_completed`]: true,
        ...metadata
      };
      
      await updateDoc(userDocRef, updateData);
    } else {
      // User document doesn't exist, create it
      const newUserData = {
        [level]: {
          [round]: userChoices
        },
        level: parseInt(level.replace('level', '')),
        round: parseInt(round.replace('round', '')),
        [`${round}_completed`]: true,
        ...metadata
      };
      
      await setDoc(userDocRef, newUserData);
    }
    
    console.log(`Progress saved successfully for ${level} ${round}`);
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};

/**
 * Function to load user progress from Firebase
 * @param {string} level - The level to load (optional)
 * @param {string} round - The round to load (optional)
 * @returns {Promise<Object|null>} - Returns user progress data or null if error
 */
export const loadUserProgress = async (level = null, round = null) => {
  if (!auth.currentUser) {
    console.error("No authenticated user found");
    return null;
  }
  
  try {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(database, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      if (level && round) {
        // Return specific level and round data
        return userData[level]?.[round] || null;
      } else if (level) {
        // Return specific level data
        return userData[level] || null;
      } else {
        // Return all user data
        return userData;
      }
    } else {
      console.log("No user progress found");
      return null;
    }
  } catch (error) {
    console.error("Error loading progress:", error);
    return null;
  }
};

/**
 * Function to get user's current level and round
 * @returns {Promise<Object>} - Returns {level, round} or {level: 1, round: 1} as default
 */
export const getCurrentProgress = async () => {
  try {
    const userData = await loadUserProgress();
    return {
      level: userData?.level || 1,
      round: userData?.round || 1
    };
  } catch (error) {
    console.error("Error getting current progress:", error);
    return { level: 1, round: 1 };
  }
};
