export function initControls(controller, dataService) {

    function highlight(mode) {
        d3.select("#lineIcon").classed("active", mode === "line");
        d3.select("#barIcon").classed("active", mode === "bar");
        d3.select("#btn-boxplot").classed("active", mode === "boxplot");
    }

    function updateToolbar(mode) {
        const toolbar = document.getElementById("toolbarId");
        toolbar.style.display = mode === "boxplot" ? "none" : "flex";
    }

    function updateView(mode) {
        const main = document.getElementById("main-chart-wrapper");
        const box = document.getElementById("boxplot-wrapper");

        main.style.display = (mode === "boxplot") ? "none" : "block";
        box.style.display = (mode === "boxplot") ? "block" : "none";
    }

    function updateFromUI() {
        if (controller.mode === "boxplot") {
            const data = dataService.getBoxplotData();
            controller.update(data);
            return;
        }

        const question = document.getElementById("questionSelect").value;
        controller.updateTitle(question);

        const data = dataService.getYearlyAverages(question);
        controller.update(data);
    }

    function setInitial() {
        controller.setMode("line");
        highlight("line");
        updateToolbar("line");
        updateView("line");
        updateFromUI();
    }

    document.getElementById("questionSelect").addEventListener("change", updateFromUI);

    document.getElementById("lineIcon").addEventListener("click", () => {
        controller.setMode("line");
        highlight("line");
        updateToolbar("line");
        updateView("line");
        updateFromUI();
    });

    document.getElementById("barIcon").addEventListener("click", () => {
        controller.setMode("bar");
        highlight("bar");
        updateToolbar("bar");
        updateView("bar");
        updateFromUI();
    });

    document.getElementById("btn-boxplot").addEventListener("click", () => {
        controller.setMode("boxplot");
        highlight("boxplot");
        updateToolbar("boxplot");
        updateView("boxplot");
        updateFromUI();

        document.getElementById("btn-main-chart").classList.remove("active");
        document.getElementById("btn-boxplot").classList.add("active");
    });

    document.getElementById("btn-main-chart").addEventListener("click", () => {
        controller.setMode("line");
        highlight("line");
        updateToolbar("line");
        updateView("line");
        updateFromUI();

        document.getElementById("btn-main-chart").classList.add("active");
        document.getElementById("btn-boxplot").classList.remove("active");
    });

    setInitial()
}
