import { auth, database, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
const SignIn = () => {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

   const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    const signInWithGoogle = async () => {
        if (!username) {
            alert("Please enter username and select a role.");
            return;
        }
        try {
            await signInWithPopup(auth, googleprovider);
            addUser();
            navigate("/home");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };
    const addUser = async () => {
        const userRef = collection(database, "Users");
        const userDocRef = doc(userRef, auth.currentUser.uid);

        try {
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    username: username,
                    email: auth.currentUser.email,
                });
            }
        } catch (err) {
            console.error("Error adding user:", err);
        }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#1a1f2e] to-[#111827] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#58cc02] rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🦉</span>
          </div>
          <h1 className="text-4xl font-bold text-[#58cc02] mb-2">
            FinLit
          </h1>
          <p className="text-gray-400 text-base">
            Learn financial literacy through games
          </p>
        </div>

        {/* Username Field */}
        <div className="mb-8">
          <label htmlFor="username" className="block text-[#58cc02] font-semibold mb-3 text-sm">
            USERNAME
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-xl text-white text-lg focus:outline-none focus:border-[#58cc02] transition-colors duration-200 placeholder-gray-500"
            placeholder="Enter your username"
          />
        </div>
        <button
          onClick={signInWithGoogle}
          className="w-full py-4 bg-[#58cc02] hover:bg-[#2fa946] text-white font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <span className="text-2xl mr-3">🔍</span>
          Sign in with Google
        </button>

        <p className="text-center text-gray-400 text-sm mt-6">
          Works for both new and existing users
        </p>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button 
            type="button"
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;