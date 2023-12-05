import type { RequestHandler } from '@sveltejs/kit'; // Importing types

// Correcting the function signature here
export const GET: RequestHandler = async (request) => {
    // Context 'request' contains 'query' which is used to get URL query parameters.

    // Extract the URLSearchParams object from the request URL.
    const queryParams = request.url.searchParams;

    // Get specific query parameters from the URLSearchParams object.
    // The 'get' method returns the first value associated with the given search parameter.
    const topic = queryParams.get('topic'); // 'topic' is the key of the query parameter you're looking for.
    const offset = queryParams.get('offset'); // 'offset' is the key of the query parameter you're looking for.

    console.log("topic", topic)
    console.log("offset", offset)

    if (!topic) {
        return { status: 400, body: 'Topic query parameter is required' };
    }
    try {
        const apiKey = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY; // securely getting the API key from environment variables

        // Construct the request URL, including the required fields
        // const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&fields=title,url,abstract,citationCount,year&offset=${offset}&limit=100`;
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(topic)}&fields=title,url,abstract,citationCount,year,authors,citations&offset=${offset}&limit=30`;
        console.log('Request URL:', url);
        // SvelteKit's way to handle external requests; you don't directly use `fetch` here
        const response = await request.fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
            },
        });


        console.log('Response status:', response.status);
console.log('Response headers:', response.headers);
        if (!response.ok) {
            // Instead of throwing, directly return the error response
            console.error('Error fetching data from Semantic Scholar: ', response.statusText); // logging the actual error message
            return {
                status: response.status, // reflecting the actual error status code
                body: {
                    error: 'Failed to fetch data from Semantic Scholar', 
                    details: response.statusText // providing more details if available
                }
            };
        }
        const data = await response.json();

        console.log("data",data)

        const resp = new Response(JSON.stringify(data), {
            status: 200, // HTTP status code for a successful request
            headers: {
                'Content-Type': 'application/json' // Indicating the type of content being returned
            }
        });

        return resp;



    } catch (error) {
        console.error('Error fetching papers:', error.message);
    
        return {
            status: 500,
            body: {
                error: 'Internal server error',
                details: error.message, // providing more details about the internal error
            },
        };
    }
};
