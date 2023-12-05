<script>
import { onMount } from 'svelte';
import * as d3 from 'd3';
import {constructTangleLayout} from '../support/constructTangleLayout.js';

 let data = [
[{ id: "Q1" }],
[
  { id: "Q2", parents: ["Q1"] },
  { id: "F1", parents: ["Q1"] }
],
[
  { id: "Q3", parents: ["Q2"] },
  { id: "Q4", parents: ["Q2"] },
  { id: "F2", parents: ["Q2"] },
  { id: "F3", parents: ["Q2"] }
],
[
  { id: "F4", parents: ["Q2", "Q3"] },
  { id: "F5", parents: ["Q3"] },
  { id: "F6", parents: ["Q3"] },
  { id: "F7", parents: ["Q3"] },
  { id: "F8", parents: ["Q4"] },
  { id: "F9", parents: ["Q4"] }
]
 ]

 let options = {};

let svgElement;

// Default color function if none is provided in options
const defaultColor = (d, i) => d3.schemeCategory10[i % 10];


function renderChart(chartData, chartOptions) {
  chartOptions.color ||= defaultColor;

  // Construct the tangle layout
  const tangleLayout = constructTangleLayout(JSON.parse(JSON.stringify(chartData)),
chartOptions)

  // Clear previous contents
  d3.select(svgElement).selectAll("*").remove();

  const svg = d3.select(svgElement);
  svg.style("background-color", "#f0f0f0");

  // Apply general styles, you could also move this to a <style> tag within this Svelte component
  svg.append("style").text(`
    text {
      font-family: sans-serif;
      font-size: 10px;
    }
    .node {
      stroke-linecap: round;
    }
    .link {
      fill: none;
    }
  `);

  // Draw links
  tangleLayout.bundles.forEach((bundle, bundleIndex) => {
    bundle.links.forEach((link) => {
      const pathData = `
        M${link.xt} ${link.yt}
        L${link.xb - link.c1} ${link.yt}
        A${link.c1} ${link.c1} 90 0 1 ${link.xb} ${link.yt + link.c1}
        L${link.xb} ${link.ys - link.c2}
        A${link.c2} ${link.c2} 90 0 0 ${link.xb + link.c2} ${link.ys}
        L${link.xs} ${link.ys}`;
      const linkColor = chartOptions.color(bundle, bundleIndex);

      // Background path for the link
      svg.append("path")
        .attr("class", "link")
        .attr("stroke", "#f0f0f0") // Assuming there's a background color for the link
        .attr("stroke-width", 5)
        .attr("d", pathData);

      // Foreground path for the link
      svg.append("path")
        .attr("class", "link")
        .attr("stroke", linkColor)
        .attr("stroke-width", 2)
        .attr("d", pathData);
    });
  });

  // Draw nodes
  tangleLayout.nodes.forEach((node) => {
    // Background path for the node
    svg.append("path")
      .attr("class", "selectable node")
      .attr("data-id", node.id)
      .attr("stroke", "black")
      .attr("stroke-width", 8)
      .attr("d", `M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}`);

    // Foreground path for the node
    svg.append("path")
      .attr("class", "node")
      .attr("data-id", node.id)
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("d", `M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}`);

    // Text for the node
    svg.append("text")
      .attr("class", "selectable")
      .attr("data-id", node.id)
      .attr("x", node.x + 4)
      .attr("y", node.y - node.height / 2 - 4)
      .attr("stroke", "none") // You probably want the text to not have a stroke, or set the correct stroke color
      .attr("stroke-width", 2)
      .text(node.id);

    svg.append("text")
      .attr("class", "selectable")
      .attr("data-id", node.id)
      .attr("x", node.x + 4)
      .attr("y", node.y - node.height / 2 - 4)
      .text(node.id);
  });
}

onMount(() => {
  renderChart(data, options);
});

$: if (data && options) {
  renderChart(data, options);
}
</script>

<svg bind:this={svgElement} width="600" height="400">
<!-- SVG elements would be rendered by D3 here -->
</svg>