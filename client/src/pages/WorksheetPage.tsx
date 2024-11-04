import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, Download, Eye, Lightbulb } from 'lucide-react';
import { useFilterData } from '../hooks/useFilterData';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const WorksheetPage: React.FC = () => {
  const { id } = useParams();
  const { getResourceById } = useFilterData();
  const resource = getResourceById(id || '');
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      if (!resource?.resource_path) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(resource.resource_path);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        
        const blob = await response.blob();
        setPdfBlob(blob);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        console.error('Error loading PDF:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [resource?.resource_path]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {resource.resource_type}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {resource.subject}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Grade {resource.grade}
            </span>
          </div>
          <p className="text-gray-600 mb-6">{resource.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href={resource.resource_path}
              download
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Material
            </a>
            {resource.answers_path && (
              <button
                onClick={() => setShowAnswers(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Answers
              </button>
            )}
            {resource.tips_path && (
              <button
                onClick={() => setShowTips(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Solving Tips
              </button>
            )}
          </div>

          {/* PDF Preview */}
          <div className="w-full bg-gray-100 rounded-lg p-4">
            {loading ? (
              <div className="text-gray-600 text-center py-8">Loading PDF...</div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : pdfBlob ? (
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                error={
                  <div className="text-red-600 text-center py-8">
                    Failed to render PDF. Please try downloading instead.
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="mx-auto"
                />
                {numPages && (
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                      disabled={pageNumber <= 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                    >
                      Previous
                    </button>
                    <span className="py-2">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                      disabled={pageNumber >= numPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
                    >
                      Next
                    </button>
                  </div>
                )}
              </Document>
            ) : null}
          </div>
        </div>

        {/* Answers Dialog */}
        {showAnswers && (
          <dialog className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Answers</h2>
                <button onClick={() => setShowAnswers(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
              <Document
                file={resource.answers_path}
                error={<div className="text-red-600">Failed to load answers.</div>}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </dialog>
        )}

        {/* Tips Dialog */}
        {showTips && (
          <dialog className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Solving Tips</h2>
                <button onClick={() => setShowTips(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
              <Document
                file={resource.tips_path}
                error={<div className="text-red-600">Failed to load tips.</div>}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </dialog>
        )}
      </main>
    </div>
  );
};

export default WorksheetPage; 