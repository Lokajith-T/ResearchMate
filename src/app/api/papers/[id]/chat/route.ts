import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        answer: "This is a mock answer because GEMINI_API_KEY is not set.",
        evidence: "Mock evidence snippet."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
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
