import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';
import './styles/globals.css';


function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;