import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Goals from './pages/Goals';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';
import './styles/globals.css';
import Level11 from './pages/Level1/round1';


function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <div className="app-content">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/level11" element={<Level11 />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                
              </Routes>
            </main>
          </div>
          <Navigation />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
