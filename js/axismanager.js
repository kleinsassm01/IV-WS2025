import { DURATION, WIDTH, HEIGHT } from "./main.js";

export class AxisManager {
    constructor(svg) {

        this.xScale = null;
        this.yScale = d3.scaleLinear().range([HEIGHT, 0]);

        this.xAxisG = svg.append("g").attr("transform", `translate(0,${HEIGHT})`);
        this.yAxisG = svg.append("g");

        svg.append("text").attr("class", "x-axis-label")
            .attr("x", WIDTH/2)
            .attr("y", HEIGHT+40).text("Year");

        svg.append("text").attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -HEIGHT/2).attr("y", -45)
            .text("Percentage (%)");
    }

    setDomains(data, isBandScale) {
        this.xScale = isBandScale 
            ? d3.scaleBand().domain(data.map(d => d.YearStart)).range([0, WIDTH]).padding(0.15)
            : d3.scaleLinear().domain(d3.extent(data, d => d.YearStart)).range([0, WIDTH]);

        const yExtent = d3.extent(data, d => d.Data_Value);
        this.yScale.domain([yExtent[0]-1, yExtent[1]+1]).nice();
    }

    drawAxes() {
        this.xAxisG.transition().duration(DURATION).call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));
        this.yAxisG.transition().duration(DURATION).call(d3.axisLeft(this.yScale));
    }
}
