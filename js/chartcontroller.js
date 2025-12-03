export class ChartController {
    constructor({
        mainSvg,
        boxSvg,
        axisMain,
        axisBox,
        lineChart,
        barChart,
        boxPlotChart,
        titleElMain,
        titleElBox,
        dataService
    }) {
        this.mainSvg = mainSvg;
        this.boxSvg = boxSvg;

        this.axisMain = axisMain;
        this.axisBox = axisBox;

        this.lineChart = lineChart;
        this.barChart = barChart;
        this.boxPlotChart = boxPlotChart;

        this.titleMain = titleElMain;
        this.titleBox = titleElBox;

        this.dataService = dataService;

        this.mode = "line";
    }

    setMode(mode) {
        this.mode = mode;
    }

    updateTitle(text) {
        if (this.mode === "boxplot") {
            this.titleBox.text(text);
        } else {
            this.titleMain.text(text);
        }
    }

    update(data) {

        if (this.mode === "line") {
            const xDomain = d3.extent(data, d => +d.YearStart);
            const yDomain = d3.extent(data, d => +d.Data_Value);

            this.axisMain.setLabels("Year", "Percentage (%)");

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

            this.axisMain.setLabels("Year", "Percentage (%)");

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
            this.updateTitle("Mean number of days with activity limitations in the past month");
            this.boxPlotChart.draw(data);
            return;
        }
    }
}
