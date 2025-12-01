import BoxPlotChart from "./boxplot/boxPlotChart.js";

export class BoxChartController {
    constructor(containerSelector, dataService, tooltip) {
        this.containerSelector = containerSelector;
        this.dataService = dataService;
        this.tooltip = tooltip;
        this.chart = null;
        this.question = "Mean number of days with activity limitations in the past month";
    }

    init(width = 920, height = 450) {
        this.chart = new BoxPlotChart(this.containerSelector, width, height, this.tooltip);
    }

    render() {
        const raw = this.dataService.getBoxplotData(this.question);

        this.chart.draw(raw);
    }
}
