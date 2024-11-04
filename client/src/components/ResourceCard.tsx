import React from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import type { Resource } from '../types/resource';

interface ResourceCardProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-3"
      onClick={() => onClick(resource)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
        <img 
          src={resource.image_url} 
          alt={resource.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold mb-1 line-clamp-2">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {resource.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 text-xs">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
          {resource.resource_type}
        </span>
        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
          {resource.grade}
        </span>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
          {resource.subject}
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;