import type { APIRoute } from 'astro';
import { buildPrompt } from '../../lib/prompt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, gameType, category, style, outputLang, count } = body;

    // Try multiple ways to get env vars in Cloudflare Pages
    let apiKey: string | undefined;
    let baseUrl: string | undefined;

    // Method 1: import.meta.env (build-time for Astro)
    apiKey = apiKey || (import.meta as any).env?.AGNES_API_KEY;
    baseUrl = baseUrl || (import.meta as any).env?.AGNES_BASE_URL;

    // Method 2: process.env (Node.js compat)
    try {
      apiKey = apiKey || (process as any).env?.AGNES_API_KEY;
      baseUrl = baseUrl || (process as any).env?.AGNES_BASE_URL;
    } catch {}

    // Method 3: globalThis
    try {
      apiKey = apiKey || (globalThis as any).AGNES_API_KEY;
      baseUrl = baseUrl || (globalThis as any).AGNES_BASE_URL;
    } catch {}

    baseUrl = baseUrl || 'https://apihub.agnes-ai.com/v1';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userPrompt = buildPrompt({ prompt, gameType, category, style, outputLang, count });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [
          { role: 'system', content: 'You are an expert game name generator. Generate creative, unique, and memorable game names with meanings.' },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: 'AI service error', details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ 
      success: true, 
      data: generatedText,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
