import { useState, useEffect } from 'react';
import { Resource } from '../types/resource';
import Papa from 'papaparse';

interface FilterOptions {
  resource_type?: string;
  grade?: string;
  subject?: string;
  search?: string;
  topic?: string;
  sub_topic?: string;
}

export const useFilterData = () => {
  const [rawData, setRawData] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/filters.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Convert CSV data to Resource type and add IDs
            const resources = results.data.map((row: any, index: number) => ({
              id: (index + 1).toString(), // Generate sequential IDs
              title: row.title,
              description: row.description,
              grade: row.grade,
              subject: row.subject,
              topic: row.topic,
              duration: row.duration,
              difficulty: row.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
              resource_type: row.resource_type,
              resource_path: row.resource_path,
              answers_path: row.answers_path,
              tips_path: row.tips_path,
              image_url: row.image_url
            }))
            
            setRawData(resources)
            setError(null)
          },
          error: (error: Error) => {
            setError(`Error parsing CSV: ${error.message}`)
          }
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Derived states
  const resourceTypes = [...new Set(rawData.map(item => item.resource_type))]
  const grades = [...new Set(rawData.map(item => item.grade))]

  const getFilteredOptions = (field: keyof Resource, filters: FilterOptions): string[] => {
    return [...new Set(
      rawData
        .filter(item => 
          (!filters.resource_type || item.resource_type === filters.resource_type) &&
          (!filters.grade || item.grade === filters.grade) &&
          (!filters.subject || item.subject === filters.subject)
        )
        .map(item => item[field] as string)
    )]
  }

  const getFilteredCards = (filters: FilterOptions): Resource[] => {
    return rawData.filter((card) => {
      // If search term exists
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase().trim();
        
        // Create an array of all searchable content from the card
        const searchableFields = [
          card.resource_type,
          card.grade,
          card.subject,
          card.topic,
          card.title,
          card.description
        ].map(field => (field || '').toLowerCase());

        // Debug what we're searching through
        console.log('Searching:', {
          term: searchTerm,
          fields: {
            resource_type: card.resource_type,
            grade: card.grade,
            subject: card.subject,
            topic: card.topic,
            title: card.title,
            description: card.description
          }
        });

        // Check if any field contains the search term (partial match)
        const matchFound = searchableFields.some(field => 
          field.includes(searchTerm)
        );

        if (!matchFound) {
          return false;
        }
      }

      // Check other filters if they exist
      if (filters.resource_type && card.resource_type !== filters.resource_type) return false;
      if (filters.grade && card.grade !== filters.grade) return false;
      if (filters.subject && card.subject !== filters.subject) return false;
      if (filters.topic && card.topic !== filters.topic) return false;
      if (filters.sub_topic && card.title !== filters.sub_topic) return false;

      return true;
    });
  }

  const getResourceById = (id: string): Resource | null => {
    return rawData.find(resource => resource.id === id) || null
  }

  return {
    rawData,
    isLoading,
    error,
    resourceTypes,
    grades,
    getFilteredOptions,
    getFilteredCards,
    getResourceById
  }
} 