<script>
      import { onMount } from "svelte";
    import { scholar_input } from "../support/store.js";
    import { isScholarThinking } from "../support/store.js";
    import { scholar_json } from "../support/store.js";
    import { current_topic } from "../support/store.js";
    import {tangled_tree_json} from "../support/store.js";
    import {is_new_tangle_tree_ini } from "../support/store.js"




    let inputEl;
    let containerFocused = false;
  
    // Function to handle input focus
    function handleFocus() {
      containerFocused = true;
    }
  
// Function to handle input blur
function handleBlur(event) {
  // Check if the blur event is not related to clicking the send button
  // and if the input field is not focused or there is no text inside it
  if ((!event.relatedTarget || event.relatedTarget.type !== 'submit') && 
      !inputEl.matches(':focus') && 
      inputEl.value.trim() === '') {
    containerFocused = false;
  }
}

function handleSend(event) {
  // Handle send action here
  event.preventDefault();
  scholar_json.set([]);
  tangled_tree_json.set('');
  scholar_input.set(inputEl.value);
  current_topic.set(inputEl.value);
  inputEl.value = '';
  is_new_tangle_tree_ini.set(true);

}

    onMount(() => {
    function updateContainerFocus() {
      if (containerFocused) {
        inputEl.focus();
      }
    }

    // Since window is only available in the browser, add the event listener here
    window.addEventListener('resize', updateContainerFocus);

    return () => {
      // This will be called when the component is destroyed
      window.removeEventListener('resize', updateContainerFocus);
    };
  });
  </script>
  
  <style>
    .container {
      display: flex;
      align-items: center;
      border: 2px solid #ddd;
      border-radius: 25px;
      overflow: hidden;
      transition: all 0.3s;
      width: 100%; /* Full width by default */
      max-width: 500px; /* Maximum width */
      margin: auto; /* Centering the container */
    }

    .container:focus,
.container:hover {
  transform: scale(1.1);

}

  
    .input-field {
      border: none;
      outline: none;
      padding: 10px 20px;
      transition: flex-grow 0.3s;
      flex-grow: 1; /* Take available space */
      width: 0; /* Fix for flex-grow transition */
    }
  
    .input-field:focus {
      flex-grow: 5;
    }
  
    .send-button {
      /* background-color: #4CAF50; Green */
      border: none;
      color: #3331FA;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      border-radius: 20px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  
    .send-button:hover {
      background-color: light purple;
    }
  
    .send-icon {
      height: 24px;
      width: 24px;
    }
  
    /* Responsive adjustments */
    @media (max-width: 600px) {
      .container {
        max-width: 100%;
      }
  
      .input-field {
        flex-grow: 1; /* Adjust the flex-grow for small screens */
      }
    }
 
    .container:focus-within {
    flex-grow: 5;
  }

  /* Adjust the flex-grow for small screens */
  @media (max-width: 600px) {
    .input-field {
      flex-grow: 1; /* Adjust the flex-grow for small screens */
    }
  }
</style>


<div class="container"
     on:mouseenter={() => containerFocused = true}
     on:mouseleave={() => containerFocused = false}
     on:focus={handleFocus}
     on:blur={handleBlur}
     tabindex="-1"> <!-- tabindex allows the div to be focusable -->
  <input
    class="input-field"
    type="text"
    placeholder="Type your topic here"
    bind:this={inputEl}
  />
  <button class="send-button" type="submit" on:click={handleSend} >
    <svg class="send-icon" viewBox="0 0 24 24">
      <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
    </svg>
  </button>
</div>