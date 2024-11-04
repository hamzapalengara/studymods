import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { Resource } from '../types/resource';

interface ResourceCardProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  if (!resource) {
    return null;
  }

  const badgeStyles = {
    resource_type: 'bg-blue-100 text-blue-800',
    grade: 'bg-purple-100 text-purple-800',
    subject: 'bg-green-100 text-green-800',
    topic: 'bg-orange-100 text-orange-800'
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(resource)}
    >
      {/* Image Section - Further reduced height */}
      <div className="relative h-32 bg-gray-200">
        {resource?.image_url ? (
          <img
            src={resource.image_url}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <DocumentIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section - More compact spacing */}
      <div className="p-2.5">
        {/* Reduced margin and font size for title */}
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {resource.title || 'Untitled Resource'}
        </h3>
        
        {/* Reduced line height and margin for description */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-snug">
          {resource.description || 'No description available'}
        </p>
        
        {/* Details Section - Tighter spacing */}
        <div className="flex flex-wrap gap-1 text-xs">
          {/* Resource Type Badge */}
          {resource.resource_type && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-medium ${badgeStyles.resource_type}`}>
              {resource.resource_type}
            </span>
          )}
          
          {/* Grade Badge */}
          {resource.grade && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-medium ${badgeStyles.grade}`}>
              Grade {resource.grade}
            </span>
          )}
          
          {/* Subject Badge */}
          {resource.subject && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-medium ${badgeStyles.subject}`}>
              {resource.subject}
            </span>
          )}
          
          {/* Topic Badge */}
          {resource.topic && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-medium ${badgeStyles.topic}`}>
              {resource.topic}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;