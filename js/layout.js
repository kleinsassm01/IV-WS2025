import { HEIGHT_OUT, MARGIN, WIDTH_OUT } from "./main.js";

export function createSvg(container) {
    const svg = d3.select(container)
        .append("svg")
        .attr("width", WIDTH_OUT)
        .attr("height", HEIGHT_OUT)
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    return svg;
}
