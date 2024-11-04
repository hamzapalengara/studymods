declare module 'react-pdf' {
  import { ComponentType, ReactElement } from 'react';

  interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getTextContent: () => Promise<PDFTextContent>;
  }

  interface PDFTextContent {
    items: Array<{
      str: string;
    }>;
  }

  export interface DocumentProps {
    file: string | { url: string } | ArrayBuffer | Uint8Array;
    onLoadSuccess?: (pdf: PDFDocumentProxy) => void;
    loading?: ReactElement | string;
    error?: ReactElement | string;
    noData?: ReactElement | string;
    children?: ReactElement | ReactElement[];
  }

  export interface PageProps {
    pageNumber: number;
    width?: number;
    scale?: number;
    rotate?: number;
    loading?: ReactElement | string;
    error?: ReactElement | string;
    noData?: ReactElement | string;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    className?: string;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  
  interface PDFjs {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    getDocument: (source: string | { url: string }) => {
      promise: Promise<PDFDocumentProxy>;
    };
    version: string;
  }
  
  export const pdfjs: PDFjs;
} 