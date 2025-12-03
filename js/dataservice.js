export class DataService {
    constructor(csvParts) {
        this.csvPaths = csvParts;
        this.data = [];
    }

    async load() {
        const loaded = await Promise.all(
            this.csvPaths.map(p => d3.csv(p))
        );

        this.data = loaded.flat().map(d => ({
            ...d,
            YearStart: +d.YearStart,
            Data_Value: +d.Data_Value
        }));

    }

    getFiltered(question) {
        return this.data.filter(d =>
            d.Question === question &&
            d.Data_Value_Type === "Percentage" &&
            (d.Stratification1 === "Overall" || !d.Stratification1)
        );
    }

    getYearlyAverages(question) {
        return d3.groups(this.getFiltered(question), d => d.YearStart)
            .map(([year, arr]) => ({
                YearStart: year,
                Data_Value: d3.mean(arr, v => v.Data_Value)
            }))
            .sort((a, b) => a.YearStart - b.YearStart);
    }

    getBoxplotData() {
        const test = this.data.filter(d =>
            d.Question === "Mean number of days with activity limitations in the past month" &&
            d.Data_Value_Type === "Mean" &&
            (d.StratificationCategory1 === "Age Group" ||
             d.StratificationCategory === "Age Group")
        );
        return test;
    }
}
