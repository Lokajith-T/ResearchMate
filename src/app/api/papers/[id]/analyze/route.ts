import { NextResponse } from 'next/server';
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

    // Using local Ollama with qwen3:8b

    // Truncate text to avoid the 5-minute Node.js fetch timeout and reduce local LLM load
    const contentToAnalyze = paper.textContent.substring(0, 20000); 

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
      IMPORTANT: Output MUST be a valid JSON. DO NOT use line breaks or newlines inside your string values. Keep all text on a single line per value.
      
      Paper Text:
      ${contentToAnalyze}
    `;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        format: 'json', // Instructs Ollama to output JSON, which is helpful here
        options: {
          num_ctx: 8192, // Reduced to prevent extremely long generation times
          num_predict: 2048 // Ensure enough tokens to finish the JSON
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned an error: ${ollamaResponse.statusText}`);
    }

    const result = await ollamaResponse.json();
    const responseText = result.response;
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let parsedAnalysis: any = {};
    if (jsonMatch) {
      try {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        // Attempt to repair common truncation issues by closing the JSON object
        try {
          parsedAnalysis = JSON.parse(jsonMatch[0] + '}');
        } catch (e2) {
          try {
            parsedAnalysis = JSON.parse(jsonMatch[0] + '}}');
          } catch (e3) {
            console.error("Failed to parse JSON even after repair attempts:", parseError);
            throw new Error("The AI generated a malformed response. Please click Re-Analyze to try again.");
          }
        }
      }
    } else {
      throw new Error("Failed to find JSON in AI response. Please click Re-Analyze.");
    }

    // Validate the AI actually generated the expected structure
    if (!parsedAnalysis.problem && !parsedAnalysis.objective) {
      if (parsedAnalysis.error) {
        throw new Error(`AI Model Error: ${parsedAnalysis.error}`);
      }
      throw new Error("The AI response did not contain the expected analysis sections. Please click Re-Analyze.");
    }

    const updated = await db.papers.update(paperId, { analysis: parsedAnalysis });

    return NextResponse.json({ success: true, analysis: updated.analysis });
  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze paper. ' + (error.message || '') }, { status: 500 });
  }
}
