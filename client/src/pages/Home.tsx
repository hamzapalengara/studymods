import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Resource } from '../types/resource'
import { useFilterData } from '../hooks/useFilterData'
import ResourceCard from '../components/ResourceCard'
import { Button } from '../components/ui/button'

interface Filters {
  search: string
  resource_type: string
  grade: string
  subject: string
  topic: string
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { getFilteredCards, getFilteredOptions, ...filterData } = useFilterData()
  const [filters, setFilters] = useState<Filters>({
    search: '',
    resource_type: '',
    grade: '',
    subject: '',
    topic: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const availableSubjects = getFilteredOptions('subject', {
    resource_type: filters.resource_type,
    grade: filters.grade
  })

  const availableTopics = getFilteredOptions('topic', {
    resource_type: filters.resource_type,
    grade: filters.grade,
    subject: filters.subject
  })

  const handleCardClick = (card: Resource) => {
    switch (card.resource_type.toLowerCase()) {
      case 'worksheet':
        navigate(`/worksheet/${card.id}`);
        break;
      case 'game':
        navigate(`/game/${card.id}`);
        break;
      case 'activity':
        navigate(`/activity/${card.id}`);
        break;
      default:
        navigate(`/resources/${card.id}`);
    }
  };

  const handleClear = () => {
    setFilters({
      search: '',
      resource_type: '',
      grade: '',
      subject: '',
      topic: ''
    })
  }

  const handleSearch = () => {
    const searchResults = getFilteredCards(filters)
    
    if (searchResults.length === 0) {
      console.log('No results found')
    } else {
      console.log(`Found ${searchResults.length} results`)
    }
  }

  const handleViewWorksheets = () => {
    setFilters(prev => ({
      ...prev,
      resource_type: 'Worksheet'  // Set filter to show only worksheets
    }));
  };

  const handleViewAllResources = () => {
    // Scroll to the resources section
    const resourcesSection = document.querySelector('.resources-section');
    if (resourcesSection) {
      resourcesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredCards = getFilteredCards(filters)

  if (filterData.isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (filterData.error) {
    return <div className="text-center py-8 text-red-600">{filterData.error}</div>
  }

  return (
    <div>
      {/* Hero Section - Made responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Educational Resources for Every Classroom
            </h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
              Discover worksheets, games, and activities to enhance your teaching and learning experience.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={handleViewWorksheets}
                className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50"
              >
                View Worksheets
              </button>
              <button
                onClick={handleViewAllResources}
                className="border border-white text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                View All Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with filters and cards */}
      <div className="container mx-auto px-4 py-8 resources-section">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Column */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              {/* Filter Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Search & Filter</h2>
                <div className="w-16 h-1 bg-blue-600 rounded"></div>
              </div>

              {/* Filter Controls */}
              <div className="space-y-4">
                {/* Search Input First */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search resources..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Other Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={filters.resource_type}
                    onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {filterData.resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    value={filters.grade}
                    onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Grades</option>
                    {filterData.grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <select
                    value={filters.topic}
                    onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Topics</option>
                    {availableTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Filter Action Buttons */}
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={handleSearch}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={handleClear}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid remains the same */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCards.map((card) => (
                <ResourceCard
                  key={card.id}
                  resource={card}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 