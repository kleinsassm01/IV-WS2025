import { DURATION, HEIGHT, WIDTH } from "./main.js";

export class AxisManager {
    constructor(svg) {
        this.svg = svg;

        this.xScale = null;
        this.yScale = d3.scaleLinear().range([HEIGHT, 0]);

        this.xAxisG = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${HEIGHT})`);

        this.yAxisG = svg.append("g")
            .attr("class", "y-axis");

        this.xLabel = svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 45)
            .style("text-anchor", "middle");

        this.yLabel = svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -HEIGHT / 2)
            .attr("y", -50)
            .style("text-anchor", "middle");
    }

    setLabels(x, y) {
        this.xLabel.text(x);
        this.yLabel.text(y);
    }

    setDomains({ xDomain, isBandScale, yDomain }) {
        this.xScale = isBandScale
            ? d3.scaleBand().domain(xDomain).range([0, WIDTH]).padding(0.2)
            : d3.scaleLinear().domain(xDomain).range([0, WIDTH]);

        this.yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([HEIGHT, 0])
            .nice();
    }

    drawAxes() {
        this.xAxisG.transition().duration(DURATION)
            .call(d3.axisBottom(this.xScale)
                .tickFormat(v => isNaN(v) ? v : d3.format("d")(v))
            );

        this.yAxisG.transition().duration(DURATION)
            .call(d3.axisLeft(this.yScale));
    }
}
