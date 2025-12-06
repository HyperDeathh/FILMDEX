const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY || process.env.TMDB_API_KEY;
  
  const { endpoint, ...queryParams } = req.query;

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Build the TMDB URL
    const params = new URLSearchParams();
    
    // Add all query parameters except 'endpoint'
    Object.entries(queryParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      }
    });

    const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?${params.toString()}`;

    const response = await fetch(tmdbUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `TMDB API error: ${response.statusText}`,
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('TMDB Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from TMDB',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
