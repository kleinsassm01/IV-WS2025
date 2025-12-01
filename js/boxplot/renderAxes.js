export function renderAxes(svg, xScale, yScale, innerHeight) {
    svg.xAxisG
        .transition().duration(400)
        .call(d3.axisBottom(xScale));

    svg.yAxisG
        .transition().duration(400)
        .call(d3.axisLeft(yScale));
}
