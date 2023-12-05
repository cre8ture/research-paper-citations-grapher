<script>
  import Layout from "../components/layout.svelte"
  // import Paper_list from "../components/paper_lists.svelte";
  import Paper_list from "../components/paper_list_limited_by_years.svelte";
  // import TangledTree from "../components/tangledTree.svelte";
  import SendAI from "../components/sendAiGraph.svelte"
  import Left_side from "../components/left_topic_display.svelte"
  import Right_side from "../components/right_graph_display.svelte"
  import OpenAi from "../components/do_api_openAi.svelte"
  import Markdown from "../components/markdownIdeaViewer.svelte"
  import {idea_analysis} from "../support/store.js";
import ButtonBar from "../components/icon_button_bar.svelte"


  // import Scholar_bubble_graph from "../components/scholar_bubble_graph.svelte";


  // import { isOutline } from "../support/store.js";
  import { fade } from 'svelte/transition';
  // other imports

  </script>
  <style>
  .flex-container {
    display: flex;
    justify-content: space-between;
  

    /* If you want to align the items at the start of the container, use this:
    align-items: flex-start; */
  }

  /* Each flex item can be targeted individually */
  .tangled-tree-container {
    flex: 2; /* This item can grow and shrink but initially represents one part */
    min-width: 0; /* Prevent flex items from growing past their content size */
    padding: 10px; /* Add some spacing between the flex items */
    z-index: 100;
  }

  .scholar-bubble-graph-container {
    flex: 1; /* This item will be twice as large as the tangled tree container initially */
    min-width: 0; /* Prevent flex items from growing past their content size */
    padding: 10px; /* Add some spacing between the flex items */
  }
  
  .inputFields {
    margin-top: 30px;
  }

  /* Adjust layout for smaller screens */
  @media (max-width: 768px) {
    .flex-container {
      flex-direction: column;
    }

    .tangled-tree-container,
    .scholar-bubble-graph-container {
      flex: none; /* Default to no flex-grow or flex-shrink */
      margin-bottom: 10px; /* Add some space between the stacked items */
    }
  }
</style>

<Layout>
  <div class=inputFields>
  <SendAI/>
  <Paper_list />
  <OpenAi/>

  </div>
  
  <div class="flex-container" transition:fade>

    <div class="tangled-tree-container">
    <Left_side />

    </div>
    <div class="scholar-bubble-graph-container">
      <Right_side />
    </div>

  </div>
{#if $idea_analysis}
  <div class="markdown-container">
    <div class="text-wrapper">
    <Markdown />
  </div>
  <div class="button-bar">
    <ButtonBar />
  </div>
</div>
{/if}
</Layout>