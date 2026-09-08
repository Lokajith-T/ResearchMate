

async function test() {
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
      
      Paper Text:
      This is a test paper. The problem is X. The objective is Y. The methodology is Z. The dataset is D. The results are R. The limitations are L. The future work is F.
    `;

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          num_ctx: 4096
        }
      }),
    });

    const result = await ollamaResponse.json();
    console.log("Ollama Status:", ollamaResponse.status);
    console.log("Ollama Response:", result);
  } catch(e) {
    console.error("Fetch Error:", e);
  }
}

test();
