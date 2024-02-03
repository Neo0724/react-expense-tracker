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
  const { income, expenses, dashboardMonth, dictForMonth } = useGlobalContext();

  const filteredIncomeByMonth = () => {
    let dateHash = {};
    if (dashboardMonth === "all") {
      income.forEach((item) => {
        const date = item.date.split("T")[0].split("-").reverse();

        if (Object.prototype.hasOwnProperty.call(dateHash, date[1])) {
          dateHash[date[1]][1] += item.amount;
        } else {
          dateHash[date[1]] = [date[1], 0];
          dateHash[date[1]][1] += item.amount;
        }
      });

      let dateArr = Object.values(dateHash);
      dateArr.sort((a, b) => {
        const dateA = parseInt(a[0]);
        const dateB = parseInt(b[0]);

        return dateA - dateB;
      });
      dateArr.forEach((item) => (item[0] = dictForMonth[item[0]]));

      return dateArr;
    } else {
      let filteredIncome = income.filter((item) => {
        return (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        );
      });

      filteredIncome.forEach((item) => {
        const formattedDate = item.date.split("T")[0].split("-").join("-");
        if (Object.prototype.hasOwnProperty.call(dateHash, formattedDate)) {
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
  };

  const filteredExpensesByMonth = () => {
    let dateHash = {};
    if (dashboardMonth === "all") {
      expenses.forEach((item) => {
        const date = item.date.split("T")[0].split("-").reverse();

        if (Object.prototype.hasOwnProperty.call(dateHash, date[1])) {
          dateHash[date[1]][1] += item.amount;
        } else {
          dateHash[date[1]] = [date[1], 0];
          dateHash[date[1]][1] += item.amount;
        }
      });
      let dateArr = Object.values(dateHash);
      dateArr.sort((a, b) => {
        const dateA = parseInt(a[0]);
        const dateB = parseInt(b[0]);

        return dateA - dateB;
      });

      dateArr.forEach((item) => (item[0] = dictForMonth[item[0]]));

      return dateArr;
    } else {
      let filteredExpenses = expenses.filter((item) => {
        return (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        );
      });

      filteredExpenses.forEach((item) => {
        const formattedDate = item.date.split("T")[0].split("-").join("-");
        if (Object.prototype.hasOwnProperty.call(dateHash, formattedDate)) {
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
