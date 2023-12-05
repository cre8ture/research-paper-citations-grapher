<script>
  // import { spring } from "svelte/motion";
  import "./Menu.svelte.scss"; // Import the SCSS file
  // import { theme } from "../store";
  import {
    saveToLocalStorage,
    getFromLocalStorage,
    getMultipleKeysFromLocalStorage,
  } from "../support/useLocalStorage.ts";
  import { currentJsonToSave } from "../support/store.js";
  import { isLoadNewGraph } from "../support/store.js";
  import { theme } from "../store";  // Import your theme store
  let strokeColor;

  $: 
  {strokeColor = $theme === 'dark' ? '#ffffff' : '#000000'; 
// console.log($theme, "STROKE", strokeColor)
} // Reactive declaration to compute stroke color based on theme


  // console.log("THEME", $theme)

  // import { editorInstance } from "../store";

  // let editor;
  let saved_files = [];
  let hoveredItem = null; // Declare hoveredItem here

  // editorInstance.subscribe((value) => {
  //   editor = value;
  // });

  // import { FontSize } from "../support/fontSize";
  let isOpen = false;
  let isClicked = false;
  let userInput = "";
  let isInputVisible = false; // To control the visibility of the input field
  let isFileListVisible = false;

  function toggleMenu() {
    isOpen = !isOpen;
    isClicked = !isClicked;
  }

  function toggleInput() {
    isInputVisible = !isInputVisible;
  }

  function saveInput() {
    // Perform your desired logic with userInput here
    // if (editor) {
      console.log("User Input:", userInput);
      toggleInput(); // Hide the input field after saving
      saveToLocalStorage("ai_force_graph_app_v1" + userInput, $currentJsonToSave);
    // }
  }

  function exportPage() {
    toggleMenu()
    setTimeout(() => {
      window.print();
    }, 100);
  }
    // Perform your desired logic with userInput here
    // print();


  function toggleLoad() {
  isFileListVisible = !isFileListVisible;
   saved_files = getMultipleKeysFromLocalStorage("ai_force_graph_app_v1")// .then((data) => {

    console.log(saved_files);
}

// function toggleLoad() {
//     isFileListVisible = !isFileListVisible;
//     saved_files = getMultipleKeysFromLocalStorage("ai_force_graph_app_v1");
    
//     // Use map to create a new array with the modified strings
//     const updated_files = saved_files.map(file => {
//         // Use replace to remove the substring from each string
//         return file.replace(/ai_force_graph_app_v1/g, '');
//     });
    
//     console.log(updated_files);
// }


function loadFile(fileId) {
  // Logic to load the selected file based on fileId
  // You can implement this logic using your existing functions
  console.log("LOADING" , fileId);
  const json_content = getFromLocalStorage(fileId)
  if (json_content) {
    isLoadNewGraph.set(true);
    isFileListVisible=!isFileListVisible
    console.log("OPENING INSIDE", $isLoadNewGraph, json_content)
    currentJsonToSave.set(json_content);
    // isLoadNewGraph.set(false);

  }
}


</script>
<div class="menu-left {isOpen ? 'menu-open' : ''}">
  <div
    class="newfile-icon"
    class:open={isClicked}
    on:click={toggleMenu}
    on:mouseenter={() => (isClicked = false)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke={strokeColor} 
      style="width: 24px; height: 24px;"
      class="transition-transform transform-gpu"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d={isOpen
          ? "M12 19l-7-7 7-7"
          : "M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"}
      />
    </svg>
  </div>
  {#if isOpen}
    <div class="menu-left-content">
      <div class="themeleft-toggle">
        <label>Export</label>
        <button class="button-icon" on:click={exportPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            style="width: 24px; height: 24px;"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}
</div>

