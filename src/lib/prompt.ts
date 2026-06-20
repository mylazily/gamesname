export interface GenerateParams {
  prompt?: string;
  gameType: string;
  category: string;
  style: string;
  outputLang: string;
  count: number;
}

export function buildPrompt(params: GenerateParams): string {
  const { prompt, gameType, category, style, outputLang, count } = params;
  
  let userPrompt = `Generate ${count} ${style} style ${category} names`;
  
  if (gameType) {
    userPrompt += ` for ${gameType} games`;
  }
  
  if (prompt) {
    userPrompt += `. The user described: "${prompt}"`;
  }
  
  userPrompt += `. Output the names in ${outputLang} language.`;
  
  userPrompt += `

Requirements:
- Each name must be unique and creative
- Provide a brief meaning or lore explanation for each name (in ${outputLang})
- Format as a numbered list: "1. Name | Meaning"
- Output ONLY the numbered list, no extra text`;

  return userPrompt;
}

export function parseNames(text: string): Array<{ name: string; meaning: string }> {
  const names: Array<{ name: string; meaning: string }> = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/^\d+\.\s*(.+?)(?:\s*[\|\-:]\s*(.+))?$/);
    if (match) {
      const name = match[1].trim();
      const meaning = match[2]?.trim() || '';
      if (name) {
        names.push({ name, meaning });
      }
    }
  }
  
  return names;
}
