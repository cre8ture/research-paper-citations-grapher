<script>
    // Import the IconButton component
    import {idea_analysis} from "../support/store.js"
    import IconButton from './icon_button.svelte'
  

  // Email content functionality
  function emailContent() {
    // Here you would typically open the user's email client with the content pre-filled.
    // This can be done using a "mailto" link. For example:
    const subject = encodeURIComponent('brilliant ideas!');
    const body = encodeURIComponent($idea_analysis);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  // Copy content functionality
  async function copyContent() {
    // This would copy some text to the clipboard.
    // You would replace 'Text to copy' with the actual content you want to copy.
    try {
      await navigator.clipboard.writeText($idea_analysis);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  // Download content functionality
  function downloadContent() {
    // Here you would trigger a download of the page's content.
    // This could be a file download triggered by creating a Blob and then downloading it.
    const content = $idea_analysis;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brilliant_ideas.txt'; // The default filename for downloading
    a.click();
    URL.revokeObjectURL(url);
  }

  
  </script>
  
    <IconButton on:click={emailContent} iconSvg='<svg style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon_2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>'/>
  
    
    <IconButton on:click={copyContent} iconSvg='
      <svg  style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon_2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>'/>
  
    <IconButton on:click={downloadContent} iconSvg='
        <svg style="width: 24px; height: 24px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon_2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
          </svg>'/>
          

<style>
    svg {
  width: 24px;
  height: 24px;
}

</style>
 

    
