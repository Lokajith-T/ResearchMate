import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import PDFParser from 'pdf2json';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file. Please upload a PDF.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text using pdf2json
    const textContent = await new Promise<string>((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve((pdfParser as any).getRawTextContent());
      });
      
      pdfParser.parseBuffer(buffer);
    });
    
    // Extract metadata (basic heuristics for MVP)
    const lines = textContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const title = lines[0] || 'Unknown Title';
    const authors = [lines[1]] || ['Unknown Authors'];
    
    // Save to mock database
    const paper = await db.papers.create({
      title,
      authors,
      year: new Date().getFullYear(),
      abstract: 'Abstract extraction pending...',
      textContent: textContent,
      metadata: null,
      analysis: null
    });

    return NextResponse.json({ 
      success: true, 
      paperId: paper.id,
      message: 'Paper uploaded and text extracted successfully.' 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to process PDF file. It may be corrupted or encrypted.' }, { status: 500 });
  }
}
