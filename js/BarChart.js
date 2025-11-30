export class BarChart {
    constructor(svg, xAxis, yAxis) {
        this.svg = svg;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
    }

    draw(data) {
        const xBand = this.xAxis.bandScale(data.map(d => d.YearStart));
        const y = this.yAxis.scale();

        this.svg.select("path.trend-line").style("opacity", 0);
        this.svg.selectAll("circle.point").remove();

        const bars = this.svg.selectAll("rect.bar")
            .data(data, d => d.YearStart);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBand(d.YearStart))
            .attr("width", xBand.bandwidth())
            .attr("y", y(0))
            .attr("height", 0)
            .transition()
            .duration(600)
            .attr("y", d => y(d.Data_Value))
            .attr("height", d => (y(0) - y(d.Data_Value)));

        bars.exit().remove();
    }
}
