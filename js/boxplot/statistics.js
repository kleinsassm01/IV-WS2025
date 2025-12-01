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
