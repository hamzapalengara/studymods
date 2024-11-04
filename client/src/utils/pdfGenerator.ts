import { jsPDF } from 'jspdf';

export const generateWorksheetPDF = (content: any) => {
  const doc = new jsPDF();
  
  try {
    // Add header
    doc.setFontSize(20);
    doc.text(content.metadata.title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`${content.metadata.grade} | ${content.metadata.subject} | ${content.metadata.topic}`, 20, 30);
    
    // Add description
    doc.setFontSize(12);
    const description = doc.splitTextToSize(content.metadata.description, 170);
    doc.text(description, 20, 40);
    
    let yPosition = 60;

    // Add questions
    content.questions.forEach((question: any, index: number) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Question number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Question ${index + 1} (${question.points} points)`, 20, yPosition);
      yPosition += 10;
      
      // Question text
      doc.setFont('helvetica', 'normal');
      const questionText = doc.splitTextToSize(question.question, 170);
      doc.text(questionText, 20, yPosition);
      yPosition += 10 * (questionText.length || 1);
      
      // Add space for answer
      yPosition += 20;
    });

    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}; 