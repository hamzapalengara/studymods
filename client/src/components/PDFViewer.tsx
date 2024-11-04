import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

interface PDFViewerProps {
  pdfPath: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Load Error:', error);
    setError('Failed to load PDF preview');
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-gray-600">Please try downloading the file instead.</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentLoadSuccess}
        error={<div className="text-center py-8">Failed to load PDF</div>}
        loading={<div className="text-center py-8">Loading PDF...</div>}
      >
        <Page
          pageNumber={pageNumber}
          width={Math.min(window.innerWidth * 0.5, 600)}
          loading={<div className="text-center">Loading page...</div>}
        />
      </Document>
      
      {numPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}; 