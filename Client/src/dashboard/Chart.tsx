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
import { IncomeType } from "../types/Income";
import { ExpenseType } from "../types/Expense";
ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Chart({
  incomes,
  expenses,
  dashboardMonth,
  dashboardYear,
}: {
  incomes: IncomeType[];
  expenses: ExpenseType[];
  dashboardMonth: string;
  dashboardYear: string;
}) {
  const { dictForMonth } = useGlobalContext();

  const filteredIncomeByMonth = (): [string, [string, number]][] => {
    if (!incomes || incomes.length === 0) return [];

    // Show all or specific year and all month
    // Map = { "January": ["01", 100] }
    if (dashboardMonth === "all") {
      const dateHash = new Map<string, [string, number]>();
      for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, "0");
        dateHash.set(month, [month, 0]);
      }

      incomes.forEach((item) => {
        const date = item.date.split("T")[0].split("-").reverse();

        if (dateHash.has(date[1])) {
          dateHash.set(date[1], [
            date[1],
            dateHash.get(date[1])![1] + item.amount,
          ]);
        }
      });

      let dateArr = [...dateHash];

      dateArr.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );

      return dateArr.map((item) => {
        const monthWord = dictForMonth.get(item[0]) as string;
        return [monthWord, item[1]];
      });
    }
    // Show specific month
    //  Map = { "2024-07-24", ["2024-07-24", 154.5] }
    else {
      let dateHash = new Map<string, [string, number]>();

      incomes.forEach((item) => {
        const formattedDate = item.date.split("T")[0].split("-").join("-");

        if (dateHash.has(formattedDate)) {
          dateHash.set(formattedDate, [
            formattedDate,
            dateHash.get(formattedDate)![1] + item.amount,
          ]);
        } else {
          dateHash.set(formattedDate, [formattedDate, item.amount]);
        }
      });

      let dateArr = [...dateHash];

      dateArr.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );

      return dateArr.map((item) => {
        const monthWord = dictForMonth.get(item[0]) as string;
        return [monthWord, item[1]];
      });
    }
  };

  const filteredExpensesByMonth = () => {
    if (!expenses || expenses.length === 0) return [];

    // Show all or specific year and all month
    // Map = { 08: [08, 100] }
    if (dashboardMonth === "all") {
      const dateHash = new Map<string, [string, number]>();
      for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, "0");
        dateHash.set(month, [month, 0]);
      }
      expenses.forEach((item) => {
        const date = item.date.split("T")[0].split("-").reverse();

        if (dateHash.has(date[1])) {
          dateHash.set(date[1], [
            date[1],
            dateHash.get(date[1])![1] + item.amount,
          ]);
        } else {
          dateHash.set(date[1], [date[1], item.amount]);
        }
      });

      let dateArr = [...dateHash];

      dateArr.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );

      return dateArr.map((item) => {
        const monthWord = dictForMonth.get(item[0]);
        return [monthWord, item[1]];
      });
    }
    // Show specific month
    //  Map = { "2024-07-24", ["2024-07-24", 154.5] }
    else {
      let dateHash = new Map();
      expenses.forEach((item) => {
        const formattedDate = item.date.split("T")[0].split("-").join("-");

        if (dateHash.has(formattedDate)) {
          dateHash.set(formattedDate, [
            formattedDate,
            dateHash.get(formattedDate)[1] + item.amount,
          ]);
        } else {
          dateHash.set(formattedDate, [formattedDate, item.amount]);
        }
      });

      let dateArr = [...dateHash];

      dateArr.sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
      );
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

  // console.log(filteredExpensesByMonth());

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
