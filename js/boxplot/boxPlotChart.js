import { computeBoxStats } from "./statistics.js";
import { createXScale, createYScale } from "./scales.js";
import { renderAxes } from "./renderAxes.js";
import { renderBoxes } from "./renderBoxes.js";
import { createSvg } from "../layout.js";
import { HEIGHT, WIDTH } from "../main.js";

export default class BoxPlotChart {
    constructor(container, tooltip) {
        this.container = container;
        this.tooltip = tooltip;

        d3.select(container).selectAll("*").remove();

        this.svg = createSvg(container);
        this.boxLayer = this.svg.append("g");
        this.xAxisG = this.svg.append("g")
            .attr("transform", `translate(0,${HEIGHT})`);
        this.yAxisG = this.svg.append("g");

        this.title = this.svg.append("text")
            .attr("x", WIDTH / 2)
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

        const boxStats = groups.map(g => ({
            key: g.key,
            ...computeBoxStats(g.values)
        }));

        const x = createXScale(groups, WIDTH);
        const y = createYScale(boxStats, HEIGHT);

        this.title.text(rawData[0].Question);

        const boxWidth = x.bandwidth() * 0.5;

        renderAxes(this, x, y);
        renderBoxes(this.boxLayer, boxStats, x, y, boxWidth, this.tooltip);
    }
}
