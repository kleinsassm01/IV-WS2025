import { HEIGHT_OUT, MARGIN, WIDTH, WIDTH_OUT } from "./main.js";

export function createSvg(container) {
    const svg = d3.select(container)
        .append("svg")
        .attr("width", WIDTH_OUT)
        .attr("height", HEIGHT_OUT)
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    return svg;
}


export function createChartTitle(svg) {
    return svg.append("text")
        .attr("class", "chart-title")
        .attr("x", WIDTH / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-weight", "600");
}