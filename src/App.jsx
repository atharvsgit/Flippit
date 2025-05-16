import React from 'react'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import FlippitGame from './components/FlippitGame';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game" element={<FlippitGame />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App