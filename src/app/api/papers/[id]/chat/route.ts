import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const paperId = params.id;
    const { message } = await request.json();

    if (!paperId || !message) {
      return NextResponse.json({ error: 'Paper ID and message are required' }, { status: 400 });
    }

    const paper = await db.papers.findUnique(paperId);
    if (!paper || !paper.textContent) {
      return NextResponse.json({ error: 'Paper not found or content unavailable' }, { status: 404 });
    }

    // Using local Ollama with qwen3:8b

    const contentToSearch = paper.textContent.substring(0, 50000); 

    const prompt = `
      You are an AI Research Assistant. Answer the user's question about the following research paper.
      
      Important Rules:
      1. Every factual answer MUST provide a source/page/section evidence where available.
      2. If the answer cannot be determined from the text, reply with: "Not identified in the provided paper."
      3. Return a JSON object with two fields: 'answer' (your response) and 'evidence' (a direct quote or section reference supporting your answer).
      
      Paper Text:
      ${contentToSearch}
      
      User Question: ${message}
    `;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        options: {
          num_ctx: 32768
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned an error: ${ollamaResponse.statusText}`);
    }

    const result = await ollamaResponse.json();
    const responseText = result.response;
    
    // Parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    } else {
      return NextResponse.json({ answer: responseText, evidence: "Evidence formatting failed." });
    }

  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message.' }, { status: 500 });
  }
}
