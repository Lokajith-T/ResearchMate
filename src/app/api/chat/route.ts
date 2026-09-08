import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch all papers from the library to build the context
    const allPapers = await db.papers.findMany();
    
    // Instead of raw text which would easily timeout the prompt,
    // we use the pre-extracted analysis to provide a summarized context of the entire library.
    const libraryContext = allPapers.map(paper => {
      const p = paper.analysis?.problem?.summary || '';
      const o = paper.analysis?.objective?.summary || '';
      const m = paper.analysis?.methodology?.summary || '';
      const r = paper.analysis?.results?.summary || '';
      return `Paper Title: ${paper.title}\nYear: ${paper.year}\nSummary of Problem: ${p}\nSummary of Objective: ${o}\nSummary of Methodology: ${m}\nSummary of Results: ${r}`;
    }).join('\n\n---\n\n');

    // Build the prompt
    const prompt = `
      You are an expert AI Research Assistant. Your job is to answer the user's questions based strictly on the context of the research papers in their library.
      
      Library Context:
      ${libraryContext}
      
      User Question: ${message}
      
      If the answer is not in the library context, simply state that you cannot find the answer in the provided papers. Do not make up information.
      Be helpful, concise, and format your response beautifully using Markdown.
    `;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: {
          num_ctx: 16384,
          num_predict: 1024
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned an error: ${ollamaResponse.statusText}`);
    }

    const result = await ollamaResponse.json();
    return NextResponse.json({ success: true, reply: result.response });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response. ' + (error.message || '') }, { status: 500 });
  }
}
