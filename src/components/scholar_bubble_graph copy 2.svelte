<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { getViewportDimensions } from "../support/dimensions.js";
    import { scholar_json } from "../support/store.js";
    import { scholar_json_edges } from "../support/store.js";

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
    let mouseX = 1;
    let mouseY = 1;
    let counter = 0;
    let minYear;
    let maxYear;

    $: {
        if ($scholar_json.length === 0) {
            newTopic = 1;
        }
    }

    $: {
        if ($scholar_json) {
            // && scholar_json_edges) {
            papers = [...$scholar_json];
            edges = [...$scholar_json_edges];
            // papers.sort((a, b) => b.citationCount - a.citationCount);
            papers.sort((a, b) => b.year - a.year); // Sort nodes in descending order by year
            console.log("papers", papers);

            if (svg) {
            }

            if (newTopic) {
                updateVisibleNodes2();
                console.log("starting new d3 graph");
                newTopic = 0;
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

    let previousZoomScale = 1; // Initial zoom scale
    let currentTransform = d3.zoomIdentity; // Initial

    function updateCounter() {
        maxYear = d3.max(currentNodesBeingShown, (d) => d.year) || 0;
        minYear = d3.min(currentNodesBeingShown, (d) => d.year) || 0;

        counter.text(`${minYear} - ${maxYear}`);
    }

    function updateVisibleNodes2() {
        // Determine the range of nodes to display based on lastNodeIndex
        const startIdx = lastNodeIndex;
        const endIdx = Math.min(lastNodeIndex + 20, papers.length); // Limit endIdx to the length of nodes array

        // Update lastNodeIndex for the next zoom
        lastNodeIndex = endIdx;

        // Get the nodes to display
        const visibleNodes = papers.slice(startIdx, endIdx);
        const updatedNodesWithRadius = addRadius(visibleNodes);
        currentNodesBeingShown = updatedNodesWithRadius;

        updateGraph2(currentNodesBeingShown);
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
        let y_offset = 200
        
        simulation = d3
            .forceSimulation(visibleNodes) // Start with your papers as nodes
            // .force("link", d3.forceLink(edges).id(d => d.id))
            // .force("charge", d3.forceManyBody())
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(isFirstRender? width / 2 : centerX, isFirstRender? height / 2 + y_offset : centerY + y_offset))
            .on("tick", ticked);
    }

    function ticked() {
        // Update circle positions
        circlesGroup
            .selectAll("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);

        // Update text (label) positions
        circlesGroup
            .selectAll("text")
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("y", (d) => d.y + 15); // Move the label 15 units below the circle's center
    }

    function updateGraph2(visibleNodes) {
        // Initialize the circles group if it doesn't already exist
        initializeZoom();
        initializeCirclesGroup();

        // Get the visible window properties
        const { visibleWidth, visibleHeight } = getVisibleWindow();

        const { centerX, centerY } = getVisibleCenter();

        updateCoordinatesMap(
            visibleNodes,
            visibleWidth,
            visibleHeight,
            centerX,
            centerY,
            previousZoomScale
        );

        // Set up the data join for the circles
        const circles = setUpDataJoin(visibleNodes);
        updateLabels(visibleNodes);

        // Handle the exit, update, and enter selections
        handleExitUpdateEnterSelections(circles);

        // simulation.nodes(visibleNodes).alpha(1).restart();
        makeSimulation(visibleNodes, centerX, centerY)

    }

    function initializeZoom() {
        svg.call(d3.zoom().on("zoom", zoomed)); // appending a 'g' element to
    }

    let mainGroup;
    function initializeCirclesGroup() {
        if (!mainGroup) {
            mainGroup = svg.append("g").attr("id", "main-group");
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

    function updateCoordinatesMap(
        visibleNodes,
        visibleWidth,
        visibleHeight,
        visibleX,
        visibleY,
        previousZoomScale
    ) {
        console.log(
            `visibleNodes,
    visibleWidth,
    visibleHeight,
    visibleX,
    visibleY,
    previousZoomScale`,
            visibleNodes,
            visibleWidth,
            visibleHeight,
            visibleX,
            visibleY,
            previousZoomScale
        );

        visibleNodes.forEach((node) => {
            let coords = coordinatesMap.get(node.id);
            coords = {
                cx: visibleX + randomExcludingZero() * visibleWidth,
                cy: visibleY + randomExcludingZero() * visibleHeight,
                radius: node.radius // / previousZoomScale,
            };
            coordinatesMap.set(node.id, coords);
        });
        isFirstRender = false; // Reset the isFirstRender flag after updating
    }

    function setUpDataJoin(visibleNodes) {
        // Call the updateCoordinatesMap function before proceeding
        return circlesGroup
            .selectAll("circle")
            .data(visibleNodes, (d) => d.id)
            .join(
                (enter) =>
                    enter
                        .append("circle")
                        .attr("r", (d) => coordinatesMap.get(d.id).radius)///previousZoomScale)
                        .attr("cx", (d) => coordinatesMap.get(d.id).cx)
                        .attr("cy", (d) => coordinatesMap.get(d.id).cy)
                        .style("fill", "blue")
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseleave", mouseleave)
                        .attr("opacity", 0) // Set initial opacity to 0
                        .transition() // Create a transition
                        .duration(300) // Now set the duration on the transition
                        .attr("opacity", 0.6), // Animate opacity to 0.6
                (update) => update,
                (exit) =>
                    exit.transition().duration(300).attr("opacity", 0).remove()
            );
    }
    function updateLabels(nodesToShow) {
        console.log("nodesToShow", coordinatesMap, nodesToShow);

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
            .text((d) => `${truncateTitle(d.title, 5)} (${d.year})`);

        console.log("textElements", textElements);
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

        if (isFirstRender) {
            counter
                .attr("x", x + transformedWidth - 10) // 10 units padding from the right
                .attr("y", y + 10); // 10 units padding from the top
        }
        updateCounter();
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

    let zoomDict = {};
    let zoomDepth = 0;
    let maxZoomDepth = 5;

    function zoomed(event) {
        const currentZoomScale = event.transform.k;
        [mouseX, mouseY] = d3.pointer(event);
        currentTransform = event.transform;
        // circlesGroup.attr("transform", event.transform);
        mainGroup.attr("transform", event.transform);

        const gridSize = 10 * event.transform.k;
        d3.select("#grid")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .select("rect")
            .attr("width", gridSize)
            .attr("height", gridSize);

        const apparentRadiusThreshold = 150;
        const hasLargeNode = currentNodesBeingShown.some((node) => {
            let coords = coordinatesMap.get(node.id);
            let radius = coords && coords.radius ? coords.radius : node.radius;
            return radius * currentZoomScale > apparentRadiusThreshold;
        });

        if (currentZoomScale > previousZoomScale && hasLargeNode) {
            if (zoomDepth < maxZoomDepth) {
                const rounded_zoom = Math.round(previousZoomScale * 10) / 10;

                zoomDict[rounded_zoom] = {
                    nodes: currentNodesBeingShown,
                    years: `${minYear} - ${maxYear}`,
                }; // store the currentNodesBeingShown
                updateVisibleNodes2();
                zoomDepth++;
            } else {
                console.log("Maximum zoom depth reached");
            }
        } else if (currentZoomScale < previousZoomScale) {
            if (zoomDepth >= 0) {
                const rounded_zoom = Math.round(currentZoomScale * 10) / 10;
                console.log("MOOOOOO  rounded_zoom", rounded_zoom, zoomDict);
                if (rounded_zoom in zoomDict) {
                    currentNodesBeingShown = zoomDict[rounded_zoom].nodes; //

                    updateGraph2(currentNodesBeingShown);
                    zoomDepth--;
                }
            } else {
                console.log("Initial zoom level reached");
            }
        }

        previousZoomScale = currentZoomScale;
    }

    // Truncate text function
    function truncateTitle(title, maxLength) {
        return title.length > maxLength
            ? title.substr(0, maxLength - 1) + "…"
            : title;
    }
    onMount(() => {
        ({ width, height } = getViewportDimensions());

        if (svgContainer) {
            svg = d3
                .select(svgContainer) // selecting the container div instead of 'body'
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            // Set the old paper color as the background
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "#FDF5E6");

            // Grid pattern
            svg.append("defs")
                .append("pattern")
                .attr("id", "grid")
                .attr("width", 10)
                .attr("height", 10)
                .attr("patternUnits", "userSpaceOnUse")
                .append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("stroke", "lightgray")
                .attr("fill", "none")
                .attr("stroke-width", 0.5);

            // Apply the grid on top of the old paper background
            svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "url(#grid)");

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
        }
    });
</script>

GRAPH
<!-- This is not a component but a div element in your component's HTML -->
<div bind:this={svgContainer} />
