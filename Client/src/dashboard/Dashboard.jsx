import { useGlobalContext } from "../Context/useGlobalContext";
import Chart from "./Chart";
import { DashboardTransactionHistory } from "./DashboardTransactionHistory";
import { useState, useCallback, useEffect } from "react";

export default function Dashboard() {
  const {
    getTotalExpensesByMonthAndYear,
    getTotalIncomeByMonthAndYear,
    getHistory,
    getBalance,
    dictForMonth,
    fetchExpenses,
    fetchIncome,
  } = useGlobalContext();

  const [dashboardMonth, setDashboardMonth] = useState("all");

  const [dashboardYear, setDashboardYear] = useState("all");

  const [historyTransaction, setHistoryTransaction] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const [income, setIncome] = useState([]);

  const [totalExpensesAmount, setTotalExpensesAmount] = useState(0);

  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);

  const updateIncomeAndExpenses = useCallback(async (month, year) => {
    try {
      const [fetchedExpenses, fetchedIncome, fetchedHistory] =
        await Promise.all([
          fetchExpenses(month, year, "all"),
          fetchIncome(month, year, "all"),
          getHistory(month, year),
        ]);

      setTotalExpensesAmount(getTotalExpensesByMonthAndYear(fetchedExpenses));
      setTotalIncomeAmount(getTotalIncomeByMonthAndYear(fetchedIncome));
      setHistoryTransaction(fetchedHistory);

      setExpenses(fetchedExpenses);
      setIncome(fetchedIncome);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const changeMonth = (e) => {
    const selectedMonth = e.target.value;
    setDashboardMonth(selectedMonth);

    updateIncomeAndExpenses(selectedMonth, dashboardYear);
  };

  const changeYear = (e) => {
    const selectedYear = e.target.value;
    setDashboardYear(selectedYear);

    updateIncomeAndExpenses(dashboardMonth, selectedYear);
  };

  const style = {
    color:
      getBalance(totalExpensesAmount, totalIncomeAmount) < 0 ? "red" : "green",
  };

  useEffect(() => {
    updateIncomeAndExpenses(dashboardMonth, dashboardYear);
  }, []);

  const MonthSelect = () => {
    return (
      <select
        placeholder="1"
        value={dashboardMonth}
        onChange={(e) => changeMonth(e)}
        className="monthSelector"
      >
        <option value="all">All</option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        <option value="04">4</option>
        <option value="05">5</option>
        <option value="06">6</option>
        <option value="07">7</option>
        <option value="08">8</option>
        <option value="09">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
    );
  };

  const YearSelect = () => {
    return (
      <select
        placeholder="2023"
        value={dashboardYear}
        onChange={(e) => changeYear(e)}
        className="monthSelector"
      >
        <option value="all">All</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
      </select>
    );
  };

  const monthAndYearText =
    dashboardYear === "all" && dashboardMonth === "all"
      ? "every month and every year"
      : dashboardYear === "all" && dashboardMonth !== "all"
      ? dictForMonth.get(dashboardMonth) + " , every year"
      : dictForMonth.get(dashboardMonth) + " , " + dashboardYear;

  return (
    <div className="dashboardContainer">
      <div className="overview !text-sm md:!text-lg">
        <div>
          <span>Month: </span>
          <MonthSelect />
        </div>
        {/* Vertical line seperator */}
        <span className="h-5 !border-2 !border-black"></span>
        <div>
          <span>Year: </span>
          <YearSelect />
        </div>
      </div>
      <Chart
        income={income}
        expenses={expenses}
        dashboardMonth={dashboardMonth}
        dashboardYear={dashboardYear}
      />
      <div className="flex flex-col gap-7 md:flex-row mt-10">
        {/* Total exxpenses, income and balance */}
        <div className="flex-1/3">
          <div className="totalBalanceTitle">
            Total balance on {monthAndYearText}
          </div>
          <div className="expenseAndIncomeDashboard">
            <div className="totalExpensesDashboard" style={{ color: "red" }}>
              Total Expenses: ${totalExpensesAmount}
            </div>
            <div className="totalIncomeDashboard" style={{ color: "green" }}>
              Total Income: ${totalIncomeAmount}
            </div>
          </div>
          <div className="totalBalanceDashboard" style={style}>
            Total Balance: ${getBalance(totalExpensesAmount, totalIncomeAmount)}
          </div>
        </div>
        {/* Transaction history */}
        <div className="w-full flex-2/3">
          <div className="historyContainerTitle">
            Most Recent Transaction History on {monthAndYearText}
          </div>
          {!historyTransaction || historyTransaction.length === 0 ? (
            <div className="empty">Empty</div>
          ) : (
            <div className="flex flex-col gap-3">
              {historyTransaction.map((item) => {
                return (
                  <DashboardTransactionHistory history={item} key={item._id} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
