export class LineChart {
    constructor(svg, axis, tooltip) {
        this.svg = svg;
        this.axis = axis;
        this.tooltip = tooltip;

        this.path = svg.append("path")
            .attr("class", "trend-line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    draw(data) {
        const x = this.axis.xScale;
        const y = this.axis.yScale;

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
            .attr("r", 0)
            .attr("fill", "red")
            .on("mouseover", (event, d) => {
                this.tooltip.style("opacity", 1)
                    .html(`Year: ${d.YearStart}<br>Value: ${d.Data_Value.toFixed(1)}%`)
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => this.tooltip.style("opacity", 0))
            .merge(points)
            .transition()
            .duration(600)
            .attr("cx", d => x(d.YearStart))
            .attr("cy", d => y(d.Data_Value))
            .attr("r", 5);

        points.exit().remove();
    }
}
