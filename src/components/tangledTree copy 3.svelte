<!-- TreeChart.svelte -->
<script>
    import { onMount, afterUpdate } from "svelte";
    import * as d3 from "d3";
    import {tangled_tree_json} from "../support/store.js"
let minHeight = 400;
    let minWidth = 600;

    let svgHeight;

    // afterUpdate(() => {
    //     svgHeight = d3.select("#svg-tangle").attr("height");
    //     console.log("AFTER", svgHeight);
    // });

    const sampleDat = {
        name: "Machine Learning",
        children: [
            {
                name: "hello this is mr turd what is your name i am a boo boo turd. hello moosr!",
                children: [
                    {
                        name: "cluster",
                        children: [
                            { name: "AgglomerativeCluster", value: 3938 },
                            { name: "CommunityStructure", value: 3812 },
                            { name: "HierarchicalCluster", value: 6714 },
                            { name: "MergeEdge", value: 743 },
                        ],
                    },
                    {
                        name: "graph",
                        children: [
                            { name: "BetweennessCentrality", value: 3534 },
                            { name: "LinkDistance", value: 5731 },
                            { name: "MaxFlowMinCut", value: 7840 },
                            { name: "ShortestPaths", value: 5914 },
                            { name: "SpanningTree", value: 3416 },
                        ],
                    },
                    {
                        name: "optimization",
                        children: [{ name: "AspectRatioBanker", value: 7074 }],
                    },
                ],
            },
            {
                name: "animate a pickle and learn to harmonize with some of dat good old chirpin chicken.",
                children: [
                    { name: "Easing", value: 17010 },
                    { name: "FunctionSequence", value: 5842 },
                    {
                        name: "interpolate",
                        children: [
                            { name: "ArrayInterpolator", value: 1983 },
                            { name: "ColorInterpolator", value: 2047 },
                            { name: "DateInterpolator", value: 1375 },
                            { name: "Interpolator", value: 8746 },
                            { name: "MatrixInterpolator", value: 2202 },
                            { name: "NumberInterpolator", value: 1382 },
                            { name: "ObjectInterpolator", value: 1629 },
                            { name: "PointInterpolator", value: 1675 },
                            { name: "RectangleInterpolator", value: 2042 },
                        ],
                    },
                    { name: "ISchedulable", value: 1041 },
                    { name: "Parallel", value: 5176 },
                    { name: "Pause", value: 449 },
                    { name: "Scheduler", value: 5593 },
                    { name: "Sequence", value: 5534 },
                    { name: "Transition", value: 9201 },
                    { name: "Transitioner", value: 19975 },
                    { name: "TransitionEvent", value: 1116 },
                    { name: "Tween", value: 6006 },
                ],
            },
            {
                name: "data with big fooey. gave me lots of cattle turd and made a fascinating push bug!",
                children: [
                    {
                        name: "converters",
                        children: [
                            { name: "Converters", value: 721 },
                            { name: "DelimitedTextConverter", value: 4294 },
                            { name: "GraphMLConverter", value: 9800 },
                            { name: "IDataConverter", value: 1314 },
                            { name: "JSONConverter", value: 2220 },
                        ],
                    },
                    { name: "DataField", value: 1759 },
                    { name: "DataSchema", value: 2165 },
                    { name: "DataSet", value: 586 },
                    { name: "DataSource", value: 3331 },
                    { name: "DataTable", value: 772 },
                    { name: "DataUtil", value: 3322 },
                ],
            },
            {
                name: "display",
                children: [
                    { name: "DirtySprite", value: 8833 },
                    { name: "LineSprite", value: 1732 },
                    { name: "RectSprite", value: 3623 },
                    { name: "TextSprite", value: 10066 },
                ],
            },
            // ... Other children can be added here
        ],
    };

    let width = 928;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;
    let dx = 20;
    let dy;
    let root; // = d3.hierarchy(data);
    let tree;
    let diagonal;
    let gLink;
    let gNode;
    let svg;
    let svgElement;

    function getMaxTextWidth() {
        const tempText = svg.append("text").attr("class", "tempText");
        let maxTextWidth = 0;

        root.each((node) => {
            const bbox = tempText.text(node.data.name).node().getBBox();
            if (bbox.width > maxTextWidth) {
                maxTextWidth = bbox.width;
            }
        });

        tempText.remove();
        return maxTextWidth;
    }

    function getTextWidth(text, fontSize, fontFamily) {
        // Create a dummy SVG text element
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const textElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        svg.appendChild(textElement);
        document.body.appendChild(svg);

        // Apply the text, font size, and font family to the text element
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("font-family", fontFamily);
        textElement.textContent = text;

        // Measure the text element using getBBox
        const width = textElement.getBBox().width;

        // Clean up by removing the dummy SVG from the document
        document.body.removeChild(svg);

        // Return the measured width
        return width;
    }

    function getTextHeight(text, fontSize, fontFamily) {
        // This function works similarly to getTextWidth
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const textElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        svg.appendChild(textElement);
        document.body.appendChild(svg);

        // Apply the text, font size, and font family to the text element
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("font-family", fontFamily);
        textElement.textContent = text;
        const height = textElement.getBBox().height;
        document.body.removeChild(svg);

        // Return the measured height
        return height;
    }

    function resizeSVG() {
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        root.each((node) => {
            const textWidth = getTextWidth(node.data.name);
            const textHeight = getTextHeight(node.data.name); // You would need to implement this function

            if (node.x - textHeight < minX) minX = node.x - textHeight;
            if (node.x + textHeight > maxX) maxX = node.x + textHeight;
            if (node.y - textWidth < minY) minY = node.y - textWidth;
            if (node.y + textWidth > maxY) maxY = node.y + textWidth;
        });

        const newHeight = maxX - minX + marginTop + marginBottom;
        const newWidth = maxY - minY + marginLeft + marginRight;
        dy = newWidth / (1 + root.height);

        svg.transition()
            .duration(750)
            .attr("height", newHeight)
            .attr("width", newWidth)
            .attr("viewBox", [
                -60, // Adjusted to account for text width
                minX - marginTop - 20, // Adjusted to account for text height
                newWidth,
                newHeight,
            ]);
        // Update the width variable if it's used elsewhere in your code
        width = newWidth;
    }

    let maxWidth = 200;
    let lineHeight = 0.9;
    function wrapText(selection, maxWidth) {
        // Line height, representing the spacing between lines
        const lineHeight = 1.1; // Adjust this value as needed

        selection.each(function () {
            const textElement = d3.select(this);

            const tspans = d3.select(this).selectAll("tspan");
            d3.select(this).attr("lines", tspans.size());

            const words = textElement.text().split(/\s+/).reverse();
            let word;
            let line = [];

            const x = textElement.attr("x");
            const y = textElement.attr("y");
            const originalDy = parseFloat(textElement.attr("dy") || 0);

            // Reset dy to the original value
            let dy = originalDy;
            // Clear the current text content and initialize a new tspan for the first line
            let tspan = textElement
                .text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");

            // Process each word, creating new lines as needed
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));

                // Check if the line exceeds the maximum width
                if (tspan.node().getComputedTextLength() > maxWidth) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];

                    dy = "1";

                    // Create a new tspan for the overflow text
                    tspan = textElement
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em")
                        .text(word);
                }
            }
        });

        // const tspans = d3.select(this).selectAll('tspan');
    }

    function getMaxDimensions(nodes) {
        let maxBottom = 0;
        let maxRight = 0;

        nodes.forEach((d) => {
            // Ensure you have calculated the height of the text properly
            // If you have text line information saved on the nodes, use it to calculate
            const textHeight = d.lines * lineHeight; // Assuming `d.lines` holds the number of lines from wrapText.
            const bottom = d.x + textHeight / 2;
            const right = d.y + d.textWidth / 2; // You need to calculate textWidth when you wrap the text

            if (bottom > maxBottom) maxBottom = bottom;
            if (right > maxRight) maxRight = right;
        });

        return { maxBottom, maxRight };
    }
    // Define the update function
    function update(event, source) {
        const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        function calculateDxForNode(d) {
            return d.data.name.length > 80 ? 50 : 0; // Adjust 50 to your preference
        }

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        // const minHeight = 500; // or any value you deem appropriate
        const height = right.x - left.x + marginTop + marginBottom; // Kai placed 100 offset

        const transition = svg
            .transition()
            .duration(duration)
            .attr("height", height)
            .attr("viewBox", [
                -marginLeft,
                left.x - 20 - marginTop,
                width,
                height + 20,
            ])
            .tween(
                "resize",
                window.ResizeObserver
                    ? null
                    : () => () => svg.dispatch("toggle")
            );

        const node = gNode.selectAll("g").data(nodes, (d) => d.id);

        // const nodeEnter = node
        //     .enter()
        //     .append("g")
        //     .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        //     .attr("fill-opacity", 0)
        //     .attr("stroke-opacity", 0)
        //     .on("click", (event, d) => {
        //         d.children = d.children ? null : d._children;
        //         update(event, d);
        //     });

        const nodeEnter = node
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            // On click event handler
            .on("click", (event, d) => {
                d.children = d.children ? null : d._children;
                update(event, d);

                const textElement = d3
                    .select(event.currentTarget)
                    .select("text");
                if (d.children) {
                    // Node has been expanded
                    // Restore full name and position

                    textElement.text((d) => d.data.name);

                    // const numLines = textElement.selectAll('tspan').size();

                    // Restore full name
                    textElement
                        .attr("dy", (d) => {
                            let words = d.data.name.split(/\s+/);
                            let numOfLines = Math.ceil(
                                words.reduce(
                                    (acc, word) => acc + word.length,
                                    0
                                ) /
                                    (maxWidth / 6)
                            ); // Assuming average character width is 6. Adjust if needed.
                            if (numOfLines > 1) {
                                numOfLines += 1;
                            }
                            return (numOfLines - 1) * -lineHeight + "em"; // Assuming lineHeight of 0.9 from the wrapText function.
                        })

                        // .attr("dy", "0.31em") // Reset dy to the default
                        .attr("x", (d) => (d._children ? -6 : 6)) // Reset x position
                        .attr("text-anchor", (d) =>
                            d._children ? "end" : "start"
                        ); // Reset text-anchor
                    textElement.call(wrapText, maxWidth); // Wrap text according to the specified maxWidth
                    d.truncated = false;
                } else {

                    if (d.data.name.length > 80 || d._children) {
                    // Node has been collapsed
                    // Set truncated text and position
                    textElement
                        .text((d) => {
                            const fullText = d.data.name;
                            return fullText.length > 8
                                ? `${fullText.substring(0, 5)}...`
                                : fullText;
                        })
                        .attr("dy", "0.31em") // Set dy for truncated text
                        .attr("x", -6) // Align the end of the text with the node center
                        .attr("text-anchor", "end"); // Anchor text at the end
                    d.truncated = true;
                }
            }
            });

        nodeEnter
            .append("circle")
            .attr("r", 2.5)
            .attr("fill", (d) => (d._children ? "#555" : "#999"))
            .attr("stroke-width", 10);
        nodeEnter
            .append("text")
            // .attr("dy", "0.31em")
            .attr("dy", (d) => {
                let words = d.data.name.split(/\s+/);
                let numOfLines = Math.ceil(
                    words.reduce((acc, word) => acc + word.length, 0) /
                        (maxWidth / 6)
                ); // Assuming average character width is 6. Adjust if needed.
                if (numOfLines > 1) {
                    numOfLines += 1;
                }
                return (numOfLines - 1) * -lineHeight + "em"; // Assuming lineHeight of 0.9 from the wrapText function.
            })

            .attr("x", (d) => (d._children ? -6 : 6))
            .attr("text-anchor", (d) => (d._children ? "end" : "start"))
            .text((d) => d.data.name);

        // Wrap both the original and the cloned text
        nodeEnter.selectAll("text").call(wrapText, maxWidth);

        // Transition nodes to their new position.
        const nodeUpdate = node
            .merge(nodeEnter)
            .transition(transition)
            .attr("transform", (d) => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node
            .exit()
            .transition(transition)
            .remove()
            .attr("transform", (d) => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path").data(links, (d) => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link
            .enter()
            .append("path")
            .attr("d", (d) => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition).attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit()
            .transition(transition)
            .remove()
            .attr("d", (d) => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Stash the old positions for transition.
        root.eachBefore((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // resizeSVG();
    }

    onMount(() => {
        // Since this code runs on the client, all d3 and DOM related code goes here.
        width = 928;

        root = d3.hierarchy(sampleDat);

        // Define the size of the tree
        dy = (width - marginRight - marginLeft) / (1 + root.height);

        // Initialize the root position for the animation
        root.x0 = dy / 2;
        root.y0 = 0;

        // Process the descendants and configure the initial state
        // root.descendants().forEach((d, i) => {
        //     d.id = i;
        //     d._children = d.children;
        //     // Keep the root and any nodes with 7 letters in their name expanded
        //     if (d.depth && d.data.name.length !== 7) {
        //         d.children = null;
        //     }
        // });

        // Process the descendants and configure the initial state
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            d.data.truncated = false; // All nodes start as not truncated
            // Collapse all nodes except the root and its direct children
            if (d.depth > 1) {
                d.children = null;
            }
        });
        // Initialize the flag in your data processing logic
        root.descendants().forEach((d) => {
            // ... rest of your logic
        });

        // Define the tree layout and the shape for links.
        tree = d3.tree().nodeSize([dx, dy]);
        diagonal = d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x);

        svg = d3
            .select(svgElement) // Select the bound
            .attr("id", "svg-tangle")
            .attr("width", width)
            .attr("height", dx)
            .attr("viewBox", [-marginLeft, -marginTop, width, dx])
            .attr(
                "style",
                "max-width: 100%; height: auto; font: 15px sans-serif; user-select: none;"
            );

        gLink = svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        gNode = svg
            .append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        // Initialize the display
        update(null, root);
    });
</script>

<br />
AI Ideas
<svg bind:this={svgElement} />
