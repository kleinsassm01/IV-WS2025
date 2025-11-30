export class LineChart {
    constructor(svg, xAxis, yAxis) {
        this.svg = svg;
        this.xAxis = xAxis;
        this.yAxis = yAxis;

        this.path = svg.append("path")
            .attr("class", "trend-line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    draw(data) {
        const x = this.xAxis.scale();
        const y = this.yAxis.scale();

        const line = d3.line()
            .x(d => x(d.YearStart))
            .y(d => y(d.Data_Value));

        this.svg.selectAll("rect.bar").remove();

        this.path.datum(data)
            .transition()
            .duration(600)
            .attr("d", line)
            .style("opacity", 1);

        const points = this.svg.selectAll("circle.point")
            .data(data, d => d.YearStart);

        points.enter()
            .append("circle")
            .attr("class", "point")
            .attr("r", 5)
            .attr("fill", "red")
            .merge(points)
            .transition()
            .duration(600)
            .attr("cx", d => x(d.YearStart))
            .attr("cy", d => y(d.Data_Value));

        points.exit().remove();
    }
}
