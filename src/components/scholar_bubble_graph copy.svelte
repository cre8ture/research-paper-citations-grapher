<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { getViewportDimensions } from "../support/dimensions.js";
    import { scholar_json } from "../support/store.js";
    import { scholar_json_edges } from "../support/store.js";

    let svgContainer;
    let currentZoomScale = 1;
    let currentZoomTranslate = { x: 0, y: 0 };
    let width, height;
    let nodes;
    let currentNodesBeingShown;
    let simulation;
    let papers;
    let edges;
    let scaleFactor = 2;
    // Set up SVG with zooming capability
    let svg;
    let tooltip;
    let previousZoomScale = 1; // Add this line near the top of your script with other variable declarations.
    let newTopic = 0 // this will need to be changed eventually
    let zoomLevels = [];

    $:{  if($scholar_json.length === 0)
            {
                newTopic = 1
            }
        }

   
    $: {
        if ($scholar_json && scholar_json_edges) {

            papers = [...$scholar_json];
            edges = [...$scholar_json_edges];
            // Sort papers by citation count in descending order
            papers.sort((a, b) => b.citationCount - a.citationCount);
            console.log("papers", papers);

            // get all data ready as it comes in [but we dont show the data yet]
            if(svg)
            {
             initiateGraph();
            }

            if(newTopic){
                console.log("starting new d3 graph")
            initiateSimulation();
            newTopic = 0
        }
    }
    }


    // Set up simulation
    function initiateSimulation() {
        if (svg) {
            // initiateGraph();
            startSimulation();
            // updateGraph(nodes.slice(0, 10));
            currentNodesBeingShown = nodes.slice(0,10)
            // updateGraph(currentNodesBeingShown);
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
    let circlesGroup = null;  // This will hold the reference to your circles group
    let circlesGroup = null;  // This will hold the reference to your circles group

function initiateGraph() {
    // Prepare nodes data from papers
    nodes = papers.map((paper) => ({
        id: paper.paperId,
        radius: Math.log(paper.citationCount + 1) * 2 * scaleFactor,
        ...paper,
    }));

    const minYear = d3.min(nodes, (d) => d.year);
    const maxYear = d3.max(nodes, (d) => d.year);

    const yearScale = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([1, 100]);

    const myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateBrBG)
        .domain(yearScale.range());

    // Then to use:
    nodes.forEach((node) => {
        const year = node.year;
        node.color = myColor(yearScale(year));
    });

    // Check if the circles group already exists, if not create it
    if (!circlesGroup) {
        circlesGroup = svg.append("g").attr("id", "circles-group");
    } else {
        circlesGroup = svg.select("#circles-group");
    }

    const circles = circlesGroup
        .selectAll("circle")
        .data(nodes, d => d.id)  // Assuming each node has a unique id
        .join(
            enter => enter.append("circle")
                .attr("r", d => d.radius)
                .attr("opacity", 1)
                .style("fill", "blue")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave),
            update => update,  // Optional: apply any updates to existing circles here
            exit => exit.remove()  // Remove any circles no longer in the data
        );
}

    // Bounding force to keep nodes within the SVG bounds
    function boundingBoxForce() {
        for (let node of nodes) {
            node.x = Math.max(
                node.radius,
                Math.min(width - node.radius, node.x)
            );
            node.y = Math.max(
                node.radius,
                Math.min(height - node.radius, node.y)
            );
        }
    }

    function startSimulation() {
        //Then, include this force in your simulation
        simulation = d3
            .forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-120))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("bounding_box", boundingBoxForce) // custom bounding box force
            .on("tick", ticked);
    }

    function ticked() {
        // Adjust positions considering the current scale and translation
        svg.selectAll("circle")
            .attr("cx", (d) => currentZoomTranslate.x + d.x * currentZoomScale)
            .attr("cy", (d) => currentZoomTranslate.y + d.y * currentZoomScale);

        svg.selectAll("text")
            .attr("x", (d) => currentZoomTranslate.x + d.x * currentZoomScale)
            // .attr("y", (d) => currentZoomTranslate.y + d.y * currentZoomScale);
            .attr(
                "y",
                (d) =>
                    currentZoomTranslate.y +
                    d.y * currentZoomScale +
                    d.radius / 3
            ); // Adjust the additional space as per the same value you added above
    }

    function handleZoom(event) {
        // console.log("event", event);
        // D3's event system allows us to get the current transform directly
        const currentTransform = event.transform;

        // Now we can destructure and use these values
        const { k: scale, x, y } = currentTransform;

        // Continue with your function as before...

        currentZoomScale = scale;
        currentZoomTranslate.x = x;
        currentZoomTranslate.y = y;

        svg.attr("transform", `translate(${x},${y}) scale(${scale})`);

        const adjustedStrength = -120 / scale; // Reducing repulsion as we zoom in
        simulation.force(
            "charge",
            d3.forceManyBody().strength(adjustedStrength)
        );

        simulation.alpha(0.3).restart();

        ////////////////////////////////////////////////////////////////////////
        console.log(
            "scale",
            Math.floor(currentZoomScale),
            Math.floor(previousZoomScale)
        );
        // Check zoom level to decide if more nodes should be shown

        if (Math.floor(currentZoomScale) > Math.floor(previousZoomScale)) {
        // ... existing code ...
        const additionalNodesCount =
                calculateAdditionalNodesCount(currentZoomScale); 

        updateGraphWithMoreNodes(additionalNodesCount);
    } else if (Math.floor(currentZoomScale) < Math.floor(previousZoomScale)) {
        // Zooming out, remove nodes
        updateGraphWithFewerNodes();
    }
        // Update the previous zoom scale for the next zoom event
        previousZoomScale = currentZoomScale;
    }

    function updateGraphWithMoreNodes(additionalNodesCount) {
        // Get the next set of nodes based on citation count or some other criteria
        const moreNodes = getMoreNodes(additionalNodesCount);

        zoomLevels.push([...currentNodesBeingShown]);

        // Merge the new nodes with the existing nodes
        // nodes = [...nodes, ...moreNodes];
        currentNodesBeingShown = [...currentNodesBeingShown.slice(7,10), ...moreNodes];


        console.log("i am new currentNodesBeingShown", currentNodesBeingShown)

        // Update the graph with the new set of nodes
        updateGraph(currentNodesBeingShown);
    }

    function getMoreNodes(additionalNodesCount) {
        // Assume papers is sorted in descending order of citation count
        const alreadyShownCount = currentNodesBeingShown.length;
        const nextSetOfNodes = papers.slice(
            alreadyShownCount,
            alreadyShownCount + additionalNodesCount
        );

        return nextSetOfNodes.map((paper) => ({
            id: paper.paperId,
            radius: Math.log(paper.citationCount + 1) * 2 * scaleFactor,
            ...paper,
        }));
    }

    
    function updateGraphWithFewerNodes() {
    if (zoomLevels.length > 0) {
        // Pop the last set of nodes off the stack
        currentNodesBeingShown = zoomLevels.pop();
        // Update the graph with the previous set of nodes
        updateGraph(currentNodesBeingShown);
    }
}

