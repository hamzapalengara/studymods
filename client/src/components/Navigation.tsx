import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react' // Import icons

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              EduModes
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
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

            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-4">
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-2">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 text-gray-600 hover:text-blue-600 border border-transparent hover:border-gray-200 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
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