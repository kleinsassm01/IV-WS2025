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
            .attr("stroke", "#444");

        const cap = xScale.bandwidth() * 0.18;
        g.append("line")
            .attr("x1", cx - cap / 2)
            .attr("x2", cx + cap / 2)
            .attr("y1", yScale(d.upperWhisker))
            .attr("y2", yScale(d.upperWhisker))
            .attr("stroke", "#444");

        g.append("line")
            .attr("x1", cx - cap / 2)
            .attr("x2", cx + cap / 2)
            .attr("y1", yScale(d.lowerWhisker))
            .attr("y2", yScale(d.lowerWhisker))
            .attr("stroke", "#444");

        g.append("rect")
            .attr("x", cx - boxWidth / 2)
            .attr("y", yScale(d.q3))
            .attr("width", boxWidth)
            .attr("height", Math.max(1, yScale(d.q1) - yScale(d.q3)))
            .attr("fill", "#e8f0fe")
            .attr("stroke", "#4c8bf5")
            .on("mouseover", (event) => {
                tooltip.style("opacity", 1)
                    .html(
                        `Q1: ${d.q1.toFixed(2)}<br>` +
                        `Median: ${d.median.toFixed(2)}<br>` +
                        `Q3: ${d.q3.toFixed(2)}<br>` +
                        `Mean: ${d.mean.toFixed(2)}<br>` +
                        `Min: ${d.min}<br>` +
                        `Max: ${d.max}`
                    )
                    .style("left", event.pageX + 12 + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", () => tooltip.style("opacity", 0));

        g.append("line")
            .attr("x1", cx - boxWidth / 2)
            .attr("x2", cx + boxWidth / 2)
            .attr("y1", yScale(d.median))
            .attr("y2", yScale(d.median))
            .attr("stroke", "#111");

        g.append("circle")
            .attr("cx", cx)
            .attr("cy", yScale(d.mean))
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("stroke", "#f28a30");
    });
}
