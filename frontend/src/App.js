import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Dashboard from './pages/Dashboard';
import './App.css'; // Add basic styling here

function App() {
  return (
    <Router>
      <div className="App" style={styles.container}>
        <Navbar />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', color: '#333' },
  content: { padding: '20px', maxWidth: '1000px', margin: '0 auto' }
};

export default App;