function calculateAdditionalNodesCount(currentZoomScale) {
        // Implement logic to decide how many more nodes to show
        // For example, show 10 more nodes for every increase in zoom level
        return 10 * Math.floor(currentZoomScale);
    }

    
    /////////////////////////////////////////////////////////////////////////////////

    // Truncate text function
    function truncate(str, maxLength) {
        return str.length > maxLength
            ? str.substr(0, maxLength - 1) + "…"
            : str;
    }
    function updateGraph(nodesToShow) {

        // NODES
        // 1. Data join; associating the data with the circle elements.
        let nodeElements = svg
            .selectAll("circle")
            .data(nodesToShow, (d) => d.id);

        // 2. Remove old elements as needed.
        nodeElements.exit().remove();

        // 3. Create new elements as needed.
        let enterNodes = nodeElements
            .enter()
            .append("circle")
            .attr("opacity", 0.6)
            .attr("fill", "blue");

        // 4. Update old elements as needed, merge with new elements.
        nodeElements = enterNodes.merge(nodeElements);
        nodeElements.attr("r", (d) => d.radius);

        // LABELS
        // 1. Data join; associating the data with the text elements.
        let textElements = svg.selectAll("text").data(nodesToShow, (d) => d.id);

        // 2. Remove old elements as needed.
        textElements.exit().remove();

        // 3. Create new elements as needed.
        let enterText = textElements
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em"); // Adjust for vertical alignment

        // 4. Update old elements as needed, merge with new elements.
        textElements = enterText.merge(textElements);
        textElements
            .text((d) => `${d.title} (${d.year})`) // Assuming d.title and d.year are actual attributes
            .attr("x", (d) => d.x) // Assuming the simulation updates 'x' and 'y'
            .attr("y", (d) => d.y);

        // SIMULATION
        // If there's a simulation running, you might need to update the forces/tick function.
        if (simulation) {
            simulation.nodes(nodesToShow).alpha(1).restart();

            // Update the 'tick' function if necessary to account for new nodes/labels.
            simulation.on("tick", () => {
                nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y); // Update circle positions
                textElements.attr("x", (d) => d.x).attr("y", (d) => d.y); // Update text positions
            });
        }

        svg.call(
            d3.zoom().on("zoom", (event) => {
                handleZoom(event);
            })
        );
    }

    onMount(() => {
        ({ width, height } = getViewportDimensions());

        if (svgContainer) {
            // making sure our container is available
            // Create the SVG element inside the container
            svg = d3
                .select(svgContainer) // selecting the container div instead of 'body'
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(
                    d3.zoom().on("zoom", (event) => {
                        handleZoom(event);
                    })
                )

                .append("g"); // appending a 'g' element to our

            // At the top level of your script, not inside any function
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

            // Ensure this part runs after the initial render, so the SVG is in the DOM.
            setTimeout(() => {
                if (papers) {
                    initiateSimulation();
                }
            }, 0);
        }
    });
</script>

GRAPH
<!-- This is not a component but a div element in your component's HTML -->
<div bind:this={svgContainer} />
