export class AxisManager {
    constructor(svg, width, height) {
        this.width = width;
        this.height = height;

        this.xScale = null;
        this.yScale = d3.scaleLinear().range([height, 0]);

        this.xAxisG = svg.append("g")
            .attr("transform", `translate(0,${height})`);

        this.yAxisG = svg.append("g");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .text("Percentage (%)");
    }

    setDomains(data, isBandScale) {
        if (isBandScale) {
            this.xScale = d3.scaleBand()
                .domain(data.map(d => d.YearStart))
                .range([0, this.width])
                .padding(0.15);
        } else {
            this.xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.YearStart))
                .range([0, this.width]);
        }

        this.yScale.domain([
            d3.min(data, d => d.Data_Value) - 1,
            d3.max(data, d => d.Data_Value) + 1
        ]).nice();
    }

    drawAxes(isBandScale) {
        if (isBandScale) {
            this.xAxisG
                .transition().duration(600)
                .call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));
        } else {
            this.xAxisG
                .transition().duration(600)
                .call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));
        }

        this.yAxisG
            .transition().duration(600)
            .call(d3.axisLeft(this.yScale));
    }
}
