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

    const matrixText = matrix.map(m => `Title: ${m.title}\nMethodology: ${m.methodology}\nResults: ${m.results}\nLimitations: ${m.limitations}`).join('\n\n---\n\n');

    const prompt = `
      You are an expert academic evaluator. Review the following summaries of research papers and decide which paper is the "best" overall.
      Evaluate them based on: Methodological robustness, Significance of results, and Clarity of limitations.
      
      Provide a highly detailed, persuasive verdict (2-3 paragraphs). 
      Format your response beautifully using markdown (bolding, bullet points).
      Clearly declare a winner at the beginning.
      
      Papers to evaluate:
      ${matrixText}
    `;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: { num_predict: 1024 }
      }),
    });

    let bestPaperVerdict = "Verdict could not be generated.";
    if (ollamaResponse.ok) {
      const result = await ollamaResponse.json();
      bestPaperVerdict = result.response;
    }

    return NextResponse.json({ success: true, comparisonMatrix: matrix, bestPaperVerdict });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate comparison' }, { status: 500 });
  }
}
