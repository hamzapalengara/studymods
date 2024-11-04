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
  
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [answersNumPages, setAnswersNumPages] = useState(1);
  const [answersPageNumber, setAnswersPageNumber] = useState(1);
  const [tipsNumPages, setTipsNumPages] = useState(1);
  const [tipsPageNumber, setTipsPageNumber] = useState(1);
  const [answersError, setAnswersError] = useState<string | null>(null);
  const [tipsError, setTipsError] = useState<string | null>(null);
  const [answersContent, setAnswersContent] = useState<string>('');
  const [tipsContent, setTipsContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'pdf' | 'interactive'>('interactive');
  const [worksheetContent, setWorksheetContent] = useState<any>(null);

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

  const onAnswersLoadSuccess = ({ numPages }: { numPages: number }) => {
    setAnswersNumPages(numPages);
  };

  const onAnswersLoadError = (error: Error) => {
    console.error('Answers Load Error:', error);
    setAnswersError('Failed to load answers. Please try again later.');
  };

  const onTipsLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTipsNumPages(numPages);
  };

  const onTipsLoadError = (error: Error) => {
    console.error('Tips Load Error:', error);
    setTipsError('Failed to load tips. Please try again later.');
  };

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('#')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('#', '')}</h3>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  const handleDownloadPDF = (content: string, title: string, filename: string) => {
    const doc = generatePDF(content);
    doc.save(filename);
  };

  const handleCardClick = (card: Resource) => {
    navigate(`/worksheet/${card.id}`);
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (!resource?.resource_path) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(resource.resource_path);
        if (!response.ok) throw new Error('Failed to fetch worksheet content');
        
        const data = await response.json();
        setWorksheetContent(data);
        
        // Generate PDF from JSON content
        const doc = generateWorksheetPDF(data);
        setPdfBlob(doc.output('blob'));
        
      } catch (err) {
        console.error('Error loading content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [resource?.resource_path]);

  const renderAnswersContent = (content: string | null) => {
    if (!content) return null;
    
    try {
      const answersData = JSON.parse(content);
      return (
        <div className="space-y-4">
          {answersData.answers.map((answer: any) => (
            <div key={answer.questionId} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2">Question {answer.questionId}</div>
              <div className="text-blue-600 font-medium">Answer: {answer.correctAnswer}</div>
              {answer.explanation && (
                <p className="mt-2 text-gray-600 text-sm">{answer.explanation}</p>
              )}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error parsing answers JSON:', error);
      return <div className="text-red-600">Error loading answers</div>;
    }
  };

  const renderTipsContent = (content: string | null) => {
    if (!content) return null;

    try {
      const tipsData = JSON.parse(content);
      return (
        <div className="space-y-4">
          {tipsData.hints.map((hint: any) => (
            <div key={hint.questionId} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2">Question {hint.questionId}</div>
              <ul className="list-disc list-inside space-y-2">
                {hint.hints.map((hintText: string, index: number) => (
                  <li key={index} className="text-gray-600 ml-4">{hintText}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error parsing tips JSON:', error);
      return <div className="text-red-600">Error loading tips</div>;
    }
  };

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-2">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Details */}
          <div className="lg:w-[420px] flex-shrink-0">
            {/* Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
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
              </div>

              {/* Action Buttons - pushed to bottom */}
              <div className="flex flex-col gap-3 mt-auto">
                <a
                  href={resource.resource_path}
                  download
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Material
                </a>

                {resource.answers_path && (
                  <button
                    onClick={handleAnswersClick}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Answers
                  </button>
                )}

                {resource.tips_path && (
                  <button
                    onClick={handleTipsClick}
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
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('interactive')}
                    className={`px-3 py-1 rounded-md ${
                      viewMode === 'interactive' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100'
                    }`}
                  >
                    Interactive
                  </button>
                  <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-3 py-1 rounded-md ${
                      viewMode === 'pdf' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100'
                    }`}
                  >
                    PDF
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : viewMode === 'interactive' && worksheetContent ? (
                <InteractiveWorksheet 
                  resource={worksheetContent}
                  showAnswers={showAnswers}
                  showHints={showTips}
                />
              ) : viewMode === 'pdf' && pdfBlob ? (
                <div style={{ height: '800px' }}>
                  <Document
                    file={pdfBlob}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => {
                      console.error('Error loading PDF:', error);
                      setError('Failed to load PDF preview');
                    }}
                  >
                    <Page 
                      pageNumber={pageNumber}
                      width={Math.min(800, window.innerWidth - 48)}
                    />
                  </Document>
                </div>
              ) : (
                <div className="text-center py-8">No content available</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Related Resources Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Related Resources</h2>
            <p className="text-gray-600 mt-1 text-sm">Similar worksheets you might find helpful</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rawData
              .filter(item => 
                item.id !== resource.id && 
                (item.subject === resource.subject || 
                 item.topic === resource.topic ||
                 item.grade === resource.grade)
              )
              .slice(0, 4)
              .map(relatedResource => (
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

      {/* Answers Modal */}
      {showAnswers && (
        <Modal
          isOpen={showAnswers}
          onClose={() => setShowAnswers(false)}
          title="Answer Key"
          icon={<Eye className="h-5 w-5" />}
        >
          <div className="mt-4">
            {answersError ? (
              <div className="text-red-600">{answersError}</div>
            ) : (
              renderAnswersContent(answersContent)
            )}
          </div>
        </Modal>
      )}

      {/* Tips Modal */}
      {showTips && (
        <Modal
          isOpen={showTips}
          onClose={() => setShowTips(false)}
          title="Solving Tips"
          icon={<Lightbulb className="h-5 w-5" />}
        >
          <div className="mt-4">
            {tipsError ? (
              <div className="text-red-600">{tipsError}</div>
            ) : (
              renderTipsContent(tipsContent)
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WorksheetPage; 