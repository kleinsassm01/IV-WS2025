import { DURATION, HEIGHT } from "./main.js";
import { pointTooltipHTML } from "./tooltip.js";

export class BarChart {
    constructor(svg, axis, tooltip) {
        this.svg = svg;
        this.axis = axis;
        this.tooltip = tooltip;
    }

    draw(data) {
        const x = this.axis.xScale;
        const y = this.axis.yScale;

        this.svg.select("path.trend-line").style("opacity", 0);
        this.svg.selectAll("circle.point").remove();

        const bars = this.svg.selectAll("rect.bar")
            .data(data, d => d.YearStart);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.YearStart))
            .attr("width", x.bandwidth())
            .attr("y", HEIGHT)
            .attr("height", 0)
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                this.tooltip.style("opacity", 1)
                    .html(pointTooltipHTML(d))
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => this.tooltip.style("opacity", 0))
            .merge(bars)
            .transition()
            .duration(DURATION)
            .attr("x", d => x(d.YearStart))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.Data_Value))
            .attr("height", d => HEIGHT - y(d.Data_Value));

        bars.exit().remove();
    }
}
