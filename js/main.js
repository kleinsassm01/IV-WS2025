import { DataManager } from "./DataManager.js";
import { ChartController } from "./ChartController.js";

const dm = new DataManager("data/health.csv");
await dm.load();

const svg = d3.select("#chart").append("svg")
    .attr("width", 800)
    .attr("height", 450)
    .append("g")
    .attr("transform", "translate(50,50)");

const xAxis = d3.axisBottom();
const yAxis = d3.axisLeft();

const chart = new ChartController(
    svg,
    xAxis,
    yAxis,
    svg.append("text").attr("class", "chart-title")
);

function updateFromUI() {
    const q = document.getElementById("questionSelect").value;
    const data = dm.getYearlyAverages(q);
    chart.updateTitle(q);
    chart.update(data);
}

document.getElementById("questionSelect")
    .addEventListener("change", updateFromUI);

document.getElementById("lineIcon")
    .addEventListener("click", () => {
        chart.setMode("line");
        updateFromUI();
    });

document.getElementById("barIcon")
    .addEventListener("click", () => {
        chart.setMode("bar");
        updateFromUI();
    });

// Initial Render
updateFromUI();
