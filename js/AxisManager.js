export class AxisManager {
    constructor(svg, width, height) {
        this.width = width;
        this.height = height;

        this.xScale = null;
        this.yScale = d3.scaleLinear().range([height, 0]);

        this.xAxisG = svg.append("g").attr("transform", `translate(0,${height})`);
        this.yAxisG = svg.append("g");

        svg.append("text").attr("class", "x-axis-label")
            .attr("x", width/2)
            .attr("y", height+40).text("Year");

        svg.append("text").attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2).attr("y", -45)
            .text("Percentage (%)");
    }

    setDomains(data, isBandScale) {
        this.xScale = isBandScale 
            ? d3.scaleBand().domain(data.map(d => d.YearStart)).range([0, this.width]).padding(0.15)
            : d3.scaleLinear().domain(d3.extent(data, d => d.YearStart)).range([0, this.width]);

        const yExtent = d3.extent(data, d => d.Data_Value);
        this.yScale.domain([yExtent[0]-1, yExtent[1]+1]).nice();
    }

    drawAxes() {
        this.xAxisG.transition().duration(600).call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));
        this.yAxisG.transition().duration(600).call(d3.axisLeft(this.yScale));
    }
}
