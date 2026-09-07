import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  context: any
) {
  try {
    // Await params object before accessing properties
    const params = await context.params;
    const paperId = params.id;
    
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }

    const paper = await db.papers.findUnique(paperId);
    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    if (!paper.textContent) {
      return NextResponse.json({ error: 'Paper content not available for analysis' }, { status: 400 });
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a mock analysis if no API key is present for local development
      const mockAnalysis = {
        problem: "Text from paper could not be analyzed. (Missing GEMINI_API_KEY)",
        methodology: "Mock methodology.",
        limitations: "Mock limitations.",
        futureWork: "Mock future work."
      };
      
      const updated = await db.papers.update(paperId, { analysis: mockAnalysis });
      return NextResponse.json({ success: true, analysis: updated.analysis });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Truncate text if it's too long, though Gemini 1.5 has a huge context window
    const contentToAnalyze = paper.textContent.substring(0, 50000); 

    const prompt = `
      Analyze the following research paper and extract the structured information.
      For each piece of information, provide a short summary AND an exact quote or page/section reference as "evidence".
      Return the output as a clean JSON object with the following keys:
      - problem: { summary: string, evidence: string }
      - objective: { summary: string, evidence: string }
      - methodology: { summary: string, evidence: string }
      - dataset: { summary: string, evidence: string }
      - results: { summary: string, evidence: string }
      - limitations: { summary: string, evidence: string }
      - futureWork: { summary: string, evidence: string }
      
      If a section is not found in the paper, set summary to "Not identified in the provided paper."
      
      Paper Text:
      ${contentToAnalyze}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let parsedAnalysis = {};
    if (jsonMatch) {
      parsedAnalysis = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse JSON from AI response");
    }

    const updated = await db.papers.update(paperId, { analysis: parsedAnalysis });

    return NextResponse.json({ success: true, analysis: updated.analysis });
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze paper.' }, { status: 500 });
  }
}
