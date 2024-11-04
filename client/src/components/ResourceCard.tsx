import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { Resource } from '../types/resource';

interface ResourceCardProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
  className?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick, className }) => {
  const cardClasses = className === 'related-card' 
    ? "bg-white rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer p-3"
    : "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-3";

  return (
    <div 
      className={cardClasses}
      onClick={() => onClick?.(resource)}
    >
      {/* Thumbnail */}
      <div className={`aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden 
        ${className === 'related-card' ? 'h-24' : ''}`}>
        <img 
          src={resource.image_url} 
          alt={resource.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3 className={`font-semibold line-clamp-2 
        ${className === 'related-card' ? 'text-sm mb-2' : 'text-base mb-2'}`}>
        {resource.title}
      </h3>

      {/* Description - Hide in related cards */}
      {className !== 'related-card' && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {resource.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {className === 'related-card' ? (
          <>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
              {resource.subject}
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              {resource.grade}
            </span>
          </>
        ) : (
          <>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
              {resource.resource_type}
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              {resource.grade}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
              {resource.subject}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;