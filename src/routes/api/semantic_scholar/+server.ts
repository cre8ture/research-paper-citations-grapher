// src/routes/api/papers.ts (or .js)

import type { RequestHandler } from '@sveltejs/kit'; // Importing types

// Correcting the function signature here
export const GET: RequestHandler = async (request) => {
    // Context 'request' contains 'query' which is used to get URL query parameters.

// Extract the URLSearchParams object from the request URL.
const queryParams = request.url.searchParams;

// Get specific query parameters from the URLSearchParams object.
// The 'get' method returns the first value associated with the given search parameter.
const topic = queryParams.get('topic'); // 'topic' is the key of the query parameter you're looking for.

console.log("topic", topic)

    if (!topic) {
        return { status: 400, body: 'Topic query parameter is required' };
    }
    try {
        const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY; // securely getting the API key from environment variables

        // Construct the request URL, including the required fields
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&fields=title,url,abstract,citationCount,year`;

        // SvelteKit's way to handle external requests; you don't directly use `fetch` here
        const response = await request.fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
            },
        });

        console.log("i am response", response)

        if (!response.ok) {
            throw new Error('Failed to fetch data from Semantic Scholar');
        }

        const data = await response.json();

        const resp = new Response(JSON.stringify(data), {
            status: 200, // HTTP status code for a successful request
            headers: {
                'Content-Type': 'application/json' // Indicating the type of content being returned
            }
        });

        return resp;


    } catch (error) {
        // handling any errors
        console.error('Error fetching papers:', error);

        return {
            status: 500,
            body: {
                error: 'Internal server error',
            },
        };
    }
};
