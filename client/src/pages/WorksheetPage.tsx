import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ArrowLeft, Download, Eye, Lightbulb, Copy, Check, ArrowRight } from 'lucide-react';
import { useFilterData } from '../hooks/useFilterData';
import { PDFViewer } from '../components/PDFViewer';
import Modal from '../components/Modal';
import { jsPDF } from 'jspdf';
import { Resource } from '../types/resource';
import ResourceCard from '../components/ResourceCard';
import InteractiveWorksheet from '../components/InteractiveWorksheet';
import { generateWorksheetPDF } from '../utils/pdfGenerator';

// Set worker path correctly
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const WorksheetPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResourceById, rawData } = useFilterData();
  const resource = getResourceById(id || '');

  const [viewMode, setViewMode] = useState<'interactive' | 'pdf'>('interactive');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [answersContent, setAnswersContent] = useState('');
  const [tipsContent, setTipsContent] = useState('');
  const [answersError, setAnswersError] = useState<string | null>(null);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

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

  const fetchTextContent = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
    return response.text();
  };

  const handleAnswersClick = async () => {
    try {
      if (!resource?.answers_path) return;
      setAnswersError(null);
      const content = await fetchTextContent(resource.answers_path);
      setAnswersContent(content);
      setShowAnswers(true);
    } catch (error) {
      console.error('Answers Load Error:', error);
      setAnswersError('Failed to load answers. Please try again later.');
    }
  };

  const handleTipsClick = async () => {
    try {
      if (!resource?.tips_path) return;
      setTipsError(null);
      const content = await fetchTextContent(resource.tips_path);
      setTipsContent(content);
      setShowTips(true);
    } catch (error) {
      console.error('Tips Load Error:', error);
      setTipsError('Failed to load tips. Please try again later.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleCardClick = (card: Resource) => {
    navigate(`/worksheet/${card.id}`);
  };

  const getRelatedResources = () => {
    if (!resource || !rawData) return [];
    
    return rawData
      .filter(item => 
        item.id !== resource.id && 
        (item.subject === resource.subject || 
         item.topic === resource.topic ||
         item.grade === resource.grade)
      )
      .slice(0, 4);
  };

  const handleDownload = async () => {
    if (!resource?.resource_path) return;
    
    try {
      const response = await fetch(resource.resource_path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!resource) {
    return <div>Resource not found</div>;
  }

  const relatedResources = getRelatedResources();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-2">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-6">
          {/* Top Section with Details and Preview */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side Container */}
            <div className="lg:w-[420px] flex-shrink-0">
              {/* Details Card */}
              <div className="bg-white p-6 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">{resource.title}</h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {resource.resource_type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {resource.subject}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {resource.grade}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-600 mb-2">Description</h2>
                    <p className="text-gray-600 text-sm">{resource.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Material
                    </button>
                    <button
                      onClick={handleAnswersClick}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Answers
                    </button>
                    <button
                      onClick={handleTipsClick}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Solving Tips
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Preview Section */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('interactive')}
                      className={`px-4 py-2 rounded-md ${
                        viewMode === 'interactive' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      Interactive
                    </button>
                    <button
                      onClick={() => setViewMode('pdf')}
                      className={`px-4 py-2 rounded-md ${
                        viewMode === 'pdf' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      PDF
                    </button>
                  </div>
                </div>

                {viewMode === 'pdf' ? (
                  <div className="flex justify-center">
                    {loading ? (
                      <div>Loading PDF...</div>
                    ) : error ? (
                      <div className="text-red-600">{error}</div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          <Document
                            file={pdfBlob}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <Page 
                              pageNumber={pageNumber}
                              width={Math.min(800, window.innerWidth - 48)}
                            />
                          </Document>
                        </div>
                        <div className="flex justify-center gap-4 mt-4 sticky bottom-0 bg-white py-2">
                          <button
                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                            disabled={pageNumber <= 1}
                            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <span className="flex items-center">
                            Page {pageNumber} of {numPages}
                          </span>
                          <button
                            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                            disabled={pageNumber >= numPages}
                            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    {/* Interactive content here */}
                    <div>Interactive View Content</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Resources Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Related Resources</h2>
                <p className="text-gray-600 mt-1 text-sm">Similar worksheets you might find helpful</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedResources.map(relatedResource => (
                  <ResourceCard
                    key={relatedResource.id}
                    resource={relatedResource}
                    onClick={handleCardClick}
                    className="related-card"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showAnswers}
        onClose={() => setShowAnswers(false)}
        title="Answer Key"
      >
        <div className="prose max-w-none">
          {answersError ? (
            <div className="text-red-600">{answersError}</div>
          ) : (
            <div className="whitespace-pre-wrap">{answersContent}</div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showTips}
        onClose={() => setShowTips(false)}
        title="Solving Tips"
      >
        <div className="prose max-w-none">
          {tipsError ? (
            <div className="text-red-600">{tipsError}</div>
          ) : (
            <div className="whitespace-pre-wrap">{tipsContent}</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default WorksheetPage; 