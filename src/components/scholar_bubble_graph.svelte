<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    // import { getViewportDimensions } from "../support/dimensions.js";
    import { scholar_json } from "../support/store.js";
    import { scholar_json_edges, current_topic } from "../support/store.js";
    // import {line} from "d3";

    let svgContainer;
    let width, height;
    let margin = { top: 30, right: 20, bottom: 30, left: 30 };
    let currentNodesBeingShown;
    let papers;
    let edges;
    let scaleFactor = 2;
    // Set up SVG with zooming capability
    let svg;
    let tooltip;
    let newTopic = 0; // this will need to be changed eventually
    let circlesGroup;
    let lastNodeIndex = 0;
    let zoom;
let  tickCount;
const baseDamping = 0.005;  // A smaller base value for more gradual deceleration
const maxDamping = 0.05;   // A cap for the damping value
    let counter;
    let papers_to_show = 20;
    let currentVisibleEdges;
    let linkGroup;
    let svgWidth; 
    let svgHeight;

    $: {
        if ($scholar_json.length === 0) {
            newTopic = 1;
        }
    }

    $: {
        if ($scholar_json.length > 0) {
            // && scholar_json_edges) {
            papers = [...$scholar_json];
            edges = [...$scholar_json_edges];
            papers.sort((a, b) => b.citationCount - a.citationCount);
            // papers.sort((a, b) => b.year - a.year); // Sort nodes in descending order by year

            if (newTopic) {
                updateVisibleNodes2(papers);
                newTopic = 0;
                // autoZoom()
                // focusOnNodes(currentNodesBeingShown)
            }
            else {
                // addNodesToSimulation(newNodes)
                addNodesToSimulation(papers)
            }
        }
    }

    var mouseover = function (d) {
        tooltip.style("opacity", 1);
        d3.select(this).style("stroke", "black").style("opacity", 1);
    };

    var mousemove = function (event, d) {
        var [x, y] = d3.pointer(event); // Getting mouse positions

        tooltip
            .html(
                d.title +
                    "<br>" +
                    d.abstract +
                    "<br>citations: " +
                    d.citationCount
            )
            .style("left", x + 70 + "px") // Positioning tooltip with some offsets
            .style("top", y + 400 + "px");
    };

    var mouseleave = function (d) {
        tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart(); // Boost the alpha value to make the simulation more active
        d.fx = d.x; // Fix the position of the node being dragged
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0); // Restore the alpha value to its default
        d.fx = null;
        d.fy = null;
    }

    const drag = d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);



    function updateVisibleNodes2(papers) {
        // Determine the range of nodes to display based on lastNodeIndex
        tickCount = 0;
        const startIdx = lastNodeIndex;
        const endIdx = Math.min(lastNodeIndex + papers_to_show, papers.length); // Limit endIdx to the length of nodes array

        // Update lastNodeIndex for the next zoomed
        lastNodeIndex = endIdx;

        // Get the nodes to display
        // const visibleNodes = papers.slice(startIdx, endIdx);
        const visibleNodes = papers.slice(0, papers.length);

        const updatedNodesWithRadius = addRadius(visibleNodes);
        currentNodesBeingShown = updatedNodesWithRadius;

        updateCurrentEdges(updatedNodesWithRadius);

        updateGraph2(currentNodesBeingShown);

        // resizeSVGToFitNodes()
    }

    function updateCurrentEdges(visibleNodes) {
        currentVisibleEdges = edges.filter((edge) => {
            // Check if the source and target of the edge exist in visibleNodes based on the id field
            return (
                visibleNodes.some((node) => node.id === edge.source) &&
                visibleNodes.some((node) => node.id === edge.target)
            );
        });
    }

    function addRadius(visibleNodes) {
        return visibleNodes.map((paper) => ({
            id: paper.paperId,
            radius: Math.log(paper.citationCount + 1) * 2 * scaleFactor + 5, // i add one just to ensure we never have
            ...paper,
        }));
    }

    let simulation;
    function makeSimulation(visibleNodes, centerX, centerY) {
        let y_offset = 200;

        simulation = d3
            .forceSimulation(visibleNodes) // Start with your papers as nodes
            .force(
                "link",
                d3
                    .forceLink(currentVisibleEdges)
                    .id((d) => d.id)
                    .distance(100)
            ) // Set desired link distance here

            // .force("charge", d3.forceManyBody())
            .force("charge", d3.forceManyBody().strength(-20))
            .force(
                "center",
                d3.forceCenter(
                    isFirstRender ? width / 2 : centerX,
                    isFirstRender ? height / 2 : centerY //+ y_offset
                )
            )
            .on("tick", ticked);
    }

    function addNodesToSimulation(newNodes) {
   
        const visibleNodes = currentNodesBeingShown.concat(newNodes);
        updateVisibleNodes2(visibleNodes);
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;


    function ticked() {

        const nodes = simulation.nodes();
        nodes.forEach(function(d) {
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) maxY = d.y;
    });
    // Update circle positions
    circlesGroup
        .selectAll("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

    // Update text (label) positions
    circlesGroup
        .selectAll("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 15); 

    // Update link positions
    linkGroup
        .selectAll(".link")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
   
    // Start deceleration after 100 ticks
    if (tickCount > 100) {
        const dynamicDamping = baseDamping * Math.sqrt(tickCount - 100);
        const effectiveDamping = Math.min(dynamicDamping, maxDamping);
        
        nodes.forEach(d => {
            if (d.edges && d.edges.length === 0) {
                d.vx *= (1 - effectiveDamping);  // Dampen the x velocity
                d.vy *= (1 - effectiveDamping);  // Dampen the y velocity
            }
        });

        // Check if velocities are near zero and run `focusOnNodes()`
        let totalVelocity = 0;
        nodes.forEach(node => {
            totalVelocity += Math.abs(node.vx) + Math.abs(node.vy);
        });

        const threshold = 10;  // Adjust this value based on your specific scenario
        if (totalVelocity < threshold) {
            // focusOnNodes();
            resizeSVGToFitNodes(minX, minY, maxX, maxY);
        }
    }

    tickCount++;
}

    function updateCoordinatesMap(
        visibleNodes,
        visibleWidth,
        visibleHeight,
        visibleX,
        visibleY
    ) {
        visibleNodes.forEach((node) => {
            let coords = coordinatesMap.get(node.id);
            coords = {
                cx: visibleX + randomExcludingZero() * visibleWidth,
                cy: visibleY + randomExcludingZero() * visibleHeight,
                radius: node.radius, // / previousZoomScale,
            };
            coordinatesMap.set(node.id, coords);
        });
        isFirstRender = false; // Reset the isFirstRender flag after updating
    }

    function updateGraph2(visibleNodes) {
        // Initialize the circles group if it doesn't already exist
        // initializeZoom();
        initializeGroups();

        // Get the visible window properties
        const { visibleWidth, visibleHeight } = getVisibleWindow();

        const { centerX, centerY } = getVisibleCenter();

        updateCoordinatesMap(
            visibleNodes,
            visibleWidth,
            visibleHeight,
            centerX,
            centerY
        );

        // Set up the data join for the circles
        const circles = setUpDataJoin(visibleNodes);
        updateLabels(visibleNodes);

        // Handle the exit, update, and enter selections
        handleExitUpdateEnterSelections(circles);

        // simulation.nodes(visibleNodes).alpha(1).restart();
        makeSimulation(visibleNodes, centerX, centerY);
        setUpEdges();


        // focusOnNodes() 
    }

    let mainGroup;
    function initializeGroups() {
        if (!mainGroup) {
            mainGroup = svg.append("g").attr("id", "main-group");
        }

        if (!linkGroup) {
            linkGroup = mainGroup.append("g").attr("id", "links-group");
        } else {
            linkGroup = mainGroup.select("#links-group");
        }

        if (!circlesGroup) {
            circlesGroup = mainGroup.append("g").attr("id", "circles-group");
        } else {
            circlesGroup = mainGroup.select("#circles-group");
        }
    }

    let coordinatesMap = new Map();
    let isFirstRender = true;

    function randomExcludingZero() {
        let r;
        do {
            r = 2 * Math.random() - 1; // This will give a number between -1 and 1
        } while (-0.000001 < r && r < 0.000001); // Replace 0.000001 with a tolerance level of your choosing
        return r;
    }

    let isProgrammaticZoom = false;
   



    function setUpDataJoin(visibleNodes) {
        // Call the updateCoordinatesMap function before proceeding
        let circles = circlesGroup
            .selectAll("circle")
            .data(visibleNodes, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append("circle")
                        .attr("r", (d) => coordinatesMap.get(d.id).radius)
                        .attr("cx", (d) => coordinatesMap.get(d.id).cx)
                        .attr("cy", (d) => coordinatesMap.get(d.id).cy)
                        .style("fill", "blue")
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)
                        .attr("opacity", 0),
                (update) => update,
                (exit) =>
                    exit.transition().duration(300).attr("opacity", 0).remove()
            );

        circlesGroup.selectAll("circle").on("click", circleClicked);
        // Add drag behavior outside of the join function
        circles.call(drag);

        // Apply transition separately
        circles.transition().duration(300).attr("opacity", 0.6);

        return circles;
    }

    function setUpEdges() {
        // First, always clear out any previous links (optional, depending on your needs)
        linkGroup.selectAll(".link").remove();

        const links = linkGroup
            .selectAll(".link")
            .data(currentVisibleEdges)
            .enter()
            .append("line")
            .attr("class", "link")
            .style("stroke", "#999")
            .style("stroke-width", 2);

        // linkGroup.selectAll(".link").lower();
    }


    function updateLabels(nodesToShow) {
        // 1. Data join; associating the data with the text elements.
        let textElements = circlesGroup
            .selectAll(".node-label")
            .data(nodesToShow, (d) => d.id);

        // 2. Remove old elements as needed.
        textElements.exit().remove();

        // 3. Create new elements as needed.
        let enterText = textElements
            .enter()
            .append("text")
            .classed("node-label", true)
            .attr("fill", "black")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle");

        // 4. Update old elements as needed, merge with new elements.
        textElements = enterText.merge(textElements);
        textElements
            .text((d) => `${d.title} (${d.year})`)
            .attr("x", (d) => coordinatesMap.get(d.id).cx)
            .attr(
                "y",
                (d) =>
                    coordinatesMap.get(d.id).cy +
                    coordinatesMap.get(d.id).radius +
                    5
            ) // Adjusting vertical position based on the node's radius
            // .text((d) => `${getLastName(d.authors[0].name)} (${d.year})`);
            .text(d => {
  // Check if 'authors' exists and has at least one entry
  if (Array.isArray(d.authors) && d.authors.length > 0 && d.authors[0].name) {
    return `${getLastName(d.authors[0].name)} (${d.year})`;
  } else {
    // Provide a default value if the condition is not met
    return `Unknown Author (${d.year})`;
  }
});

    }

    function getVisibleCenter() {
        const { x, y, k } = d3.zoomTransform(svg.node());

        const centerX = (-x + width / 2) / k;
        const centerY = (-y + height / 2) / k;
        return { centerX, centerY };
    }

    function getVisibleWindow() {
        // const { x, y, k } = currentTransform;
        const { x, y, k } = d3.zoomTransform(svg.node());

        const visibleWidth = width / (k * 2);
        const visibleHeight = height / (k * 2);

        // Calculate the transformed width of the SVG to determine the rightmost boundary
        const transformedWidth = width * k;


        if (!isFirstRender) {
            counter
                .attr("x", x + transformedWidth - 10) // 10 units padding from the right
                .attr("y", y + 10); // 10 units padding from the top
        }
        // updateCounter();
        return { visibleWidth, visibleHeight };
    }

    function handleExitUpdateEnterSelections(circles) {
        const exitSelection = circles.exit();

        const exitTransition = exitSelection
            .transition()
            .duration(300)
            .attr("opacity", 0);

        exitTransition.remove();
    }

    function circleClicked(event, d) {
        // Determine the connected nodes
        const connectedNodes = new Set();
        currentVisibleEdges.forEach((edge) => {
            if (edge.source.id === d.id) {
                connectedNodes.add(edge.target);
            } else if (edge.target.id === d.id) {
                connectedNodes.add(edge.source);
            }
        });

        // Remove any existing highlights
        circlesGroup
            .selectAll("circle")
            .style("fill", "blue")
            .classed("active", false)
            .classed("connected", false);
        linkGroup
            .selectAll(".link")
            .style("stroke", "#999")
            .classed("active", false);

        // Highlight the clicked circle
        d3.select(this).classed("active", true).style("fill", "#ff4500");

        // Highlight the links connected to the clicked circle
        linkGroup
            .selectAll(".link")
            .filter((link) => link.source === d || link.target === d)
            .classed("active", true)
            .style("stroke", "#ff4500");

        // Highlight all circles connected to the clicked circle
        circlesGroup
            .selectAll("circle")
            .filter((node) => connectedNodes.has(node))
            .classed("connected", true)
            .style("fill", "#ff4500");
    }

   function zoomed(event) {
    // Log for debugging purposes
    if (isProgrammaticZoom) {
      isProgrammaticZoom = false;
      return;  // Ignore this zoom event
   }
    // Get current transform from the passed event
    const transform = event.transform;

    // Only proceed if both circlesGroup and linkGroup are defined
    if (circlesGroup && linkGroup) {
        // Apply the transform to scale nodes and links to the current zoom level
        circlesGroup.attr("transform", transform.toString());
        linkGroup.attr("transform", transform.toString());
    } else {
        console.warn("Either circlesGroup or linkGroup (or both) are not defined. Skipping zoom transformation.");
    }

    // Update the simulation if it exists
    if (simulation) {
        simulation.alphaTarget(0.3).restart();
    }



}

function resizeSVGToFitNodes(minX, minY, maxX, maxY) {
    const padding = 40;
    const yoffset = 50
    // Calculate new width and height with padding
    const newWidth = maxX - minX + 2 * padding;
    const newHeight = maxY - minY + 2 * padding + yoffset

    // Select the rectangle and set its width and height to the SVG's current size
    d3.select('svg rect').attr('width', width).attr('height', height);

    // Start the transition
    d3.select('svg rect')
    .transition()   
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('width', newWidth)
        .attr('height', newHeight)
        
        // adjustSVGPositionAndSize()
}


function adjustSVGPositionAndSize() {
  // Select the SVG element by its unique ID
  const svgElement = d3.select("#bubble-graph").node();

  // Now select the parent element by its class
  const parentElement = d3.select(".bubble-component").node();

  if (svgElement && parentElement) {
    const bbox = svgElement.getBoundingClientRect();
    const parentWidth = parentElement.clientWidth;
    const aspectRatio = bbox.width / bbox.height;
    let newWidth = bbox.width;
    let newHeight = bbox.height;

    // Check if the SVG element overflows the parent component
    if (bbox.right > parentElement.getBoundingClientRect().right) {
      newWidth = parentWidth - (bbox.left - parentElement.getBoundingClientRect().left);
      newHeight = newWidth / aspectRatio;

      // Adjust the width and height attributes of the SVG element
      svgElement.setAttribute('width', newWidth);
      svgElement.setAttribute('height', newHeight);

      // If you are using viewBox, update it to match the new dimensions
      // svgElement.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);

      // Assuming you have a D3 force simulation, re-center it and restart
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(1).restart();
    }
  }
}














    function getLastName(author) {
    // Split the name by space
    let nameParts = author.split(' ');

    // Return the last part
    return nameParts[nameParts.length - 1];
}
    onMount(() => {
        // ({ width, height } = getViewportDimensions());
        width = 500
        height = 500

        
        svgWidth  = width + margin.left + margin.right;
      svgHeight = height + margin.top + margin.bottom;

        if (svgContainer) {
            svg = d3
                .select(svgContainer) // selecting the container div instead of 'body'
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id", "bubble-graph") // Give a unique ID to your SVG for easy selection

            // Set the old paper color as the background
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "#FDF5E6");


                zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", zoomed);




            counter = svg
                .append("text")
                .attr("class", "counter")
                .attr("font-size", "14px")
                .attr("alignment-baseline", "hanging") // This ensures the text is anchored from the top
                .attr("text-anchor", "end"); // This ensures the text is anchored from the end (right)

            tooltip = d3
                .select("body") // select the body for the tooltip
                .append("div") // create a div element in the body
                .style("opacity", 0) // initially it should be transparent
                .attr("class", "tooltip") // assign a class for styling
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");


                
            // Initial check
    // adjustSVGPositionAndSize();

// Set up a resize event listener
// window.addEventListener('resize', adjustSVGPositionAndSize);

// Cleanup the event listener on component destroy
return () => {
//   window.removeEventListener('resize', adjustSVGPositionAndSize);
};
        }

        
    });
</script>


<!-- This is not a component but a div element in your component's HTML -->
<div bind:this={svgContainer} />
{#if papers}

<div style="font-size: 10px">
<code >{papers?.length} papers from the last three years on </code><b>{$current_topic}</b>
</div>
{/if}

<style>
    circle.active,
    circle.connected {
        /* fill: #ff4500;  Highlight the active and connected circles with a bright color
   */
        fill: #ff4500 !important;
    }

    .link.active {
        /* stroke: #ff4500;  Highlight active links with a bright color */
        stroke: #ff4500 !important;
    }
</style>
