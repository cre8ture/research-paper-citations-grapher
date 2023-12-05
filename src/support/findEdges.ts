// edges.ts
export function findEdges(scholar_json: any[]): any[] {
    let tempEdges: any[] = [];
    console.log("scholar_json", scholar_json)
    scholar_json.forEach(paper => {
        if (Array.isArray(paper.citations)) {

        paper.citations.forEach(citation => {
            let targetPaper = scholar_json.find(p => p.paperId === citation.paperId);
            if (targetPaper) {
                tempEdges.push({
                    source: paper.paperId,
                    target: targetPaper.paperId
                });
            }
        });
    }
    });
    return tempEdges;

    
}



// <script>
//     import { scholar_json } from "../support/store.js";
//     import { writable } from 'svelte/store';

//     let edges = writable([]);

//     function findEdges() {
//         let tempEdges = [];
//         $scholar_json.forEach(paper => {
//             paper.citations.forEach(citation => {
//                 let targetPaper = $scholar_json.find(p => p.paperId === citation.paperId);
//                 if (targetPaper) {
//                     tempEdges.push({
//                         source: paper.paperId,
//                         target: targetPaper.paperId
//                     });
//                 }
//             });
//         });
//         edges.set(tempEdges);
//     }

//     // Call the function to find edges
//     findEdges();
// </script>

