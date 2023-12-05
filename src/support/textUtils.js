
export function extractTitlesAndFirstSentences(papers) {
  // Use the filter method to omit papers without an abstract
  const papersWithAbstract = papers.filter(paper => paper.abstract && paper.abstract.trim() !== '');

  // Map over the filtered papers to extract the titles and first sentences
  return papersWithAbstract.map(paper => {
    // Match the first sentence in the abstract
    const firstSentenceMatch = paper.abstract.match(/[^.!?]+[.!?](\s|$)/);
    const firstSentence = firstSentenceMatch ? firstSentenceMatch[0].trim() : '';

    // Return the title and the first sentence in the abstract
    return {
      title: paper.title,
      abstract: firstSentence
    };
  });
}



/**
 * Creates a citation dataset based on the given ideas and edges.
 *
 * @param {array} ideas - An array of objects representing ideas. Each idea object should have a `papers` property that contains an array of paper titles.
 * @param {array} edges - An array of objects representing edges. Each edge object should have a `source` property that contains information about the source paper, including `title`, `paperId`, `authors`, and `year`. The `source` paper should also have a `citations` property that contains an array of citation objects, each representing a citation with a `title` and `paperId`.
 * @return {array} - An array of objects representing the citation dataset. Each dataset object contains information about a paper, including `name`, `title`, `paperId`, and `children` (an array of citation objects).
 */
export function createCitationDataset(ideas, edges) {
  // First, create a lookup for the papers to quickly access their information
  const papersLookup = ideas.reduce((lookup, idea) => {
    idea.papers.forEach(title => {
      lookup[title] = {
        name: null, // Will be filled later with author's last name and year
        title,
        paperId: null, // Will be filled later with actual paperId
        children: []
      };
    });
    return lookup;
  }, {});

  // Now, go through the edges and fill in the details for each paper
  edges.forEach(edge => {
    const sourcePaper = papersLookup[edge.source.title];
    if (sourcePaper) {
      // Assign paperId and name if it hasn't been done yet
      if (!sourcePaper.paperId) {
        sourcePaper.paperId = edge.source.paperId;
        sourcePaper.name = `${edge.source.authors[0].name.split(' ').pop()}, ${edge.source.year}`;
      }

      // Add all citations as children
      edge.source.citations.forEach(citation => {
        sourcePaper.children.push({
          name: citation.title,
          value: citation.paperId
        });
      });
    }
  });

  // Finally, return the dataset, filtering out entries that were not in the edges
  return Object.values(papersLookup).filter(paper => paper.paperId !== null);
}

// // Example usage:
// const citationDataset = createCitationDataset(ideas, edges);
// console.log(citationDataset);

/**
 * Generates the hierarchy of ideas based on the given list of ideas and paper edges.
 *
 * @param {Array} ideas - The list of ideas.
 * @param {Array} papersEdges - The list of paper edges.
 * @return {Array} The hierarchy of ideas.
 */
export function buildIdeaHierarchy(ideas, papersEdges) {
  const papersMap = new Map();
console.log("papersEdges", papersEdges  )
  // Create a map for all papers with their citations
  papersEdges.forEach(edge => {
    if (!papersMap.has(edge.source.paperId)) {
      papersMap.set(edge.source.paperId, {
        name: `${edge.source.authors[0].name.split(' ').pop()}, ${edge.source.year}`,
        title: edge.source.title,
        paperId: edge.source.paperId,
        children: []
      });
    }
    edge.source.citations.forEach(citation => {
      papersMap.get(edge.source.paperId).children.push({
        name: citation.title,
        value: citation.paperId
      });
    });
  });

  // Function to build the hierarchy for each idea
  const buildHierarchyForIdea = (idea) => {
    return {
      name: idea.idea,
      children: idea.papers.map(paperTitle => {
        // Find the paper in the papersMap
        const paperNode = Array.from(papersMap.values()).find(p => p.title === paperTitle);
        // If the paper is not in the map, we create a placeholder
        return paperNode || {
          name: `Unknown author, Unknown year`,
          title: paperTitle,
          paperId: null,
          children: []
        };
      })
    };
  };

  // Build the final hierarchy
  return ideas.map(idea => buildHierarchyForIdea(idea));
}

