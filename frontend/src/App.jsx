import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DigitalTwin from './pages/DigitalTwin'
import Predict from './pages/Predict'
import Chatbot from './pages/Chatbot'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import useAuthStore from './store/authStore'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* DIGITAL TWIN V2 HERO REPLACES DASHBOARD */}
          <Route index element={<DigitalTwin />} />
          <Route path="predict" element={<Predict />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
