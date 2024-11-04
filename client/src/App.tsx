import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResourcesPage from './pages/ResourcesPage'
import WorksheetPage from './pages/WorksheetPage'
import GamePage from './pages/GamePage'
import ActivityPage from './pages/ActivityPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/worksheet/:id" element={<WorksheetPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/activity/:id" element={<ActivityPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 