/**
 * Extracts paper titles from an array of papers.
 *
 * @param {Array} papers - The array of papers.
 * @return {Array} An array of objects containing the paper titles.
 */
export function extractPaperTitles(papers) {
  return papers.map(paper => ({ paper_title: paper.title }));
}


function getLastName(name) {
  // console.log("name", name)
  // Split the name by spaces
  const parts = name.trim().split(/\s+/);
  // Return the last part
  return parts[parts.length - 1];
}
/**
 * Builds the idea hierarchy based on the given ideas and paper edges.
 *
 * @param {Array} ideas - An array of objects representing ideas.
 * @param {Array} papersEdges - An array of objects representing edges between papers.
 * @return {Array} An array of objects representing the final hierarchy.
 */
export function buildIdeaHierarchy2(ideas, papersEdges, allPapers) {
  const papersMap = new Map();

  // Initialize the map with all papers as keys and their titles as values
  papersEdges.forEach(edge => {
    // if (!papersMap.has(edge.source.paperId)) {
    //   papersMap.set(edge.source.paperId, {
    //     title: edge.source.title,
    //     name: getLastName(edge.source.authors[0].name) + ', '+ edge.source.year,
    //     children: []
    //   });
    // }
    // if (!papersMap.has(edge.target.paperId)) {
    //   papersMap.set(edge.target.paperId, {
    //     title: + ', '+ edge.source.year,
    //     name: getLastName(edge.target.authors[0].name) + ', '+ edge.source.year,
    //     children: []
    //   });
    // }

    if (!papersMap.has(edge.source.paperId)) {
      const sourceAuthors = Array.isArray(edge.source.authors) ? edge.source.authors : [];
      const sourceAuthorName = sourceAuthors.length > 0 ? getLastName(sourceAuthors[0].name) : 'Unknown Author';
      papersMap.set(edge.source.paperId, {
        title: edge.source.title,
        name: sourceAuthorName + ', ' + edge.source.year,
        children: []
      });
    }
    
    if (!papersMap.has(edge.target.paperId)) {
      const targetAuthors = Array.isArray(edge.target.authors) ? edge.target.authors : [];
      const targetAuthorName = targetAuthors.length > 0 ? getLastName(targetAuthors[0].name) : 'Unknown Author';
      papersMap.set(edge.target.paperId, {
        title: edge.target.title,
        name: targetAuthorName + ', ' + edge.target.year,
        children: []
      });
    }
    
  });

  // Populate the children based on the edges
  papersEdges.forEach(edge => {
    let sourcePaper = papersMap.get(edge.source.paperId);
    let targetPaper = papersMap.get(edge.target.paperId);
    // Add the target paper as a child of the source paper
    if (!sourcePaper.children.some(child => child.title === targetPaper.title)) {
      sourcePaper.children.push(targetPaper);
    }
  });

  // Function to build the hierarchy for each idea
  
// Function to build the hierarchy for each idea
const buildHierarchyForIdea = (idea) => {
  return {
    name: idea.idea,
    children: idea.papers.map(paperTitle => {
      let paperNode = Array.from(papersMap.values()).find(p => p.title === paperTitle);

      // If paperNode is not found, check in allPapers
      if (!paperNode) {
        let allPapersNode = allPapers.find(p => p.title === paperTitle);
        if (allPapersNode) {
          // Add it to the papersMap with a new entry
          papersMap.set(allPapersNode.paperId, {
            title: allPapersNode.title,
            name: getLastName(allPapersNode.authors[0].name) + ', ' + allPapersNode.year,
            children: [] // Assuming there are no children for these nodes
          });
          paperNode = papersMap.get(allPapersNode.paperId);
        }
      }

      // If paperNode is still not found, give it a truncated title and set year to "NA"
      if (!paperNode) {
        return {
          name: paperTitle.substring(0, 8) + '...', // Truncate title to first 8 chars
          value: 'NA' // Set year to "NA"
        };
      }
      
      // If paperNode has no children, give it a random value
      if (paperNode.children.length === 0) {
        return {
          name: paperNode.name, // This includes the last name and year
          value: Math.floor(Math.random() * 100)
        };
      }
      
      // If paperNode has children, return the node with its children
      return paperNode;
    })
  };
};

// Map over the ideas and build the hierarchy for each
return ideas.map(buildHierarchyForIdea);
}