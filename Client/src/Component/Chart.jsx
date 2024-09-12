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

    const filteredIncomeByMonth = () => {
        let dateHash = new Map();

        income.forEach((item) => {
            const formattedDate = item.date.split("T")[0].split("-").join("-");
            if (Object.prototype.hasOwnProperty.call(dateHash, formattedDate)) {
                console.log(dateHash);
                dateHash[formattedDate][1] += item.amount;
            } else {
                dateHash[formattedDate] = [formattedDate, 0];
                dateHash[formattedDate][1] += item.amount;
            }
        });

        let dateArr = Object.values(dateHash);
        dateArr.sort((a, b) => new Date(a) - new Date(b));
        return dateArr;
    }

    const filteredExpensesByMonth = () => {
        let dateHash = new Map();

        expenses.forEach((item) => {
            const formattedDate = item.date.split("T")[0].split("-").join("-");
            if (Object.prototype.hasOwnProperty.call(dateHash, formattedDate)) {
                dateHash[formattedDate][1] += item.amount;
            } else {
                dateHash[formattedDate] = [formattedDate, 0];
                dateHash[formattedDate][1] += item.amount;
            }
        });

        let dateArr = Object.values(dateHash);
        console.log(dateArr);
        dateArr.sort((a, b) => new Date(a) - new Date(b));
        return dateArr;
    };

  const incomeAmount = filteredIncomeByMonth().map((item) => item[1]);

  const expensesAmount = filteredExpensesByMonth().map((item) => item[1]);

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
