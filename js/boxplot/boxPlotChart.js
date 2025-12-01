import { computeBoxStats } from "./statistics.js";
import { createXScale, createYScale } from "./scales.js";
import { renderAxes } from "./renderAxes.js";
import { renderBoxes } from "./renderBoxes.js";
import { margins } from "./layout.js";

export default class BoxPlotChart {
    constructor(container, width, height, tooltip) {
        this.container = container;
        this.width = width;
        this.height = height;
        this.tooltip = tooltip;

        this.innerWidth = width - margins.left - margins.right;
        this.innerHeight = height - margins.top - margins.bottom;

        d3.select(container).selectAll("*").remove();

        this.svg = d3.select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margins.left},${margins.top})`);

        this.boxLayer = this.svg.append("g");
        this.xAxisG = this.svg.append("g")
            .attr("transform", `translate(0,${this.innerHeight})`);
        this.yAxisG = this.svg.append("g");

        this.title = this.svg.append("text")
            .attr("x", this.innerWidth / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle");
    }

    draw(rawData) {
        const groups = d3.groups(rawData, d => d.Stratification1)
            .map(([key, vals]) => ({
                key,
                values: vals.map(v => +v.Data_Value).filter(v => !isNaN(v) && v > 0)
            }))
            .filter(g => g.values.length);

        const allVals = groups.flatMap(g => g.values);

        const x = createXScale(groups, this.innerWidth);
        const y = createYScale(allVals, this.innerHeight);

        this.title.text(rawData[0].Question);

        const boxStats = groups.map(g => ({
            key: g.key,
            ...computeBoxStats(g.values)
        }));

        const boxWidth = x.bandwidth() * 0.5;

        renderAxes(this, x, y, this.innerHeight);
        renderBoxes(this.boxLayer, boxStats, x, y, boxWidth, this.tooltip);
    }
}
