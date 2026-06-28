import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import ExploreAds from './pages/ExploreAds'
import SetupDashboard from './pages/SetupDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ModeratorDashboard from './pages/ModeratorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Packages from './pages/Packages'
import Health from './pages/Health'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/explore' element={<ExploreAds />} />
        <Route path='/packages' element={<Packages />} />
        <Route path='/setup' element={<SetupDashboard />} />
        <Route path='/client' element={<ClientDashboard />} />
        <Route path='/moderator' element={<ModeratorDashboard />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/health' element={<Health />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  )
}

export default App


