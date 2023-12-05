<script>
    import { onMount } from "svelte";
    import { scholar_json } from "../support/store.js";
    import { findEdges } from "../support/findEdges.ts";
    import { scholar_json_edges } from "../support/store.js";
    import { scholar_input } from "../support/store.js";
    import { isScholarThinking } from "../support/store.js";
    import { paper_ai_cleaned_results } from "../support/store.js";
    import {extractTitlesAndFirstSentences, extractPaperTitles} from "../support/textUtils.js"

    import Toasts from "./Toast/src/Toasts.svelte";
  import { addToast } from "./Toast/src/store.js";

    let edges = []; // This will hold the edges data

    $: {
        if (Array.isArray($scholar_json) && $scholar_json.length > 0) {
            edges = findEdges($scholar_json);
            console.log("edges", edges)
            scholar_json_edges.set(edges);
        }
    }

    $: {
        if ($scholar_input) {

            getPapers($scholar_input, 2020, 2023).then((data) =>{
                // scholar_json.set([]); // Reset the scholar_json store
                if(!data || ! data.data || data.data.length === 0)
                {
                    const message = "No papers found";
                    const type = "error";
                    const dismissible = true;
                    const timeout = 0
                    addToast({ message, type, dismissible, timeout })
                    // throw new Error(message);
                    return
                }
                scholar_json.set(data.data)
                let cleanedAI = extractPaperTitles(data.data)
                // console.log("cleanedAI", cleanedAI)
                paper_ai_cleaned_results.set(cleanedAI)}
            );
        }
    }

    // Function to get papers on a topic with specified years
    async function getPapers(topic, startYear, endYear) {
        isScholarThinking.set(false);

        const response = await fetch(
            `/api/semantic_scholar_filter_by_year?topic=${encodeURIComponent(
                topic
            )}&startYear=${startYear}&endYear=${endYear}`
        );
        if (!response.ok) {
            console.log("response", await response.json());
            throw new Error("Failed to fetch papers");
        }
        isScholarThinking.set(false);
        return await response.json();
    }

    onMount(async () => {
        try {
            const data = await getPapers($scholar_input || "machine learning", 2020, 2023); // adjust 'your-topic' accordingly
            scholar_json.set(await data.data); // Update the store with the fetched
            let cleanedAI = extractTitlesAndFirstSentences(data.data)
                console.log("cleanedAI", cleanedAI)
                paper_ai_cleaned_results.set(cleanedAI)
        } catch (error) {
            console.error("An error occurred while fetching papers:", error);

        }
    });
</script>
<Toasts/>
