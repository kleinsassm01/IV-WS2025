export class ChartController {
    constructor({
        mainSvg,
        boxSvg,
        axisMain,
        axisBox,
        lineChart,
        barChart,
        boxPlotChart,
        titleEl,
        dataService
    }) {
        this.mainSvg = mainSvg;
        this.boxSvg = boxSvg;

        this.axisMain = axisMain;
        this.axisBox = axisBox;

        this.lineChart = lineChart;
        this.barChart = barChart;
        this.boxPlotChart = boxPlotChart;

        this.titleEl = titleEl;
        this.dataService = dataService;

        this.mode = "line";
    }

    setMode(mode) {
        this.mode = mode;
    }

    updateTitle(question) {
        if (this.titleEl) this.titleEl.text(question);
    }

    update(data) {

        if (this.mode === "line") {
            const xDomain = d3.extent(data, d => +d.YearStart);
            const yDomain = d3.extent(data, d => +d.Data_Value);

            this.axisMain.setLabels("Year", "Value");

            this.axisMain.setDomains({
                xDomain,
                isBandScale: false,
                yDomain
            });

            this.axisMain.drawAxes();
            this.lineChart.draw(data);
            return;
        }

        if (this.mode === "bar") {
            const xDomain = data.map(d => d.YearStart);
            const yDomain = d3.extent(data, d => +d.Data_Value);

            this.axisMain.setLabels("Year", "Value");

            this.axisMain.setDomains({
                xDomain,
                isBandScale: true,
                yDomain
            });

            this.axisMain.drawAxes();
            this.barChart.draw(data);
            return;
        }

        if (this.mode === "boxplot") {
            this.boxPlotChart.draw(data);
            return;
        }
    }
}
