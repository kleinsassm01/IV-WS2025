export function createXScale(groups, width) {
    return d3.scaleBand()
        .domain(groups.map(g => g.key))
        .range([0, width])
        .padding(0.4);
}

export function createYScale(boxStats, height) {
    const minWhisker = d3.min(boxStats, d => d.lowerWhisker);
    const maxWhisker = d3.max(boxStats, d => d.upperWhisker);

    return d3.scaleLinear()
        .domain([minWhisker, maxWhisker])
        .range([height, 0])
        .nice();
}
