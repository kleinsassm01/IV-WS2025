import { DURATION } from "../main.js";

export function renderAxes(svg, xScale, yScale) {
    svg.xAxisG
        .transition().duration(DURATION)
        .call(d3.axisBottom(xScale));

    svg.yAxisG
        .transition().duration(DURATION)
        .call(d3.axisLeft(yScale));
}
