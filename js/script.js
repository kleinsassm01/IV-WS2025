import { DataService } from "dataService.js";
import { LineChart } from "lineChart.js";
import { BarChart } from "barChart.js";
import { ChartController } from "chartController.js";
import { BoxChartController } from "barChartController.js";
import { AxisManager } from "axisManager.js";

export const MARGIN = { top: 70, right: 40, bottom: 50, left: 60 };
export const WIDTH = 900 - MARGIN.left - MARGIN.right;
export const HEIGHT = 450 - MARGIN.top - MARGIN.bottom;

export const WIDTH_OUT = WIDTH + MARGIN.left + MARGIN.right;
export const HEIGHT_OUT = HEIGHT + MARGIN.top + MARGIN.bottom;

export const MODE_LINE = "line";
export const MODE_BAR = "bar";

export const TOPIC_MAIN = "main";
export const TOPIC_BOXPLOT = "boxplot";

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", WIDTH_OUT)
    .attr("height", HEIGHT_OUT)
    .append("g")
    .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

function highlight(mode) {
    d3.select("#lineIcon").classed("active", mode === "line");
    d3.select("#barIcon").classed("active", mode === "bar");
}

const title = svg.append("text")
    .attr("class", "chart-title")
    .attr("x", WIDTH / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-weight", "600");

const axis = new AxisManager(svg, WIDTH, HEIGHT);

const lineChart = new LineChart(svg, axis, tooltip);
const barChart = new BarChart(svg, axis, tooltip);

const csvParts = [
    "data/health_part1.csv",
    "data/health_part2.csv",
    "data/health_part3.csv",
    "data/health_part4.csv",
    "data/health_part5.csv",
    "data/health_part6.csv",
    "data/health_part7.csv",
    "data/health_part8.csv",
    "data/health_part9.csv",
    "data/health_part10.csv",
    "data/health_part11.csv",
    "data/health_part12.csv",
    "data/health_part13.csv",
    "data/health_part14.csv",
    "data/health_part15.csv"
];

const dataService = new DataService(csvParts);
await dataService.load();

const controller = new ChartController(svg, axis, lineChart, barChart, title);

const boxController = new BoxChartController("#boxplot", dataService, tooltip);
boxController.init(WIDTH_OUT, HEIGHT_OUT);

function showMainChart() {
    document.getElementById("main-chart-wrapper").style.display = "";
    document.getElementById("boxplot-wrapper").style.display = "none";
    d3.selectAll(".view-btn").classed("active", false);
    d3.select("#btn-main-chart").classed("active", true);
}

function showBoxplot() {
    document.getElementById("main-chart-wrapper").style.display = "none";
    document.getElementById("boxplot-wrapper").style.display = "";
    d3.selectAll(".view-btn").classed("active", false);
    d3.select("#btn-boxplot").classed("active", true);

    boxController.render();
}

function updateFromUI() {
    const questionSelect = document.getElementById("questionSelect").value;
    const data = dataService.getYearlyAverages(questionSelect);
    controller.updateTitle(questionSelect);
    controller.update(data);
}

document.getElementById("questionSelect").addEventListener("change", () => {
    updateFromUI();
});

document.getElementById("lineIcon").addEventListener("click", () => {
    controller.setMode(MODE_LINE);
    highlight(MODE_LINE);
    updateFromUI();
});

document.getElementById("barIcon").addEventListener("click", () => {
    controller.setMode(MODE_BAR);
    highlight(MODE_BAR);
    updateFromUI();
});

document.getElementById("btn-main-chart").addEventListener("click", () => {
    showMainChart();
});
document.getElementById("btn-main-chart").addEventListener("click", () => {
    showMainChart();
    updateToolbar(TOPIC_MAIN);
});

document.getElementById("btn-boxplot").addEventListener("click", () => {
    showBoxplot();
    updateToolbar(TOPIC_BOXPLOT);
});

highlight(MODE_LINE);
showMainChart();
updateFromUI();

function updateToolbar(view) {
    const toolbar = document.getElementById("toolbarId");
    
    if (view === TOPIC_MAIN) {
        toolbar.style.display = "flex";
    }

    if (view === TOPIC_BOXPLOT) {
        toolbar.style.display = "none";
    }
}
