import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilterData } from '../hooks/useFilterData'
import { Resource } from '../types/resource'
import ResourceCard from '../components/ResourceCard'

interface Filters {
  resource_type: string
  grade: string
  subject: string
  topic: string
}

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate()
  const { getFilteredCards, getFilteredOptions, ...filterData } = useFilterData()
  const [filters, setFilters] = useState<Filters>({
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
    navigate(`/worksheet/${card.id}`)
  }

  if (filterData.isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (filterData.error) {
    return <div className="text-center py-8 text-red-600">{filterData.error}</div>
  }

  const filteredCards = getFilteredCards(filters)

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Educational Resources</h1>
      <div className="flex gap-4">
        {/* Filter Section */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-4 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

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
                {filterData.resourceTypes?.map((type: string) => (
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
                {filterData.grades?.map((grade: string) => (
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
                {availableSubjects.map((subject: string) => (
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
                {availableTopics.map((topic: string) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map((card: Resource) => (
              <ResourceCard
                key={card.id}
                {...card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesPage