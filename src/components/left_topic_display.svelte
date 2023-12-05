<script>
      import Tangled from "./tangledTree.svelte";
    import { fade } from 'svelte/transition';
    import Wiki_Sum from "./wikipediaContent.svelte"
    import { current_topic } from "../support/store.js";

    // import Markdown from "./markdownIdeaViewer.svelte"
  </script>
  
  <style>
.card {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fdf8e1; /* Aged paper color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow */
  transition: box-shadow 0.3s ease-in-out; /* Smooth transition for hover effect */
}

.card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Slightly more pronounced shadow on hover */
}

    .card-heading {
      /* Styling for the heading */
    }
  
    .card-content, .card-footer {
      /* Styling for the content and footer text */
    }
  
    /* Add styling for the .left-topic-display if needed */
  </style>
  
  <div class="card">
    <div class="card-heading" in:fade={{ duration: 300 }}>
      <h2>Find Brilliant Ideas for {$current_topic} (and supporting scholarly papers)</h2>
    </div>
    <div class="card-content" in:fade={{ duration: 300 }}>
      <!-- <p>Your content text goes here...</p> -->
      <Wiki_Sum/>
    </div>
    <div class="tangled-component" in:fade={{ duration: 300 }}>
      <Tangled />
    </div>
    <div class="card-footer" in:fade={{ duration: 300 }}>
    </div>
  </div>
  