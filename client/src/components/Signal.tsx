import React from 'react';
import { cn } from '../lib/utils';

interface SignalProps {
  strength: 'weak' | 'medium' | 'strong';
  className?: string;
}

const Signal: React.FC<SignalProps> = ({ strength, className }) => {
  const strengthClasses = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <div className={cn('w-1 h-2 rounded-sm', strengthClasses[strength])} />
      <div className={cn('w-1 h-3 rounded-sm', strength !== 'weak' ? strengthClasses[strength] : 'bg-gray-200')} />
      <div className={cn('w-1 h-4 rounded-sm', strength === 'strong' ? strengthClasses[strength] : 'bg-gray-200')} />
    </div>
  );
};

export default Signal; 