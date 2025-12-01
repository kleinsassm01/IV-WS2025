export const margins = { top: 70, right: 40, bottom: 50, left: 60 };

export function createSvg(container, width, height) {
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`);

    return svg;
}
