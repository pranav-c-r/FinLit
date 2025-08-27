import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Navigation from './components/layout/Navigation';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';
import './styles/globals.css';
import SignIn from './pages/signIn';

// Create a layout component for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="App">
      <Sidebar />
      <div className="app-content">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Navigation />
    </div>
  );
};

// Create a layout for public routes (no sidebar/navigation)
const PublicLayout = ({ children }) => {
  return (
    <div className="App">
      <main className="main-content public-layout">
        {children}
      </main>
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
            <PublicLayout>
              <Landing />
            </PublicLayout>
          } />
          <Route path="/signin" element={
            <PublicLayout>
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
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;