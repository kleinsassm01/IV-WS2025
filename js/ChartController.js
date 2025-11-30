import { LineChart } from "./LineChart.js";
import { BarChart } from "./BarChart.js";
import { wrapText } from "./Utils.js";

export class ChartController {
    constructor(svg, xAxis, yAxis, titleEl) {
        this.svg = svg;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.titleEl = titleEl;
        this.chartMode = "line";

        this.charts = {
            line: new LineChart(svg, xAxis, yAxis),
            bar: new BarChart(svg, xAxis, yAxis)
        };
    }

    setMode(mode) {
        this.chartMode = mode;
    }

    updateTitle(question) {
        this.titleEl.text(question).call(wrapText, 300);
    }

    update(data) {
        this.charts[this.chartMode].draw(data);
    }
}
