import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import DailyQuests from './pages/DailyQuests';
import ExpenseTracker from './pages/ExpenseTracker';
import Rewards from './pages/Rewards';
import Social from './pages/Social';
import Achievements from './pages/Achievements';

import './App.css';
import './styles/globals.css';
import SignIn from './pages/signIn';
import Level11 from './pages/Level1/round1';
import Level12 from './pages/Level1/round2';

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
const PublicLayout = ({ children, path }) => {
  return (
    <div className="App">
      <GameBackground />
      <div className="app-content">
        <main className="main-content public-layout">
          {children}
        </main>
        {/* Don't include Footer on Landing page as it has its own footer */}
        {path !== '/' && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public routes without sidebar/navigation */}
          <Route path="/" element={
            <PublicLayout path="/">
              <Landing />
            </PublicLayout>
          } />
          <Route path="/level11" element={
            <PublicLayout path="/level11">
              <Level11 />
            </PublicLayout>
          } />
          <Route path="/level12" element={
            <PublicLayout path="/level12">
              <Level12 />
            </PublicLayout>
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
          <Route path="/piggybank" element={
            <AuthenticatedLayout>
              <PiggyBank />
            </AuthenticatedLayout>
          } />
          <Route path="/daily-quests" element={
            <AuthenticatedLayout>
              <DailyQuests />
            </AuthenticatedLayout>
          } />
          <Route path="/expenses" element={
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