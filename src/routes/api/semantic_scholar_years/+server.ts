import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (request) => {
    const queryParams = request.url.searchParams;
    const paperId = queryParams.get('paperId');

    if (!paperId) {
        return { status: 400, body: 'PaperId query parameter is required' };
    }

    try {
        const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY;
        const url = `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(paperId)}?fields=year`;
        console.log('Request URL:', url);
        const response = await request.fetch(url, {
            method: 'GET',
            headers: { 'x-api-key': apiKey },
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
        return {
            status: 200,
            body: {
                year: data.year
            }
        };

    } catch (error) {
        console.error('Error fetching paper:', error.message);
        return {
            status: 500,
            body: {
                error: 'Internal server error',
                details: error.message,
            },
        };
    }
};
