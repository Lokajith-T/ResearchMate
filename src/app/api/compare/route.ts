import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { paperIds } = await request.json();
    
    if (!paperIds || !Array.isArray(paperIds) || paperIds.length < 2) {
      return NextResponse.json({ error: 'Please select at least 2 papers to compare' }, { status: 400 });
    }

    const allPapers = await db.papers.findMany();
    const selectedPapers = allPapers.filter(p => paperIds.includes(p.id));

    // For a real app, this might use LLM to synthesize a comparison. 
    // For MVP, we aggregate the pre-calculated analysis fields into a matrix format.
    
    const matrix = selectedPapers.map(paper => ({
      id: paper.id,
      title: paper.title,
      year: paper.year,
      methodology: paper.analysis?.methodology?.summary || 'Not analyzed yet',
      problem: paper.analysis?.problem?.summary || 'Not analyzed yet',
      limitations: paper.analysis?.limitations?.summary || 'Not analyzed yet',
      results: paper.analysis?.results?.summary || 'Not analyzed yet'
    }));

    return NextResponse.json({ success: true, comparisonMatrix: matrix });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate comparison' }, { status: 500 });
  }
}
