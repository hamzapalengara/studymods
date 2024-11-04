import React from 'react'
import { cn } from '../../lib/utils'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  className
}) => {
  return (
    <div className={cn('mb-6', className)}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default FilterSection 