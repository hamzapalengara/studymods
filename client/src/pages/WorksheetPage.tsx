import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ArrowLeft, Download, Eye, Lightbulb, Copy, Check } from 'lucide-react';
import { useFilterData } from '../hooks/useFilterData';
import { PDFViewer } from '../components/PDFViewer';
import Modal from '../components/Modal';
import { jsPDF } from 'jspdf';
import { Resource } from '../types/resource';
import ResourceCard from '../components/ResourceCard';

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

  const generatePDF = (content: string, title: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    
    // Add content
    doc.setFontSize(12);
    const lines = content.split('\n');
    let y = 30;
    
    lines.forEach(line => {
      if (line.trim().startsWith('#')) {
        // Section header
        doc.setFont('helvetica', 'bold');
        doc.text(line.replace('#', '').trim(), 20, y);
        y += 10;
      } else {
        // Normal text
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(line, 170);
        splitText.forEach((textLine: string) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(textLine, 20, y);
          y += 7;
        });
      }
    });

    return doc;
  };

  const handleDownloadPDF = (content: string, title: string, filename: string) => {
    const doc = generatePDF(content, title);
    doc.save(filename);
  };

  const handleCardClick = (card: Resource) => {
    navigate(`/worksheet/${card.id}`);
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
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side Container - Further increased width */}
          <div className="lg:w-[420px] flex-shrink-0"> {/* Changed from 380px to 420px */}
            {/* Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
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
              <div className="flex flex-col gap-3">
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

            {/* Related Section */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Related Worksheets</h2>
              <div className="grid grid-cols-2 gap-4 px-1"> {/* Added px-1 for slight edge padding */}
                {rawData
                  .filter(item => 
                    item.id !== resource.id && 
                    (item.subject === resource.subject || 
                     item.topic === resource.topic ||
                     item.grade === resource.grade)
                  )
                  .slice(0, 4)
                  .map(relatedResource => (
                    <div key={relatedResource.id} className="transform transition-transform hover:scale-105">
                      <ResourceCard
                        resource={relatedResource}
                        onClick={handleCardClick}
                        className="related-card"
                      />
                    </div>
                  ))}
              </div>
              <div className="mt-5 text-center">
                <button 
                  onClick={() => navigate('/resources')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View More Worksheets →
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section - Takes remaining width */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Preview</h2>
              <div className="bg-gray-50 rounded-lg min-h-[300px] sm:min-h-[600px] flex items-center justify-center">
                <Document
                  file={resource.resource_path}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={onDocumentLoadError}
                  loading={<div>Loading PDF...</div>}
                  className="max-w-full"
                >
                  <Page 
                    pageNumber={pageNumber} 
                    width={Math.min(
                      window.innerWidth > 1024 
                        ? window.innerWidth * 0.5 
                        : window.innerWidth * 0.85,
                      800
                    )}
                    loading={<div>Loading page...</div>}
                  />
                </Document>
              </div>
              
              {/* Page Navigation */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
                <button
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="px-2 sm:px-3 py-1 border rounded-md disabled:opacity-50 text-sm sm:text-base"
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="px-2 sm:px-3 py-1 border rounded-md disabled:opacity-50 text-sm sm:text-base"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Answers Modal */}
      <Modal
        isOpen={showAnswers}
        onClose={() => setShowAnswers(false)}
        title="Answer Key"
        icon={<Eye className="h-5 w-5" />}
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleCopy(answersContent)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </button>
            <button
              onClick={() => handleDownloadPDF(answersContent, 'Answer Key', 'answers.pdf')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        }
      >
        <div className="prose max-w-none">
          {answersError ? (
            <div className="text-red-600 text-center py-4">{answersError}</div>
          ) : (
            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleCopy(answersContent)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 font-mono text-gray-800">
                {formatContent(answersContent)}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Tips Modal */}
      <Modal
        isOpen={showTips}
        onClose={() => setShowTips(false)}
        title="Solving Tips"
        icon={<Lightbulb className="h-5 w-5" />}
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleCopy(tipsContent)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </button>
            <button
              onClick={() => handleDownloadPDF(tipsContent, 'Solving Tips', 'tips.pdf')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        }
      >
        <div className="prose max-w-none">
          {tipsError ? (
            <div className="text-red-600 text-center py-4">{tipsError}</div>
          ) : (
            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleCopy(tipsContent)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  {formatContent(tipsContent)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default WorksheetPage; 