export function createXScale(groups, width) {
    return d3.scaleBand()
        .domain(groups.map(g => g.key))
        .range([0, width])
        .padding(0.4);
}

export function createYScale(values, height) {
    const min = d3.min(values);
    const max = d3.max(values);

    return d3.scaleLinear()
        .domain([Math.max(0, min - 1), max + 1])
        .range([height, 0])
        .nice();
}
