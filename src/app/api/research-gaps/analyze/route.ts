import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { paperIds } = await request.json();
    
    if (!paperIds || !Array.isArray(paperIds) || paperIds.length < 2) {
      return NextResponse.json({ error: 'Please select at least 2 papers for gap analysis' }, { status: 400 });
    }

    const allPapers = await db.papers.findMany();
    const selectedPapers = allPapers.filter(p => paperIds.includes(p.id));

    // Using local Ollama with qwen3:8b

    // Combine paper text contents, limiting size to avoid extremely long prompts and timeouts
    const contextText = selectedPapers.map(p => `--- Paper: ${p.title} ---\n${p.textContent.substring(0, 10000)}`).join('\n\n');

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
      
      IMPORTANT: Return the output ONLY as a clean JSON array of gap objects. Do not wrap it in an object.
      DO NOT use line breaks or newlines inside your string values. Keep all text on a single line per value.
      
      Papers:
      ${contextText}
    `;

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        format: 'json', // Helps Ollama to output valid JSON for the array
        options: {
          num_ctx: 16384,
          num_predict: 2048
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned an error: ${ollamaResponse.statusText}`);
    }

    const result = await ollamaResponse.json();
    const responseText = result.response;
    
    let gaps = [];
    try {
      let cleanResponse = responseText.replace(/\n/g, "\\n").replace(/\r/g, ""); // basic sanitization
      // if it's already a string with escaped newlines, parsing will work
      const parsed = JSON.parse(responseText);
      if (Array.isArray(parsed)) {
        gaps = parsed;
      } else if (parsed.gaps && Array.isArray(parsed.gaps)) {
        gaps = parsed.gaps;
      } else if (parsed.research_gaps && Array.isArray(parsed.research_gaps)) {
        gaps = parsed.research_gaps;
      } else {
        throw new Error("JSON parsed but no array found.");
      }
    } catch (e) {
      // Fallback to regex if JSON.parse fails or if it's truncated
      let jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        jsonMatch = responseText.match(/\{[\s\S]*\}/); // Sometimes it returns an object
      }
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) gaps = parsed;
          else if (parsed.gaps) gaps = parsed.gaps;
          else if (parsed.error) throw new Error("AI returned error: " + parsed.error);
        } catch(e2) {
          // Attempt to repair truncation
          try {
             gaps = JSON.parse(jsonMatch[0] + ']');
          } catch(e3) {
             try {
                gaps = JSON.parse(jsonMatch[0] + '}]}');
             } catch(e4) {
                throw new Error("Failed to parse gaps array from AI response. Please try again.");
             }
          }
        }
      } else {
        throw new Error("Failed to parse gaps array from AI response. Please try again.");
      }
    }
    
    return NextResponse.json({ success: true, gaps });

  } catch (error: any) {
    console.error('Gap Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to generate research gaps. ' + (error.message || '') }, { status: 500 });
  }
}
