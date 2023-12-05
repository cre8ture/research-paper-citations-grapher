<!-- TreeChart.svelte -->
<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    let minHeight = 400;
    let minWidth = 600;

    const sampleDat = {
        name: "flare",
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
                name: "animate",
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
                name: "data",
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
function resizeSVG() {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    root.each((node) => {
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
    });

    const maxTextWidth = getMaxTextWidth();

    const newHeight = Math.max(minHeight, maxX - minX + marginTop + marginBottom );
    const newWidth = Math.max(minWidth, maxY - minY + marginLeft + marginRight +maxTextWidth*3/2 ); // Add the maxTextWidth
    // const newHeight =  maxX - minX + marginTop + marginBottom
    // const newWidth =  maxY - minY + marginLeft + marginRight + maxTextWidth
    dy = (newWidth - marginRight - marginLeft) / (1 + root.height);


    // Animate the resize for a smoother effect
    svg.transition()
        .duration(750)
        .attr('height', newHeight)
        .attr('width', newWidth)
        .attr('viewBox', [-marginLeft, minX - marginTop, newWidth, newHeight]);

    // You might need to update the global width here if it is intended to be used elsewhere
    width = newWidth;
}
function wrapText(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}



// Usage example:
// const textElement = document.querySelector('text'); // Adjust the selector to target the correct text element.
// wrapText(textElement, 200); // 200 is the maximum width in pixels.

    // Define the update function
    function update(event, source) {
        const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore((node) => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + marginTop + marginBottom;

        const transition = svg
            .transition()
            .duration(duration)
            .attr("height", height)
            .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
            .tween(
                "resize",
                window.ResizeObserver
                    ? null
                    : () => () => svg.dispatch("toggle")
            );

        // Update the nodes…
        const node = gNode.selectAll("g").data(nodes, (d) => d.id);

        // Enter any new nodes at the parent's previous position.
        
        const nodeEnter = node
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
                d.children = d.children ? null : d._children;
                update(event, d);
            });

        nodeEnter
            .append("circle")
            .attr("r", 2.5)
            .attr("fill", (d) => (d._children ? "#555" : "#999"))
            .attr("stroke-width", 10);

        // nodeEnter
        //     .append("text")
        //     .attr("dy", "0.31em")
        //     .attr("x", (d) => (d._children ? -6 : 6))
        //     .attr("text-anchor", (d) => (d._children ? "end" : "start"))
        //     .text((d) => d.data.name)
        //     .clone(true)
        //     .lower()
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-width", 3)
        //     .attr("stroke", "white");
        nodeEnter
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", (d) => (d._children ? -6 : 6))
            .attr("text-anchor", (d) => (d._children ? "end" : "start"))
            .text((d) => d.data.name)
            .clone(true)
            .lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white")
            .call(wrapText, 400);  // Apply text wrapping here

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
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            // Keep the root and any nodes with 7 letters in their name expanded
            if (d.depth && d.data.name.length !== 7) {
                d.children = null;
            }
        });

        // Define the size of the tree
        dy = (width - marginRight - marginLeft) / (1 + root.height);

        // Define the tree layout and the shape for links.
        tree = d3.tree().nodeSize([dx, dy]);
        diagonal = d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x);
            
        svg = d3.select(svgElement) // Select the bound element
            .attr("width", width)
            .attr("height", dx)
            .attr("viewBox", [-marginLeft, -marginTop, width, dx])
            .attr("style", "max-width: 100%; height: auto; font: 15px sans-serif; user-select: none;");

   gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

   gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

        // Initialize the display
        update(null, root);
    });

    function handleResize() {
        // Logic to handle resize goes here if needed
    }
</script>

<!-- Add your resizing logic to the window if needed -->
<!-- <svelte:window on:resize={handleResize} /> -->
<br />
AI Ideas
<svg bind:this={svgElement} />

