import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  path: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/worksheets', label: 'Worksheets' },
  { path: '/games', label: 'Games' },
  { path: '/activities', label: 'Activities' },
  { path: '/resources', label: 'Resources' }
]

const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              EduModes
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium tracking-wide
                  ${location.pathname === path ? 'text-blue-600' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium tracking-wide"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium tracking-wide transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 