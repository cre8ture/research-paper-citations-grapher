<script>
    // import { saveToLocalStorage } from "../support/useLocalStorage";
    // import { afterUpdate, onMount } from "svelte";
    // Import the useChat function from the 'ai/svelte' module
    import { useCompletion } from "ai/svelte";
    import {  scholar_json_edges } from "../support/store"; // Modify the path as per your file structure
    import { openAIIsLoading } from "../support/store.js";
    // import { completedOutline } from "../support/store.js";
    // import { newNodeData } from "../support/store.js";
    // import { isNodeUpdate } from "../support/store.js";
    import { paper_ai_cleaned_results } from "../support/store.js";
    import { current_topic, is_last_update } from "../support/store.js";

    import { tangled_tree_json } from "../support/store.js";
    import { scholar_json } from "../support/store.js";
    

    // import { paper_openai_results } from "../support/store.js";
    import { is_new_tangle_tree_ini, idea_analysis } from "../support/store.js";

    import Toasts from "./Toast/src/Toasts.svelte";
  import { addToast } from "./Toast/src/store.js";

    
    import {
        // createCitationDataset,
        // buildIdeaHierarchy,
        buildIdeaHierarchy2,
    } from "../support/textUtils.js";

    $: {
        if ($paper_ai_cleaned_results) {
            handleConcept($paper_ai_cleaned_results);
        }
    }

    let endpoint = "/api/collapsable_graph";
    let isNewConcept = false;

    // let currentJson = [];

    let jsonStartInit = 0;
    const regex = /{[^}]*}/;
    let updatingANode = false;
    let nodeToUpdate = false;
    // let unsanitizedGraph = ``;

    // Destructure the properties from the useChat function's return value
    const { complete, completion, isLoading, stop } = useCompletion({
        api: endpoint, // "/api/bubble_graph",
        onFinish: (_prompt, completion) => {


            openAIIsLoading.set(false);

            console.log("I'ma fnish yooo", isGettingConcept)
            // RESET VARIABLES
            if(isGettingConcept){
            currRes = "";
            currPos = 0;
            startPos = 0;
            startFlag = 0;
            is_new_tangle_tree_ini.set(true)
            is_last_update.set(true)
                   // if(isNewConcept || nodeToUpdate)
                   count = 0;
            jsonStartInit = 0;
            isNewConcept = false;
            nodeToUpdate = false;
            updatingANode = false;
            isGettingConcept=false
            // console.log("I AM GONNA GET THE IDEA ANALYSIS DUED TO IS_NEW_TANGLE_TREE_INI")
            // handleGetIdeaAnalysis(completion)
            // currentJson = completi

            }

            if(isGettingIdeaAnalysis)
            {
                isGettingIdeaAnalysis = false
            }


            
            // let sanitizedString = parseJSONString(completion);
            // saveToLocalStorage("current_ai_graph", sanitizedString);
        },
        onError: (err) => {
            //   toast.error(err.message);
            openAIIsLoading.set(false); // Move this outside the if-else block
            console.log(err);
            isNewConcept = false;

            const message = "Failed to connect with AI. Check network connection";
                    const type = "error";
                    const dismissible = true;
                    const timeout = 2
                    addToast({ message, type, dismissible, timeout })
                    throw new Error(message);

            //   }
        },
    });

    // let currRes = ''
    // let currPos = 0
    // let startPos = 0;
    // let startFlag = 0
    // function packageResults(res)
    // {
    // // for (let i = 0; i < res.length; i++) {
    //     if (currRes[currPos] === '{') {
    //         startPos = currPos;
    //         startFlag = 1

    //     } else if (currRes[currPos] === '}') {
    //             const result = currRes.substring(startPos, currPos + 1);
    //             startFlag = 1
    //             const jsonRes = JSON.parse(currRes)
    //             console.log("jsonRes", jsonRes)
    //     }
    //     if (startFlag) {
    //         currRes = currRes + res
    //     }
    //     currPos++;

    // }

    let currRes = "";
    let currPos = 0;
    let startPos = 0;
    let startFlag = 0;
    function packageResults(res) {
        currRes = res;
        // console.log("currPos", currPos);
        while (currPos < currRes.length) {
            if (currRes[currPos] === "{" && startFlag === 0) {
                startPos = currPos;
                startFlag = 1;
            } else if (currRes[currPos] === "}" && startFlag === 1) {
                const result =
                    "[" + currRes.substring(startPos, currPos + 1) + "]";
                startFlag = 0;
                try {
                    const jsonRes = JSON.parse(result);

                    // console.log("jsonRes", jsonRes);
                    return jsonRes;
                } catch (e) {
                    // console.error("Failed to parse JSON", e);
                }
            }
            currPos++;
        }
    }

    let full_results = [];
    let isGettingConcept = false;
    function handleConcept(concept) {
        idea_analysis.set('')
        isGettingConcept = true;
        full_results = []
        is_new_tangle_tree_ini.set(true);

        // jsonStartInit = 0;

        currRes = ''

        // nodeDataDblClicked.set('')
        const jsonString = JSON.stringify(concept);
        complete(jsonString);
        var count = 0;
        // completionStore.set(true);

        // This could be a Svelte store subscription or another method of handling a streaming input.
        completion.subscribe((value) => {
            // let result = handleCharacter(value);

            let result = packageResults(value);
            if (result) {
             

                // we make a citation map of that ideas paper
                let citationMap = buildIdeaHierarchy2(
                    result,
                    $scholar_json_edges,
                    $scholar_json
                );

                full_results = [ ...full_results, ...citationMap];
                


                let tangleMap = {
                    name: $current_topic,
                    children: full_results,
                };
                tangled_tree_json.set(tangleMap);

            }
            if (result) {
                count++;
            }
        });

        concept = "";
        
        handleGetIdeaAnalysis($completion)

    }


    function handleGetIdeaAnalysis(ideas) {

        console.log("i am getting IDEAS", ideas)

        complete('make_analysis_320_'+ideas);

        // This could be a Svelte store subscription or another method of handling a streaming input.
        completion.subscribe((value) => {
            // let result = handleCharacter(value);
            idea_analysis.set(value)
            
        });

    }
</script>

<Toasts/>