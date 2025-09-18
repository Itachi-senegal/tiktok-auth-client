import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
            {/* Route par défaut - redirige vers login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Routes d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Page d'accueil protégée */}
            <Route path="/home" element={<Home />} />

            {/* Route 404 - redirige vers login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
