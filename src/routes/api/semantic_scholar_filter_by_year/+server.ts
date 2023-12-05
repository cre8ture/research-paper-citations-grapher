import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (request) => {
    const queryParams = request.url.searchParams;
    const topic = queryParams.get('topic');
    const offset = queryParams.get('offset') || 0;  
    const startYear = queryParams.get('startYear');
    const endYear = queryParams.get('endYear');

    if (!topic) {
        return { status: 400, body: 'Topic query parameter is required' };
    }

    if (!startYear || !endYear) {
        return { status: 400, body: 'Both startYear and endYear parameters are required' };
    }

    try {
        const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;

        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&year=${startYear}-${endYear}&openAccessPdf&fieldsOfStudy=Physics,Philosophy&fields=title,url,abstract,citationCount,year,authors,citations&offset=${offset}&limit=20`;

        console.log('Request URL:', url);

        const response = await request.fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            console.error('Error fetching data from Semantic Scholar:', response.statusText);
            return {
                status: response.status,
                body: {
                    error: 'Failed to fetch data from Semantic Scholar',
                    details: response.statusText
                }
            };
        }

        const data = await response.json();
        const resp = new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return resp;
    } catch (error) {
        console.error('Error fetching papers:', error.message);
        return {
            status: 500,
            body: {
                error: 'Internal server error',
                details: error.message,
            },
        };
    }
};
