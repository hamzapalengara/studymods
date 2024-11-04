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

  const filteredCards = getFilteredCards(filters)

  if (filterData.isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (filterData.error) {
    return <div className="text-center py-8 text-red-600">{filterData.error}</div>
  }

  return (
    <div>
      {/* Hero Section with centered content */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Educational Resources for Every Classroom
            </h1>
            <p className="text-lg mb-6">
              Discover worksheets, games, and activities to enhance your teaching and learning experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate('/worksheets')}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Browse Worksheets
              </Button>
              <Button
                onClick={() => navigate('/resources')}
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                View All Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4">
          {/* Filter Section */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-4 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Search Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search resources..."
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Resource Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type
                </label>
                <select
                  value={filters.resource_type}
                  onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Types</option>
                  {filterData.resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={filters.grade}
                  onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Grades</option>
                  {filterData.grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Subjects</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={filters.topic}
                  onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Topics</option>
                  {availableTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search and Clear Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Search
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Resource Cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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