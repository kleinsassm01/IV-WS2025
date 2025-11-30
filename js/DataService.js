export class DataService {
    constructor(csvPath) {
        this.csvPath = csvPath;
        this.data = null;
    }

    async load() {
        const raw = await d3.csv(this.csvPath);
        raw.forEach(d => {
            d.YearStart = +d.YearStart;
            d.Data_Value = +d.Data_Value;
        });
        this.data = raw;
    }

    getFiltered(question) {
        return this.data.filter(d =>
            d.Question === question &&
            d.Stratification1 === "Overall" &&
            d.Data_Value_Type === "Percentage"
        );
    }

    getYearlyAverages(question) {
        return d3.groups(this.getFiltered(question), d => d.YearStart)
            .map(([year, values]) => ({
                YearStart: year,
                Data_Value: d3.mean(values, v => v.Data_Value)
            }))
            .sort((a, b) => a.YearStart - b.YearStart);
    }
}
