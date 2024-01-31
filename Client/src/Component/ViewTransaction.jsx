import { useGlobalContext } from "../Context/useGlobalContext";
import { ExpenseContainer } from "./IncomeAndExpenseContainer";
import { IncomeContainer } from "./IncomeAndExpenseContainer";

export default function ViewTransaction() {
  const { income, expenses, transactionMonth, setTransactionMonth } =
    useGlobalContext();

  let selectedDateExpense = expenses.filter((item) => {
    if (transactionMonth.expense === "all") return item;

    return (
      item.date
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-")
        .split("-")[1]
        .toString() === transactionMonth.expense
    );
  });

  let selectedDateIncome = income.filter((item) => {
    if (transactionMonth.income === "all") return item;

    return (
      item.date
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-")
        .split("-")[1]
        .toString() === transactionMonth.income
    );
  });

  const changeMonth = (e, category) => {
    console.log(category);
    setTransactionMonth((prev) => {
      if (category === "income") {
        return { ...prev, income: e.target.value };
      } else {
        return { ...prev, expense: e.target.value };
      }
    });
  };

  const MonthSelect = ({ category }) => {
    return (
      <select
        placeholder="1"
        value={
          category === "income"
            ? transactionMonth.income
            : transactionMonth.expense
        }
        onChange={(e) => changeMonth(e, category)}
        className="monthSelector"
      >
        <option value="all">all</option>
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

  return (
    <div className="viewTransactionContainer">
      <div className="viewIncomeContainer">
        <div className="viewTransactionTitle">
          Income Transactions on : <MonthSelect category="income" />
        </div>
        <div className="viewIncomeDetailsContainer">
          {!selectedDateIncome.length ? (
            <div className="empty">Empty ...</div>
          ) : null}
          {selectedDateIncome.map((income) => {
            const randomID = crypto.randomUUID();
            return <IncomeContainer income={income} key={randomID} />;
          })}
        </div>
      </div>
      <div className="viewExpensesContainer">
        <div className="viewTransactionTitle">
          Expense Transactions on : <MonthSelect category="expense" />
        </div>
        <div className="viewExpensesDetailsContainer">
          {!selectedDateExpense.length ? (
            <div className="empty">Empty ...</div>
          ) : null}
          {selectedDateExpense.map((expenses) => {
            const randomID = crypto.randomUUID();
            return (
              <ExpenseContainer
                expenses={expenses}
                key={randomID}
                transactionMonth={transactionMonth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
