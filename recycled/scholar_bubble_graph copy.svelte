<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { getViewportDimensions } from "../support/dimensions.js";
    import { scholar_json } from "../support/store.js";
    import { scholar_json_edges , current_input} from "../support/store.js";


    let svgContainer;
    let currentZoomScale = 1;
    let currentZoomTranslate = { x: 0, y: 0 };
    let width, height;
    let nodes;
    let simulation;
    let papers;
    let edges;
    let scaleFactor = 2;
    // Set up SVG with zooming capability
    let svg;
    let tooltip;

    $: {
        if ($scholar_json && scholar_json_edges) {
            papers = [...$scholar_json];
            edges = [...$scholar_json_edges];
            // Sort papers by citation count in descending order
            papers.sort((a, b) => b.citationCount - a.citationCount);
            console.log("papers", papers);
            initiateSimulation();
        }
    }

    // Set up simulation
    function initiateSimulation() {
        if (svg) {
            initiateGraph();
            startSimulation();
            updateGraph(nodes.slice(0, 10));
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

        const circles = svg
            .append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", (d) => {
                return d.radius;
            }) // Set their propertie
            .attr("opacity", 1)
            .style("fill", function (d) {
                return myColor(yearScale(d.year));
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }
    // Prepare nodes data from papers

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
    }

    // Truncate text function
    function truncate(str, maxLength) {
        return str.length > maxLength
            ? str.substr(0, maxLength - 1) + "…"
            : str;
    }
    function updateGraph(nodesToShow) {
        // Bind data

        // Select all circles and bind new data
        let nodeElements = svg
            .selectAll("circle")
            .data(nodesToShow, (d) => d.id);

        // Enter new nodes
        nodeElements
            .enter()
            .append("circle")
            .attr("r", (d) => d.radius)
            .attr("opacity", 0.6)
            .attr("fill", "blue")
            .merge(nodeElements) // Merges the enter selection with the update selection
            .attr("r", (d) => d.radius); // Any other attribute updates can go here

        // Remove old nodes
        nodeElements.exit().remove();

        let textElements = svg.selectAll("text").data(nodesToShow, (d) => d.id);
        // Exit
        nodeElements.exit().remove();
        textElements.exit().remove();

        // Enter
        const newNodeElements = nodeElements
            .enter()
            .append("circle")
            .attr("r", (d) => {
                return d.radius;
            })
            .attr("opacity", 0.6)
            .attr("fill", "blue");

        const newTextElements = textElements
            .enter()
            .append("text")
            // .text((d) => `${d.title} (${d.year})`)
            .text((d) => truncate(`${d.title} (${d.year})`, 18)) // Truncate to a suitable length

            .attr("fill", "black")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("dy", (d) => d.radius / 3);

        // Merge
        nodeElements = newNodeElements.merge(nodeElements);
        textElements = newTextElements.merge(textElements);

        if (simulation) {
            simulation.nodes(nodesToShow).alpha(1).restart();
        }
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

<!-- This is not a component but a div element in your component's HTML -->
<div bind:this={svgContainer} />
