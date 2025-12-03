import { TOOLTIP_OFFSET_X, TOOLTIP_OFFSET_Y } from "./main.js";
import { boxTooltipHTML } from "./tooltip.js";


export function renderBoxes(boxLayer, boxStats, xScale, yScale, boxWidth, tooltip) {
    const groups = boxLayer.selectAll(".box-group")
        .data(boxStats, d => d.key)
        .join("g")
        .attr("class", "box-group")
        .attr("transform", d => `translate(${xScale(d.key)},0)`);

    groups.each((d, i, nodes) => {
        const g = d3.select(nodes[i]);
        const cx = xScale.bandwidth() / 2;

        g.selectAll("*").remove();

        g.append("line")
            .attr("x1", cx).attr("x2", cx)
            .attr("y1", yScale(d.lowerWhisker))
            .attr("y2", yScale(d.upperWhisker))
            .attr("stroke", "black");

        const cap = xScale.bandwidth() * 0.18;

        g.append("line")
            .attr("x1", cx - cap / 2)
            .attr("x2", cx + cap / 2)
            .attr("y1", yScale(d.upperWhisker))
            .attr("y2", yScale(d.upperWhisker))
            .attr("stroke", "black");

        g.append("line")
            .attr("x1", cx - cap / 2)
            .attr("x2", cx + cap / 2)
            .attr("y1", yScale(d.lowerWhisker))
            .attr("y2", yScale(d.lowerWhisker))
            .attr("stroke", "black");

        g.append("rect")
            .attr("x", cx - boxWidth / 2)
            .attr("y", yScale(d.q3))
            .attr("width", boxWidth)
            .attr("height", Math.max(1, yScale(d.q1) - yScale(d.q3)))
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .on("mouseover", (event) => {
                tooltip.style("opacity", 1)
                    .html(boxTooltipHTML(d))
                    .style("left", event.pageX + TOOLTIP_OFFSET_X + "px")
                    .style("top", event.pageY - TOOLTIP_OFFSET_Y + "px");
            })
            .on("mouseout", () => tooltip.style("opacity", 0));

        g.append("line")
            .attr("x1", cx - boxWidth / 2)
            .attr("x2", cx + boxWidth / 2)
            .attr("y1", yScale(d.median))
            .attr("y2", yScale(d.median))
            .attr("stroke", "black");

        g.append("circle")
            .attr("cx", cx)
            .attr("cy", yScale(d.mean))
            .attr("r", 5)
            .attr("fill", "white")
            .attr("stroke", "red");
    });
}


export default class BoxPlotChart {
    constructor(svg, tooltip, axisManager, titleEl) {
        this.svg = svg;
        this.tooltip = tooltip;
        this.axis = axisManager;
        this.titleEl = titleEl;

        this.boxLayer = this.svg.append("g")
            .attr("class", "boxplot-layer");
    }

    draw(rawData) {

        const groups = d3.groups(rawData, d => d.Stratification1)
            .map(([key, vals]) => ({
                key,
                values: vals.map(v => +v.Data_Value).filter(v => v > 0)
            }))
            .filter(g => g.values.length);

        const boxStats = groups.map(g => ({
            key: g.key,
            ...computeBoxStats(g.values)
        }));

        if (this.titleEl)
            this.titleEl.text(rawData[0].Question);

        const xDomain = groups.map(g => g.key);
        const yDomain = [
            d3.min(boxStats, d => d.lowerWhisker),
            d3.max(boxStats, d => d.upperWhisker)
        ];

        this.axis.setLabels("Age", "Days of activity limitations");
        this.axis.setDomains({
            xDomain,
            isBandScale: true,
            yDomain
        });
        this.axis.drawAxes();

        const x = this.axis.xScale;
        const y = this.axis.yScale;
        const boxWidth = x.bandwidth() * 0.5;

        this.boxLayer.selectAll("*").remove();
        renderBoxes(this.boxLayer, boxStats, x, y, boxWidth, this.tooltip);
    }
}

export function computeBoxStats(values) {
    const sorted = [...values].sort((a, b) => a - b);

    const q1 = d3.quantile(sorted, 0.25);
    const median = d3.quantile(sorted, 0.5);
    const q3 = d3.quantile(sorted, 0.75);
    const iqr = q3 - q1;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    return {
        values: sorted,
        q1,
        median,
        q3,
        iqr,
        lowerWhisker: d3.min(sorted.filter(v => v >= lowerFence)) ?? sorted[0],
        upperWhisker: d3.max(sorted.filter(v => v <= upperFence)) ?? sorted.at(-1),
        mean: d3.mean(sorted),
        min: sorted[0],
        max: sorted.at(-1)
    };
}
