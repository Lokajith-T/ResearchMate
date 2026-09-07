import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { paperIds } = await request.json();
    
    if (!paperIds || !Array.isArray(paperIds) || paperIds.length < 2) {
      return NextResponse.json({ error: 'Please select at least 2 papers for gap analysis' }, { status: 400 });
    }

    const allPapers = await db.papers.findMany();
    const selectedPapers = allPapers.filter(p => paperIds.includes(p.id));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return mock gaps for MVP
      return NextResponse.json({ 
        success: true, 
        gaps: [
          {
            title: "Mock AI Gap due to missing API Key",
            evidence: "Requires GEMINI_API_KEY to run actual analysis.",
            supportingPapers: selectedPapers.map(p => p.title),
            confidence: "Low",
            direction: "Configure the API key to generate valid directions."
          }
        ] 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Combine paper text contents, limiting size just in case
    const contextText = selectedPapers.map(p => `--- Paper: ${p.title} ---\n${p.textContent.substring(0, 20000)}`).join('\n\n');

    const prompt = `
      You are an expert AI Research Assistant. Analyze the following research papers and identify common "research gaps" across them.
      Look for:
      - Common limitations
      - Missing datasets
      - Underexplored populations
      - Missing evaluation methods
      - Contradictory findings
      
      For each gap, provide:
      1. title: A short title for the gap.
      2. evidence: Evidence from the papers supporting this gap.
      3. supportingPapers: List of paper titles that share this limitation.
      4. confidence: "High" or "Medium" based on how strongly the papers state the limitation.
      5. direction: A suggested "AI-SUGGESTED RESEARCH DIRECTION" to solve the gap.
      
      IMPORTANT: Return the output as a clean JSON array of gap objects.
      
      Papers:
      ${contextText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const gaps = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, gaps });
    } else {
      throw new Error("Failed to parse gaps array from AI response");
    }

  } catch (error) {
    console.error('Gap Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to generate research gaps' }, { status: 500 });
  }
}
