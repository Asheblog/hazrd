import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import HazardManagement from './components/HazardManagement'
import PersonnelManagement from './components/PersonnelManagement'
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const savedLoginState = loadFromLocalStorage('loginState')
    if (savedLoginState) {
      setIsLoggedIn(savedLoginState.isLoggedIn)
      setUserRole(savedLoginState.userRole)
    }
  }, [])

  const handleLogin = (role: string) => {
    setIsLoggedIn(true)
    setUserRole(role)
    saveToLocalStorage('loginState', { isLoggedIn: true, userRole: role })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole('')
    saveToLocalStorage('loginState', { isLoggedIn: false, userRole: '' })
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard userRole={userRole} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/user-management"
            element={
              isLoggedIn && userRole === 'admin' ? (
                <UserManagement />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/hazard-management"
            element={
              isLoggedIn ? (
                <HazardManagement />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/personnel-management"
            element={
              isLoggedIn && userRole === 'admin' ? (
                <PersonnelManagement />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App