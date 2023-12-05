import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

//  import { session } from '$app/stores';

 

import { env } from '$env/dynamic/private';
// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
// import { OPENAI_API_KEY } from '$env/static/private'

import type { RequestHandler } from './$types';
const apiKey = import.meta.env.VITE_OPENAI_API_KEY //env.OPENAI_API_KEY 
// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: apiKey
});

let directiveToApi = ''
// console.log("I AMsdsdsd  API KEy", apiKey)

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { prompt } = await request.json();

  console.log("i is prompt", prompt )

  if (prompt.startsWith("make_analysis_320_")) {
    // The prompt starts with "make_outline_320_"
    // Do whatever you want in this condition

    console.log("i am getting dat special sauce idea!!", prompt.slice(17))
    directiveToApi = `Given this ${prompt.slice(17)}, which is data structure of novel ideas and the papers that will uncover the key to how this idea works.
    pick two of the most feasible brilliant of these ideas.
    For each idea describe concisely what makes this idea brilliant.
    Show either mathematically or conceptually how this could work. Show code if necessary.
    Output only proper markdown`


    
} else {
    // The prompt does not start with "make_outline_320_"  [{paper_title: "title1", abstract: "summary of paper1"},...,{paper_title: "titlen", abstract: "summary of papern"}]
    
    // Handle accordingly
    directiveToApi = `given a data structure of n paper titles and their abstracts: ${prompt}
   
    output in a brilliant way 4 new and never before seen genius ideas, where each idea is a synthesis of 2 or more of these papers.
    
    Your output MUST only be JSON like:
    [{"idea":"1 sentence description of idea 1...", "papers": ["paper title 1 that was partly used to synthesize this idea", "paper title 2","paper title 3",...] }, {"idea":"1 sentence description of idea 2...", "papers":["...","...", ...] }]
    Your output must only be JSON of the form above.
    `
  }

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    // messages: messages.map((message: any) => ({
    //   content: message.content,
    //   role: message.role,
    // })),
    messages: [
            {
              role: 'user',
              content: directiveToApi
            },
            {
              role: 'assistant',
              content: '',
            },
          ],
          max_tokens: 2000,
          temperature: 0.5, // Adjust as needed for creativity vs consistency
          top_p: 1,
          frequency_penalty: 0.5, // Adjust as needed
          presence_penalty: 0.5, // Adjust as needed
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  console.log("STREAM", stream)
  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
