import { wrapText } from "./Formatter.js";

export class ChartController {
    constructor(svg, axis, lineChart, barChart, titleEl) {
        this.svg = svg;
        this.axis = axis;
        this.lineChart = lineChart;
        this.barChart = barChart;
        this.titleEl = titleEl;

        this.mode = "line";
    }

    setMode(mode) {
        this.mode = mode;
    }

    updateTitle(question) {
        this.titleEl.text(question).call(wrapText, 300);
    }

    update(data) {
        const isBar = this.mode === "bar";
        this.axis.setDomains(data, isBar);
        this.axis.drawAxes(isBar);

        if (this.mode === "line") {
            this.lineChart.draw(data);
        } else {
            this.barChart.draw(data);
        }
    }
}
