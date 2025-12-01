import { DataService } from "./DataService.js";
import { AxisManager } from "./AxisManager.js";
import { LineChart } from "./LineChart.js";
import { BarChart } from "./BarChart.js";
import { ChartController } from "./ChartController.js";

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

// highlight UI buttons
function highlight(mode) {
    d3.select("#lineIcon").classed("active", mode === "line");
    d3.select("#barIcon").classed("active", mode === "bar");
}

const title = svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-weight", "600");

const axis = new AxisManager(svg, width, height);

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

function updateFromUI() {
    const q = document.getElementById("questionSelect").value;
    const data = dataService.getYearlyAverages(q);
    controller.updateTitle(q);
    controller.update(data);
}

document.getElementById("questionSelect").addEventListener("change", updateFromUI);

document.getElementById("lineIcon").addEventListener("click", () => {
    controller.setMode("line");
    highlight("line");
    updateFromUI();
});

document.getElementById("barIcon").addEventListener("click", () => {
    controller.setMode("bar");
    highlight("bar");
    updateFromUI();
});

highlight("line");
updateFromUI();
