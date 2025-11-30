const margin = { top: 70, right: 40, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

let chartMode = "line";

function highlightButton(type) {
    d3.select("#lineIcon").classed("active", type === "line");
    d3.select("#barIcon").classed("active", type === "bar");
}

highlightButton("line");

Promise.all([
    d3.csv("data/health_part1.csv"),
    d3.csv("data/health_part2.csv"),
    d3.csv("data/health_part3.csv"),
    d3.csv("data/health_part4.csv"),
    d3.csv("data/health_part5.csv"),
    d3.csv("data/health_part6.csv"),
    d3.csv("data/health_part7.csv"),
    d3.csv("data/health_part8.csv"),
    d3.csv("data/health_part9.csv"),
    d3.csv("data/health_part10.csv"),
    d3.csv("data/health_part11.csv"),
    d3.csv("data/health_part12.csv"),
    d3.csv("data/health_part13.csv"),
    d3.csv("data/health_part14.csv"),
    d3.csv("data/health_part15.csv"),
]).then(allParts => {

    let data = allParts.flat();
    console.log(data);

    data.forEach(d => {
        d.YearStart = +d.YearStart;
        d.Data_Value = +d.Data_Value;
    });

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = svg.append("g");

    const line = d3.line()
        .x(d => x(d.YearStart))
        .y(d => y(d.Data_Value));

    const path = svg.append("path")
        .attr("class", "trend-line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .text("Percentage (%)");

    const title = svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "600");

    function wrapTitle(textSelection, maxWidth) {
        textSelection.each(function () {
            const text = d3.select(this);
            const words = text.text().split(/\s+/).reverse();
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1;
            const x = text.attr("x");
            const y = text.attr("y");

            let tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y);

            let word;
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > maxWidth) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", `${++lineNumber * lineHeight}em`)
                        .text(word);
                }
            }
        });
    }

    function updateChart(question) {
        title.text(question).call(wrapTitle, 300);

        let filtered = data.filter(d =>
            d.Question === question &&
            d.Stratification1 === "Overall" &&
            d.Data_Value_Type === "Percentage"
        );

        const nested = d3.groups(filtered, d => d.YearStart)
            .map(([year, values]) => ({
                YearStart: year,
                Data_Value: d3.mean(values, v => v.Data_Value)
            }))
            .sort((a, b) => a.YearStart - b.YearStart);

        x.domain(d3.extent(nested, d => d.YearStart));
        y.domain([
            d3.min(nested, d => d.Data_Value) - 1,
            d3.max(nested, d => d.Data_Value) + 1
        ]).nice();

        // ===========================
        // LINE MODE
        // ===========================
        if (chartMode === "line") {

            svg.selectAll("rect.bar").remove();

            xAxis.transition().duration(800)
                .call(d3.axisBottom(x).tickFormat(d3.format("d")));
            yAxis.transition().duration(800)
                .call(d3.axisLeft(y));

            path.datum(nested)
                .transition()
                .duration(800)
                .attr("d", line)
                .style("opacity", 1);

            const points = svg.selectAll("circle.point")
                .data(nested, d => d.YearStart);

            points.enter()
                .append("circle")
                .attr("class", "point")
                .attr("r", 0)
                .attr("cx", d => x(d.YearStart))
                .attr("cy", d => y(d.Data_Value))
                .attr("fill", "red")
                .on("mouseover", (event, d) => {
                    tooltip.style("opacity", 1)
                        .html(`Year: ${d.YearStart}<br>Value: ${d.Data_Value.toFixed(1)}%`)
                        .style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", () => tooltip.style("opacity", 0))
                .transition()
                .duration(800)
                .attr("r", 5);

            points.transition()
                .duration(800)
                .attr("cx", d => x(d.YearStart))
                .attr("cy", d => y(d.Data_Value));

            points.exit().remove();

            return;
        }

        svg.selectAll("circle.point").remove();
        path.style("opacity", 0);

        const xBand = d3.scaleBand()
            .domain(nested.map(d => d.YearStart))
            .range([0, width])
            .padding(0.15);

        xAxis.transition().duration(800)
            .call(d3.axisBottom(xBand).tickFormat(d3.format("d")));
        yAxis.transition().duration(800)
            .call(d3.axisLeft(y));

        const bars = svg.selectAll("rect.bar")
            .data(nested, d => d.YearStart);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBand(d.YearStart))
            .attr("width", xBand.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                    .html(`Year: ${d.YearStart}<br>Value: ${d.Data_Value.toFixed(1)}%`)
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => tooltip.style("opacity", 0))
            .transition()
            .duration(800)
            .attr("y", d => y(d.Data_Value))
            .attr("height", d => height - y(d.Data_Value));

        bars.transition()
            .duration(800)
            .attr("x", d => xBand(d.YearStart))
            .attr("width", xBand.bandwidth())
            .attr("y", d => y(d.Data_Value))
            .attr("height", d => height - y(d.Data_Value));

        bars.exit().remove();
    }

    updateChart(document.getElementById("questionSelect").value);

    d3.select("#questionSelect").on("change", function () {
        updateChart(this.value);
    });

    d3.select("#lineIcon").on("click", () => {
        chartMode = "line";
        highlightButton("line");
        updateChart(document.getElementById("questionSelect").value);
    });

    d3.select("#barIcon").on("click", () => {
        chartMode = "bar";
        highlightButton("bar");
        updateChart(document.getElementById("questionSelect").value);
    });

});
