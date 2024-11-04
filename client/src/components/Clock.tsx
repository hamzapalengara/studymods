import React, { useState, useEffect } from 'react'
import { formatTime } from '../lib/utils'

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-gray-600">
      {formatTime(time)}
    </div>
  )
}

export default Clock 