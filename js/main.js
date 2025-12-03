import { ChartController } from "./chartcontroller.js";
import { DataService } from "./dataservice.js";
import { BarChart } from "./barchart.js";
import { AxisManager } from "./axismanager.js";
import { LineChart } from "./linechart.js";
import { createSvg, createChartTitle } from "./layout.js";
import BoxPlotChart from "./boxchart.js";

import { initControls } from "./controls.js";

export const MARGIN = { top: 70, right: 40, bottom: 50, left: 70 };
export const WIDTH = 900 - MARGIN.left - MARGIN.right;
export const HEIGHT = 450 - MARGIN.top - MARGIN.bottom;

export const WIDTH_OUT = WIDTH + MARGIN.left + MARGIN.right;
export const HEIGHT_OUT = HEIGHT + MARGIN.top + MARGIN.bottom;

export const DURATION = 600;

export const TOOLTIP_OFFSET_X = 12
export const TOOLTIP_OFFSET_Y = 28

const svgMain = createSvg("#chart");
const svgBox = createSvg("#boxplot");

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const titleMain = createChartTitle(svgMain);
const titleBox = createChartTitle(svgBox);

const axisMain = new AxisManager(svgMain);
const axisBox = new AxisManager(svgBox);

const lineChart = new LineChart(svgMain, axisMain, tooltip);
const barChart = new BarChart(svgMain, axisMain, tooltip);
const boxPlotChart = new BoxPlotChart(svgBox, tooltip, axisBox);

const csvParts = Array.from({ length: 15 }, (_, i) => `data/health_part${i + 1}.csv`);

const dataService = new DataService(csvParts);
await dataService.load();

const controller = new ChartController({
    mainSvg: svgMain,
    boxSvg: svgBox,
    axisMain,
    axisBox,
    lineChart,
    barChart,
    boxPlotChart,
    titleElMain: titleMain,
    titleElBox: titleBox,
    dataService
});

initControls(controller, dataService);
