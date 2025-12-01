import { wrapText } from "./formatter.js";
import { MODE_BAR, MODE_LINE } from "./main.js";

export class ChartController {
    constructor(svg, axis, lineChart, barChart, titleEl) {
        this.svg = svg;
        this.axis = axis;
        this.lineChart = lineChart;
        this.barChart = barChart;
        this.titleEl = titleEl;

        this.mode = MODE_LINE;
    }

    setMode(mode) {
        this.mode = mode;
    }

    updateTitle(question) {
        this.titleEl.text(question).call(wrapText, 300);
    }

    update(data) {
        const isBar = this.mode === MODE_BAR;
        this.axis.setDomains(data, isBar);
        this.axis.drawAxes(isBar);

        if (this.mode === MODE_LINE) {
            this.lineChart.draw(data);
        } else {
            this.barChart.draw(data);
        }
    }
}
