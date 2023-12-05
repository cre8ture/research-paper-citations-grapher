<!-- TreeChart.svelte -->
<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import {
        is_new_tangle_tree_ini,
        is_last_update,
        tangled_tree_json,
    } from "../support/store.js";

    const sampleDat = {
        name: "machine learning",
        children: [
            {
                name: "Using machine learning to discover high-entropy alloys with unique properties",
                children: [
                    {
                        name: "Rao, 2022",
                        value: 96,
                        truncated: false,
                    },
                    {
                        title: "Exploiting symmetry in variational quantum machine learning",
                        name: "Meyer, 2022",
                        children: [
                            {
                                title: null,
                                name: "Ragone, 2022",
                                children: [],
                                truncated: false,
                            },
                            {
                                title: "Challenges and opportunities in quantum machine learning",
                                name: "Cerezo, 2022",
                                children: [
                                    {
                                        title: null,
                                        name: "Ragone, 2022",
                                        children: [],
                                        truncated: false,
                                    },
                                ],
                                truncated: false,
                            },
                        ],
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Applying causal machine learning to scientific modeling of physical systems",
                children: [
                    {
                        name: "Kaddour, 2022",
                        value: 60,
                        truncated: false,
                    },
                    {
                        name: "Takamoto, 2022",
                        value: 57,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Utilizing group-invariant quantum machine learning for encoding and decoding quantum states",
                children: [
                    {
                        title: "Group-Invariant Quantum Machine Learning",
                        name: "Larocca, 2022",
                        children: [
                            {
                                title: null,
                                name: "Ragone, 2022",
                                children: [],
                                truncated: false,
                            },
                            {
                                title: "Challenges and opportunities in quantum machine learning",
                                name: "Cerezo, 2022",
                                children: [
                                    {
                                        title: null,
                                        name: "Ragone, 2022",
                                        children: [],
                                        truncated: false,
                                    },
                                ],
                                truncated: false,
                            },
                        ],
                        truncated: false,
                    },
                    {
                        name: "Schuld, 2022",
                        value: 96,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Enhancing adaptive optics techniques in ground-based telescopes using machine learning",
                children: [
                    {
                        name: "Guo, 2022",
                        value: 13,
                        truncated: false,
                    },
                    {
                        name: "Ma, 2022",
                        value: 71,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
        ],
        truncated: false,
    };

    const sampleDat_1 = {
        name: "machine learning",
        children: [
            {
                name: "Using quantum machine learning to discover high-entropy alloys with unprecedented properties.",
                children: [
                    {
                        name: "Schuld, 2022",
                        value: 48,
                        truncated: false,
                    },
                    {
                        name: "Rao, 2022",
                        value: 8,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Applying causal machine learning to model physical systems and optimize metasurface design.",
                children: [
                    {
                        name: "Kaddour, 2022",
                        value: 25,
                        truncated: false,
                    },
                    {
                        name: "Takamoto, 2022",
                        value: 62,
                        truncated: false,
                    },
                    {
                        name: "Ma, 2022",
                        value: 86,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Developing group-invariant quantum machine learning models for electronic structure calculations.",
                children: [
                    {
                        title: "Group-Invariant Quantum Machine Learning",
                        name: "Larocca, 2022",
                        children: [
                            {
                                title: null,
                                name: "Ragone, 2022",
                                children: [],
                                truncated: false,
                            },
                            {
                                title: "Challenges and opportunities in quantum machine learning",
                                name: "Cerezo, 2022",
                                children: [
                                    {
                                        title: null,
                                        name: "Ragone, 2022",
                                        children: [],
                                        truncated: false,
                                    },
                                ],
                                truncated: false,
                            },
                        ],
                        truncated: false,
                    },
                    {
                        name: "Kulik, 2022",
                        value: 63,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
            {
                name: "Using machine learning to automatically discover orbital mechanics equations and properties from observations.",
                children: [
                    {
                        name: "Lemos, 2022",
                        value: 52,
                        truncated: false,
                    },
                    {
                        name: "Fu, 2022",
                        value: 52,
                        truncated: false,
                    },
                ],
                truncated: false,
            },
        ],
        truncated: false,
    };

    const sanmpleDat2 = {
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

    $: {
        if ($tangled_tree_json) {
            if ($is_new_tangle_tree_ini) {
                is_new_tangle_tree_ini.set(false);
                // updateSvgText();
                d3.select("#svg-tangle").selectAll("*").remove();
                preInitialize();
            }
            // console.log($tangled_tree_json);

            initializeTree($tangled_tree_json);

            // update(null, root);
            update(null, root); //.on('end', checkTextVisibility); // assuming `update()` returns the transition
        }
    }

    let maxWidth = 200;
    let lineHeight = 0.9;
    function wrapText(selection, maxWidth) {
        const lineHeight = 1; // Adjust this value as needed

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

    function parseViewBox(viewBoxString) {
        // This regex matches both positive and negative floats or ints
        const regex = /[+-]?\d+(\.\d+)?/g;
        const values = viewBoxString.match(regex).map(Number);

        // Check if all the necessary parts are present
        if (values.length !== 4) {
            console.error("viewBox does not contain 4 values!");
            return null; // or set a default viewBox if appropriate
        }

        const viewBox = {
            x: values[0],
            y: values[1],
            width: values[2],
            height: values[3],
        };

        return viewBox;
    }

    function adjustViewBoxIfNeeded2(svgSelection, newBBox, time) {
        // const viewBox = svgSelection.attr('viewBox').split(' ').map(Number);

        const currentViewBox = parseViewBox(svgSelection.attr("viewBox")); //) { x: viewBox[0], y: viewBox[1], width: viewBox[2], height: viewBox[3] };

        let needToUpdate = false;
        let padding = 10; // Add some padding to ensure there's space around the content

        // Check if the new bounding box extends beyond the current viewBox.
        if (newBBox.x < currentViewBox.x || newBBox.y < currentViewBox.y) {
            currentViewBox.x = newBBox.x - padding;
            currentViewBox.y = newBBox.y - padding;
            needToUpdate = true;
        }

        if (
            newBBox.width + newBBox.x >
                currentViewBox.width + currentViewBox.x ||
            newBBox.height + newBBox.y >
                currentViewBox.height + currentViewBox.y
        ) {
            currentViewBox.width =
                newBBox.width + newBBox.x - currentViewBox.x + padding;
            currentViewBox.height =
                newBBox.height + newBBox.y - currentViewBox.y + padding;
            needToUpdate = true;
        }

        // If the bounding box of the newly revealed nodes is larger than the current viewBox, adjust the viewBox.
        if (needToUpdate) {
            svgSelection
                .transition()
                .duration(time)
                .attr(
                    "viewBox",
                    `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`
                );
        }
    }

    let minWidth = 500;
    let minHeight = 100;
    function adjustViewBoxIfNeeded(svgSelection, newBBox, time) {
        const currentViewBox = parseViewBox(svgSelection.attr("viewBox"));
        let needToUpdate = false;
        let padding = 10; // Add some padding to ensure there's space around the content

        // Check if the new bounding box extends beyond the current viewBox.
        if (
            newBBox.x < currentViewBox.x ||
            newBBox.y < currentViewBox.y ||
            newBBox.x + newBBox.width >
                currentViewBox.x + currentViewBox.width ||
            newBBox.y + newBBox.height >
                currentViewBox.y + currentViewBox.height
        ) {
            currentViewBox.x = Math.min(newBBox.x - padding, currentViewBox.x);
            currentViewBox.y = Math.min(newBBox.y - padding, currentViewBox.y);
            currentViewBox.width = Math.max(
                newBBox.width + padding,
                currentViewBox.width
            );
            currentViewBox.height = Math.max(
                newBBox.height + padding,
                currentViewBox.height
            );
            needToUpdate = true;
        }

        // console.log("currentViewBox", currentViewBox)
        // Additionally, shrink the viewBox if the content is smaller than the current viewBox, but with a minimum size constraint.
        const minX = Math.min(currentViewBox.x, newBBox.x - padding);
        const minY = Math.min(currentViewBox.y, newBBox.y - padding);
        const maxWidth = Math.max(newBBox.width + 2 * padding, minWidth);
        const maxHeight = Math.max(newBBox.height + 2 * padding, minHeight);

        // Shrink the viewBox if content is smaller than current, but don't let it be smaller than a minimum size.
        if (
            newBBox.width < currentViewBox.width ||
            newBBox.height < currentViewBox.height
        ) {
            currentViewBox.x = minX;
            currentViewBox.y = minY;
            currentViewBox.width = maxWidth;
            currentViewBox.height = maxHeight;
            needToUpdate = true;
        }

        // If the bounding box of the newly revealed nodes is different than the current viewBox, adjust the viewBox.
        if (needToUpdate) {
            svgSelection
                .transition()
                .duration(time)
                .attr(
                    "viewBox",
                    `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`
                );
        }
    }

    // Define the update function
    function update(event, source) {
        const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();

        let leftPadding = 10;
        let rightPadding = 10
        // Access the last node's data
const lastNameNode = nodes[nodes.length - 1].data.name;
// console.log("Last node's name:", lastNameNode);

const avgCharWidth = 7.5; // Average character width in pixels for 15px font size
const avgWordLength = lastNameNode.length; // Average word length in English
const spaceWidth = avgCharWidth; // Roughly the same width as a character

const avgWordSize = (avgWordLength * avgCharWidth) + spaceWidth;


        // console.log("I AM NODES", nodes)
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + marginTop + marginBottom; // Kai placed 100 offset
        // if (svg && typeof svg.transition === 'function') {
            // try{
        const transition = svg
            .transition()
            .duration(duration)
            .attr("height", height + 200)
            .attr("viewBox", [
                -marginLeft - 100,
                left.x - marginTop,
                width,
                height,
            ])
            .tween(
                "resize",
                window.ResizeObserver
                    ? null
                    : () => () => svg.dispatch("toggle")
            );
        // }
        // catch {
        //     console.log("error with GRAPH svg transition ")
        // }
        const node = gNode.selectAll("g").data(nodes, (d) => {
            // console.log("i a d.name", d.data.name)
            return d.id;
        });

        const nodeExit = node
            .exit()
            .transition(transition)
            .remove()
            .attr("transform", (d) => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

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

                // Start a transition
                const transition = svg.transition().duration(500);

                // Perform actions after the transition ends
                transition
                    .end()
                    .then(() => {
                        try {
                            const newBBox = svg.node().getBBox();
                            const time = 750;
                            adjustViewBoxIfNeeded(svg, newBBox, time);
                        } catch (error) {
                            console.error(
                                "Failed to get the bounding box after the transition:",
                                error
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(
                            "Transition failed or was interrupted:",
                            error
                        );
                    });

                const textElement = d3
                    .select(event.currentTarget)
                    .select("text");
                if (d.children) {
                    // Node has been expanded
                    // Restore full name and position

                    textElement.text((d) => {
                        // console.log("d.data.name", d.data.name);
                        return d.data.name;
                    });

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
            .text((d) => {
                // console.log("d.data.name", d, d.data.name);
                
                return d.data.name;
            });

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
        // const nodeExit = node
        //     .exit()
        //     .transition(transition)
        //     .remove()
        //     .attr("transform", (d) => `translate(${source.y},${source.x})`)
        //     .attr("fill-opacity", 0)
        //     .attr("stroke-opacity", 0);

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

 
if ($is_last_update) {
  const newBBox = svg.node().getBBox(); // Bounding box of the content
  const time = 1000;
  const currentViewBox = parseViewBox(svg.attr("viewBox"));
  const leftPadding = 5; // Desired space on the left side of viewBox
  const rightPadding = 10; // Additional space to add to the right side

  // Calculate the necessary expansion to the right to include the rightmost content
  const neededWidth = newBBox.x + newBBox.width + rightPadding - currentViewBox.x;
  let newViewBoxWidth = Math.max(currentViewBox.width, neededWidth);

  // Adjust the viewBox x position to maintain at least leftPadding units of space to the leftmost content
  // and to add additional space for the average word size
  let newViewBoxX = Math.min(currentViewBox.x, newBBox.x - leftPadding - avgWordSize);

  // Ensure the viewBox does not go beyond the left edge of the SVG content
  newViewBoxX = Math.max(newViewBoxX, -leftPadding - avgWordSize);

  // If adjusting the viewBox width due to rightmost content expansion
  if (newViewBoxWidth > currentViewBox.width) {
    // Adjust the viewBox x position accordingly
    newViewBoxX -= (newViewBoxWidth - currentViewBox.width);
  }

  // Make sure the newViewBoxX does not cut off the leftmost content
  if (newViewBoxX < newBBox.x - leftPadding - avgWordSize) {
    newViewBoxX = newBBox.x - leftPadding - avgWordSize;
  }

  // Apply the new viewBox dimensions with a transition
  try {
    svg
      .transition()
      .duration(time)
      .attr("viewBox", `${newViewBoxX} ${currentViewBox.y} ${newViewBoxWidth} ${currentViewBox.height}`);
  } catch (error) {
    console.error("Failed to adjust the viewBox: UPDATE", error);
  }
  is_last_update.set(false);
}

    }



    function initializeTree(data) {
        root = d3.hierarchy(data);

        // console.log("I IS ROOT", root)

        // Define the size of the tree
        dy = (width - marginRight - marginLeft) / (1 + root.height) + 100;

        // Initialize the root position for the animation
        root.x0 = dy / 2;
        root.y0 = 0;

        // Process the descendants and configure the initial state
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            d.data.truncated = false; // All nodes start as not truncated
            // Collapse all nodes except the root and its direct children
            // console.log("d", d)
            if (d.depth > 1) {
                d.children = null;
            }
        });

        // Define the tree layout and the shape for links.
        // tree = d3.tree().nodeSize([dx, dy]);
        tree = d3
            .tree()
            .nodeSize([dx, dy])
            .separation((a, b) => {
                return a.parent == b.parent ? 1 : 5;
            });
        // diagonal = d3
        //     .linkHorizontal()
        //     .x((d) => d.y)
        //     .y((d) => d.x);

        diagonal = d3
            .linkHorizontal()
            .x((d) => {
                return d.y;
            })
            .y((d) => d.x);
    }


    function preInitialize() {
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
    }
    onMount(() => {
        initializeTree(sampleDat);

        preInitialize();

        // initializeTree(sampleDat);

        update(null, root);
    });

</script>

<br />
<svg bind:this={svgElement} />
