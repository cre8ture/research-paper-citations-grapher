<script>
    import Scholar from "./scholar_bubble_graph.svelte";
    import { fade } from 'svelte/transition';
  </script>
  
  <style>
.card {
  display: grid;
  overflow: scroll;
  grid-template-rows: auto auto 1fr auto;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #FDF5E6; /* Aged paper color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Slight shadow */
  transition: box-shadow 0.3s ease-in-out; /* Smooth transition for hover effect */
}

.card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Slightly more pronounced shadow on hover */
}

  
    /* Add styling for the .left-topic-display if needed */
  </style>
  
  <div class="card">
    <div class="bubble-component" id="bubble-component" in:fade={{ duration: 300 }}>
      <Scholar />
  </div>
  </div>  
  