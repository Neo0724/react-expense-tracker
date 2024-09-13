import { Line } from "react-chartjs-2";
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useGlobalContext } from "../Context/useGlobalContext";
ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart() {
    const { income, expenses, dashboardMonth, dictForMonth, dashboardYear } = useGlobalContext();       

    // TODO Need to fix where for all month or all year, there is undefined 
    const filteredIncomeByMonth = () => {

        // Show all or specific year and all month
        // Map = { 08: [08, 100] }
        if (dashboardMonth === "all" ) {
            let dateHash = new Map();
            income.forEach((item) => {
                const date = item.date.split("T")[0].split("-").reverse();

                if (dateHash.has(date[1])) {
                    dateHash.set(date[1], [date[1], (dateHash.get(date[1])[1] + item.amount)]);
                } else {
                    dateHash.set(date[1],[date[1], item.amount]);
                }
            });

            let dateArr = [];

            for(let item of dateHash) {
                dateArr.push(item);
            } 

            dateArr.sort((a, b) => {
                const dateA = parseInt(a[0]);
                const dateB = parseInt(b[0]);

                return dateA - dateB;
            });

            dateArr.forEach((item) => {
                item[0] = dictForMonth.get(item[0])
            });

            return dateArr;

        } 
        // Show specific month
        //  Map = { "2024-07-24", ["2024-07-24", 154.5] }
        else {
            let dateHash = new Map();
            income.forEach((item) => {
                const formattedDate = item.date.split("T")[0].split("-").join("-");

                if (dateHash.has(formattedDate)) {
                    dateHash.set(formattedDate, [formattedDate, (dateHash.get(formattedDate)[1] + item.amount)]);
                } else {
                    dateHash.set(formattedDate, [formattedDate, item.amount]);
                }
            });
            
            let dateArr = [];

            for(let item of dateHash) {
                dateArr.push(item);
            } 
            dateArr.sort((a, b) => new Date(a) - new Date(b));
            return dateArr;
        }

    }


    const filteredExpensesByMonth = () => {

        // Show all or specific year and all month
        // Map = { 08: [08, 100] }
        if (dashboardMonth === "all") {
            let dateHash = new Map();
            expenses.forEach((item) => {
                const date = item.date.split("T")[0].split("-").reverse();

                if (dateHash.has(date[1])) {
                    dateHash.set(date[1], [date[1], (dateHash.get(date[1])[1] + item.amount)]);
                } else {
                    dateHash.set(date[1],[date[1], item.amount]);
                }
            });

            let dateArr = [];

            for(let item of dateHash) {
                dateArr.push(item);
            } 

            dateArr.sort((a, b) => {
                const dateA = parseInt(a[0]);
                const dateB = parseInt(b[0]);

                return dateA - dateB;
            });

            dateArr.forEach((item) => {
                item[0] = dictForMonth.get(item[0])
            });

            return dateArr;

        } 
        // Show specific month
        //  Map = { "2024-07-24", ["2024-07-24", 154.5] }
        else {
            let dateHash = new Map();
            expenses.forEach((item) => {
                const formattedDate = item.date.split("T")[0].split("-").join("-");

                if (dateHash.has(formattedDate)) {
                    dateHash.set(formattedDate, [formattedDate, (dateHash.get(formattedDate)[1] + item.amount)]);
                } else {
                    dateHash.set(formattedDate, [formattedDate, item.amount]);
                }
            });
            
            let dateArr = [];

            for(let item of dateHash) {
                dateArr.push(item);
            } 
            dateArr.sort((a, b) => new Date(a) - new Date(b));
            return dateArr;
        }

    };

    const incomeAmount = filteredIncomeByMonth().map((item) => item[1][1]);

    const expensesAmount = filteredExpensesByMonth().map((item) => item[1][1]);

    const allDate =
        dashboardMonth === "all"
        ? filteredExpensesByMonth().map((item) => item[0])
        : [
            ...filteredExpensesByMonth().map((item) => item[0]),
            ...filteredIncomeByMonth().map((item) => item[0]),
        ];
    const options = {
        maintainAspectRatio: false,
        responsive: true,
    };

    console.log(incomeAmount)
    const data = {
        labels:
        filteredExpensesByMonth().length === 0 &&
        filteredIncomeByMonth().length === 0
        ? []
        : allDate,

        datasets: [
            {
                label: "Income",
                data: filteredIncomeByMonth().length === 0 ? [] : incomeAmount,
                backgroundColor: "green",
            },
            {
                label: "Expenses",
                data: filteredExpensesByMonth().length === 0 ? [] : expensesAmount,
                backgroundColor: "red",
            },
        ],
    };

    return (
        <div className="chartContainer">
        <Line data={data} options={options} />
        </div>
    );
}
