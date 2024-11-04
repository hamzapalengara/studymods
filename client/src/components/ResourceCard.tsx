import React, { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { Resource } from '../types/resource';

interface ResourceCardProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
  className?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick, className }) => {
  const cardClasses = className === 'related-card' 
    ? "bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 flex flex-col w-full"
    : "bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 flex flex-col w-full";

  return (
    <div 
      className={cardClasses}
      onClick={() => onClick?.(resource)}
    >
      {/* Thumbnail - Reduced height */}
      <div className="aspect-[16/9] max-h-[120px] w-full rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={resource.image_url} 
          alt={resource.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base mt-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-2">
          {resource.description || 'No description available'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-auto">
          {resource.resource_type && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
              {resource.resource_type}
            </span>
          )}
          {resource.subject && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
              {resource.subject}
            </span>
          )}
          {resource.grade && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
              {resource.grade}
            </span>
          )}
          {resource.topic && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
              {resource.topic}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;