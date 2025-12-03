export function boxTooltipHTML(d) {
    return `
        Q1: ${d.q1.toFixed(2)}<br>
        Median: ${d.median.toFixed(2)}<br>
        Q3: ${d.q3.toFixed(2)}<br>
        Mean: ${d.mean.toFixed(2)}<br>
        Min: ${d.min}<br>
        Max: ${d.max}
    `;
}

export function pointTooltipHTML(d) {
    return `
        Year: ${d.YearStart}<br>
        Value: ${d.Data_Value.toFixed(1)}%
    `;
}