import React from 'react';
import { useParams } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Game Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Game ID: {id}</p>
        {/* Add your game content here */}
      </div>
    </div>
  );
};

export default GamePage; 