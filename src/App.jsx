import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import PiggyBank from './pages/PiggyBank';
import ExpenseTracker from './components/expenses/ExpenseTracker';
import DailyQuests from './components/quests/DailyQuests';
import Rewards from './pages/Rewards';
import Social from './pages/Social';
import Achievements from './pages/Achievements';
import LevelOverview from './pages/LevelOverview'; // Import the new LevelOverview component

import './App.css';
import './styles/globals.css';
import SignIn from './pages/signIn';
import Round1 from './pages/Level1/round1';
import Round2 from './pages/Level1/round2';
import Round3 from './pages/Level1/round3';
import Round4 from './pages/Level1/round4';
import Round5 from './pages/Level1/round5';
import Round6 from './pages/Level1/round6';
import Level1Overview from './pages/Level1'; // This will be the new index.jsx for Level 1

import Round1Level2 from './pages/Level2/round1';
import Round2Level2 from './pages/Level2/round2';
import Round3Level2 from './pages/Level2/round3';
import Round4Level2 from './pages/Level2/round4';
import Round5Level2 from './pages/Level2/round5';
import Round6Level2 from './pages/Level2/round6';
import Level2Overview from './pages/Level2';

import Round1Level3 from './pages/Level3/round1'; // Import Level 3 rounds
import Round2Level3 from './pages/Level3/round2';
import Round3Level3 from './pages/Level3/round3';
import Round4Level3 from './pages/Level3/round4';
import Round5Level3 from './pages/Level3/round5';
import Level3Overview from './pages/Level3';

// Game UI Background
const GameBackground = () => {
  return (
    <div className="app-background">
      {/* Clean background without any elements */}
    </div>
  );
};

// Create a layout component for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="App">
      <GameBackground />
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="main-content mx-4 my-4 p-4">
          {children}
        </main>
        <Footer />
      </div>
      <Navigation />
    </div>
  );
};

// Create a layout for public routes (no sidebar/navigation)
// Create a layout for public routes (no sidebar/navigation)
const PublicLayout = ({ children, path }) => {
  return (
    <div className="App public-layout-container"> {/* Added public-layout-container class */}
      <GameBackground />
      <div className="app-content">
        <main className="main-content public-layout landing-page"> {/* Added landing-page class */}
          {children}
        </main>
        {/* Don't include Footer on Landing page as it has its own footer */}
        {path !== '/landing' && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Redirect from root to landing page */}
          <Route path="/" element={
            <Navigate to="/landing" replace />
          } />
          <Route path="/landing" element={
            <PublicLayout path="/landing">
              <Landing />
            </PublicLayout>
          } />
          <Route path="/levels" element={ // New route for the LevelOverview page
            <AuthenticatedLayout>
              <LevelOverview />
            </AuthenticatedLayout>
          } />
          <Route path="/level1" element={ // Redirect from /level1 to LevelOverview, as it's now handled there
            <AuthenticatedLayout>
              <Level1Overview />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round1" element={
            <AuthenticatedLayout>
              <Round1 />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round2" element={
            <AuthenticatedLayout>
              <Round2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round3" element={
            <AuthenticatedLayout>
              <Round3 />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round4" element={
            <AuthenticatedLayout>
              <Round4 />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round5" element={
            <AuthenticatedLayout>
              <Round5 />
            </AuthenticatedLayout>
          } />
          <Route path="/level1/round6" element={
            <AuthenticatedLayout>
              <Round6 />
            </AuthenticatedLayout>
          } />

          {/* Level 2 Routes */}
          <Route path="/level2" element={
            <AuthenticatedLayout>
              <Level2Overview />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round1" element={
            <AuthenticatedLayout>
              <Round1Level2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round2" element={
            <AuthenticatedLayout>
              <Round2Level2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round3" element={
            <AuthenticatedLayout>
              <Round3Level2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round4" element={
            <AuthenticatedLayout>
              <Round4Level2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round5" element={
            <AuthenticatedLayout>
              <Round5Level2 />
            </AuthenticatedLayout>
          } />
          <Route path="/level2/round6" element={
            <AuthenticatedLayout>
              <Round6Level2 />
            </AuthenticatedLayout>
          } />

          {/* Level 3 Routes */}
          <Route path="/level3" element={
            <AuthenticatedLayout>
              <Level3Overview />
            </AuthenticatedLayout>
          } />
          <Route path="/level3/round1" element={
            <AuthenticatedLayout>
              <Round1Level3 />
            </AuthenticatedLayout>
          } />
          <Route path="/level3/round2" element={
            <AuthenticatedLayout>
              <Round2Level3 />
            </AuthenticatedLayout>
          } />
          <Route path="/level3/round3" element={
            <AuthenticatedLayout>
              <Round3Level3 />
            </AuthenticatedLayout>
          } />
          <Route path="/level3/round4" element={
            <AuthenticatedLayout>
              <Round4Level3 />
            </AuthenticatedLayout>
          } />
          <Route path="/level3/round5" element={
            <AuthenticatedLayout>
              <Round5Level3 />
            </AuthenticatedLayout>
          } />

          <Route path="/signin" element={
            <PublicLayout path="/signin">
              <SignIn />
            </PublicLayout>
          } />

          {/* Authenticated routes with sidebar/navigation */}
          <Route path="/home" element={
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          } />
          <Route path="/lessons" element={
            <AuthenticatedLayout>
              <Lessons />
            </AuthenticatedLayout>
          } />
          <Route path="/challenges" element={
            <AuthenticatedLayout>
              <Challenges />
            </AuthenticatedLayout>
          } />
          <Route path="/goals" element={
            <AuthenticatedLayout>
              <Goals />
            </AuthenticatedLayout>
          } />
          <Route path="/leaderboard" element={
            <AuthenticatedLayout>
              <Leaderboard />
            </AuthenticatedLayout>
          } />
          <Route path="/profile" element={
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          } />
          <Route path="/piggy-bank" element={
            <AuthenticatedLayout>
              <PiggyBank />
            </AuthenticatedLayout>
          } />
          <Route path="/daily-quests" element={
            <AuthenticatedLayout>
              <DailyQuests />
            </AuthenticatedLayout>
          } />
          <Route path="/expense-tracker" element={
            <AuthenticatedLayout>
              <ExpenseTracker />
            </AuthenticatedLayout>
          } />
          <Route path="/rewards" element={
            <AuthenticatedLayout>
              <Rewards />
            </AuthenticatedLayout>
          } />
          <Route path="/social" element={
            <AuthenticatedLayout>
              <Social />
            </AuthenticatedLayout>
          } />
          <Route path="/achievements" element={
            <AuthenticatedLayout>
              <Achievements />
            </AuthenticatedLayout>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;