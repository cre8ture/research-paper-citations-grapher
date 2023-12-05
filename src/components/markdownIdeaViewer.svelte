<script>
	import { marked } from "marked";
    import { idea_analysis } from '../support/store.js';


  
	let source = "# Hello from Markdown! \n This is _really_ just a markdown string! \n\n Using `marked` we can generate a HTML string from it and using Sveltes `@html` tag we can render that HTML easily!"
    $:{
        if($idea_analysis)
        {
                source = $idea_analysis;
        }   
    }

</script>
<h2>AI Idea Analysis</h2>
{@html marked(source)}
<!-- 
  <style>
    /* Add some styles if needed */
  
    .markdown-content {
      /* Your styles here */
    }
  </style> -->