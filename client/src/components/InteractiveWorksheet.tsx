import React, { useState } from 'react';

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  points: number;
}

interface WorksheetContent {
  id: string;
  metadata: {
    title: string;
    description: string;
    grade: string;
    subject: string;
    topic: string;
  };
  questions: Question[];
}

interface InteractiveWorksheetProps {
  resource: WorksheetContent;
  showAnswers?: boolean;
  showHints?: boolean;
}

const InteractiveWorksheet: React.FC<InteractiveWorksheetProps> = ({ 
  resource, 
  showAnswers = false,
  showHints = false 
}) => {
  if (!resource || !resource.metadata) {
    return <div>Loading worksheet...</div>;
  }

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, { correct: boolean; message: string }>>({});
  const [currentHints, setCurrentHints] = useState<Record<number, number>>({});

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleHintClick = (questionId: number) => {
    setCurrentHints(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + 1
    }));
  };

  const handleSubmit = () => {
    // Implement answer checking logic here
    console.log('Submitted answers:', answers);
  };

  const renderAnswerInput = (question: Question) => {
    switch (question.type) {
      case 'number':
        return (
          <input
            type="number"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter number"
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={`${question.id}-${index}`} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                <input
                  type="radio"
                  name={`q${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'fill-blanks':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your answer"
          />
        );

      default:
        return null;
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-800">
              Question {index + 1}
              <span className="ml-2 text-sm text-gray-500">({question.points} points)</span>
            </h3>
            <p className="mt-2 text-gray-700">{question.question}</p>
          </div>
          {showHints && (
            <button
              onClick={() => handleHintClick(question.id)}
              className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              💡 Hint
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {renderAnswerInput(question)}
          
          {feedback[question.id] && (
            <div className={`mt-2 p-2 rounded-md ${
              feedback[question.id].correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {feedback[question.id].message}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {resource.metadata.title}
        </h2>
        <p className="text-gray-600 mb-4">{resource.metadata.description}</p>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {resource.metadata.subject}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {resource.metadata.grade}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {resource.metadata.topic}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {resource.questions.map((question, index) => renderQuestion(question, index))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};

export default InteractiveWorksheet;