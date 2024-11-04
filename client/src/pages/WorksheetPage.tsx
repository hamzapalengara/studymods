import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ArrowLeft, Download, Eye, Lightbulb } from 'lucide-react';
import { useFilterData } from '../hooks/useFilterData';
import { PDFViewer } from '../components/PDFViewer';

// Set worker path correctly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const WorksheetPage: React.FC = () => {
  const { id } = useParams();
  const { getResourceById } = useFilterData();
  const resource = getResourceById(id || '');
  
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Load Error:', error);
    setPdfError('Failed to load PDF file. Please try downloading instead.');
  };

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Left Sidebar - Details and Actions */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Title */}
              <h1 className="text-2xl font-bold mb-4">{resource.title}</h1>
              
              {/* Resource Tags */}
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

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Description</h2>
                <p className="text-gray-600">{resource.description}</p>
              </div>

              {/* Action Buttons - Stacked vertically */}
              <div className="space-y-3">
                <a
                  href={resource.resource_path}
                  download
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Material
                </a>

                {resource.answers_path && (
                  <button
                    onClick={() => setShowAnswers(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Answers
                  </button>
                )}

                {resource.tips_path && (
                  <button
                    onClick={() => setShowTips(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Solving Tips
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <Document
                file={resource.resource_path}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error('PDF Load Error:', error);
                  setPdfError('Failed to load PDF preview');
                }}
                loading={<div>Loading PDF...</div>}
              >
                <Page 
                  pageNumber={pageNumber}
                  width={Math.min(window.innerWidth * 0.5, 600)}
                  loading={<div>Loading page...</div>}
                />
              </Document>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorksheetPage; 