import type { VercelRequest, VercelResponse } from '@vercel/node';

interface BraveSearchResponse {
  web?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, count = 5 } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    
    if (!apiKey) {
      console.error('BRAVE_SEARCH_API_KEY not configured');
      return res.status(500).json({ error: 'Search service not configured' });
    }

    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.append('q', query);
    url.searchParams.append('count', Math.min(count, 10).toString());
    url.searchParams.append('country', 'ID'); // Indonesia region
    url.searchParams.append('search_lang', 'en'); // API language (not supported: id)
    url.searchParams.append('text_decorations', 'false');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Brave API error: ${response.status}`);
      return res.status(response.status).json({ 
        error: 'Search service error',
        details: await response.text()
      });
    }

    const data: BraveSearchResponse = await response.json();

    if (!data.web?.results || data.web.results.length === 0) {
      return res.status(200).json({ results: [] });
    }

    const results = data.web.results.map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.description,
    }));

    return res.status(200).json({ results });

  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
