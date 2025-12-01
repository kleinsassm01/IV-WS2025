export class DataService {
    constructor(csvParts) {
        this.csvParts = csvParts;
        this.data = [];
    }

    async load() {
        const loaded = await Promise.all(
            this.csvParts.map(path => d3.csv(path))
        );

        this.data = loaded.flat();

        this.data.forEach(d => {
            d.YearStart = +d.YearStart;
            d.Data_Value = +d.Data_Value;
        });
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
