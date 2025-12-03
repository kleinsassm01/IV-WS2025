export function wrapText(textSelection, maxWidth) {
    textSelection.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const x = text.attr("x");
        const y = text.attr("y");
        let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y);

        let word;
        while ((word = words.pop())) {
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
