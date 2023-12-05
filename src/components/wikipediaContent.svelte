<script>
    import {current_topic} from "../support/store.js";

    let summary = 'Loading...';
    let extraInfo = {};
  
    const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php';
    
    // Function to fetch data from Wikipedia
    async function fetchSummary(topic) {
    try{
      const response = await fetch(`${wikipediaApiUrl}?action=query&format=json&origin=*&prop=extracts|pageprops|links&pllimit=5&exintro&explaintext&redirects=1&titles=${encodeURIComponent(topic)}`);
      const data = await response.json();
      
      const page = data.query.pages[Object.keys(data.query.pages)[0]];
      if (page.missing) {
        summary = 'No summary available for this topic.';
      } else {
        const sentences = page.extract.split('. ').slice(0, 2).join('. ') + '.';
        summary = sentences;
        extraInfo = {
          pageId: page.pageid,
          // Here you could extract additional info like topic hierarchy, links, etc.
          // For example, the pageprops might contain information on the topic hierarchy
          topicHierarchy: page.pageprops,
          // This grabs the first five links for demonstration purposes
          importantLinks: page.links.map(link => link.title),
        };

      }
    } catch (e)
    {
        console.log("ERROR WITH WIKI:", e)
    }
    }
  
    // Reactively fetch summary when current_topic changes
    $: if (current_topic) {
      fetchSummary($current_topic);
    }
  </script>
  
  <div class="wiki-summary">
    <p>{summary}</p>
    <!-- Render additional info if you need to -->
  </div>
  
  <style>
  </style>
  