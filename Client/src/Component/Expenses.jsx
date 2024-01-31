import Form from "../Form/FormComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
import { ExpenseContainer } from "./IncomeAndExpenseContainer";

export default function Expenses() {
  const { expenses, setExpenses, getTotalExpenses } = useGlobalContext();

  return (
    <div className="expenseUpperContainer">
      <div className="expenseTitle">Expenses</div>
      <div className="totalExpense">Total Expense: $ {getTotalExpenses()}</div>
      <div className="expenseLowerContainer">
        <Form type="expense" />
        <div className="expenseTransactionContainer">
          <div className="listOfExpenses">List of Expenses: </div>
          {!expenses.length ? <div className="empty">Empty ...</div> : null}
          {expenses.map((expenses) => {
            const randomID = crypto.randomUUID();
            return (
              <ExpenseContainer
                expenses={expenses}
                setExpenses={setExpenses}
                key={randomID}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
