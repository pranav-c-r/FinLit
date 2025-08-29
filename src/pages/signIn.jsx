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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full bottom-0 right-1/4 animate-float animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-accent/25 rounded-full top-1/3 left-1/4 animate-pulse-slower animate-delay-2000"></div>
      </div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-light to-primary rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110">
            <span className="text-3xl">🦉</span>
          </div>
          <h1 className="text-4xl font-bold heading-gradient mb-2">
            FinLit
          </h1>
          <p className="text-gray-300 text-base">
            Learn financial literacy through games
          </p>
        </div>

        {/* Username Field */}
        <div className="mb-8 animate-fade-in-up animate-delay-300">
          <label htmlFor="username" className="block gradient-text font-semibold mb-3 text-sm">
            USERNAME
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-4 py-4 bg-background-dark border-2 border-primary/30 rounded-xl text-white text-lg focus:outline-none focus:border-primary transition-colors duration-200 placeholder-gray-500"
            placeholder="Enter your username"
          />
        </div>
        <button
          onClick={signInWithGoogle}
          className="w-full py-4 btn-primary text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center animate-fade-in-up animate-delay-500"
        >
          <span className="text-2xl mr-3">🔍</span>
          Sign in with Google
        </button>

        <p className="text-center text-gray-300 text-sm mt-6 animate-fade-in-up animate-delay-700">
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