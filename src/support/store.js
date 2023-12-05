    import { writable } from 'svelte/store';
    
    // Create a Svelte writable store with an initial value of an empty string
    export const completionStore = writable('');
    export const isOutline = writable(false);
    export const outline = writable('');
    export const nodeDataDblClicked = writable('');
    export const openAIIsLoading = writable(false);
    export const completedOutline = writable('');
    export const newNodeData = writable('');
    export const graphRawData = writable('');
    export const isGraph = writable(false) // only when we are adding a new node
    export const isDeleteNode = writable(false) // only when we are adding a new node
    export const isNodeUpdate = writable(false) // only when we are adding a new node
    export const currentSVG = writable('') // only when we are adding a new node
    export const currentJsonToSave = writable('') // only when we are adding a new node
    export const isLoadNewGraph = writable(false) // only when we are adding a new 
    


    export const scholar_json = writable('') // only when we are adding a new 
    export const scholar_json_edges = writable('') // only when we are adding a new node
    export const scholar_input = writable('') // only when we are adding a new 
    export const isScholarThinking = writable(false) // only when we are adding a new
    export const current_topic = writable("machine learning") // only when we are adding a new
    export const paper_ai_cleaned_results = writable('') // only when we are adding a new
    export const paper_openai_results = writable('') // only when we are adding a new
    export const tangled_tree_json = writable('') // only when we are adding a new
    export const is_new_tangle_tree_ini = writable('') // only when we are adding a new
    export const is_last_update = writable(false) // only when we are adding a new
    export const idea_analysis = writable('') // only when we are adding a new






     

    








 





