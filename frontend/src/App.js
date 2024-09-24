import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import Footer from './components/Footer';
import Login from './components/Login';
import Header from './components/Header.js';
import MainContent from './components/MainContent.js';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header onLogout={handleLogout} />

        <div className="App-content">
          <ReactModal isOpen={showLogin} onRequestClose={() => setShowLogin(false)}>
            <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
          </ReactModal>

          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/home" element={isAuthenticated ? <MainContent /> : <Navigate to="/login" />} />
            {/* Otras rutas existentes */}
            {/* Otras rutas existentes */}
          </Routes>
        </div>

        <Footer onLogout={handleLogout} />
      </BrowserRouter>
    </div>
  );
}

export default App;
