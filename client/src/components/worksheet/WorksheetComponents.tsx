import React from 'react';
import Katex from 'katex';
import 'katex/dist/katex.min.css';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface QuestionProps {
  id: string;
  type: 'multiple-choice' | 'number' | 'text' | 'drag-drop';
  options?: string[];
  correctAnswer?: string | number;
  points?: number;
  onChange?: (value: any) => void;
}

export const WorksheetComponents = {
  // Rich Text Components
  h1: (props: any) => (
    <h1 className="text-2xl font-bold text-gray-800 mb-4" {...props} />
  ),
  
  h2: (props: any) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-3" {...props} />
  ),
  
  p: (props: any) => (
    <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
  ),

  // Image Component with optional caption
  Image: ({ src, alt, width, height }: ImageProps) => (
    <figure className="my-4">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg shadow-md"
      />
      {alt && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  // Math Formula Component
  Math: ({ formula }: { formula: string }) => {
    const html = Katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true
    });
    return (
      <div 
        className="my-4 flex justify-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },

  // Interactive Question Component
  Question: ({ id, type, options, points = 1, onChange }: QuestionProps) => {
    const [answer, setAnswer] = React.useState<string | number>('');
    const [feedback, setFeedback] = React.useState<string>('');

    const handleChange = (value: string | number) => {
      setAnswer(value);
      setFeedback('');
      onChange?.(value);
    };

    switch (type) {
      case 'multiple-choice':
        return (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <div className="mb-2 font-medium">
              Question {id} ({points} points)
            </div>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-2 rounded hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleChange(e.target.value)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {feedback && (
              <div className={`mt-2 p-2 rounded ${
                feedback === 'Correct!' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <div className="mb-2 font-medium">
              Question {id} ({points} points)
            </div>
            <input
              type="number"
              value={answer}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'text':
        return (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <div className="mb-2 font-medium">
              Question {id} ({points} points)
            </div>
            <textarea
              value={answer}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  },

  // Interactive Diagram Component
  Diagram: ({ src, interactive = false }: { src: string; interactive?: boolean }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
      if (interactive && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        // Add interactive drawing logic here
      }
    }, [interactive]);

    return (
      <div className="my-4">
        {interactive ? (
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border rounded-lg shadow-md"
          />
        ) : (
          <img
            src={src}
            alt="Diagram"
            className="rounded-lg shadow-md"
          />
        )}
      </div>
    );
  }
}; 