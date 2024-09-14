import Form from "../Form/FormComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
import { ExpenseContainer } from "./IncomeAndExpenseContainer";
import { useEffect, useState } from "react";

export default function Expenses() {
    const {
        getTotalExpensesByMonthAndYear,
        fetchExpenses
    } = useGlobalContext();


    const [ expenses, setExpenses ] = useState([])

    const [ totalExpenses, setTotalExpenses ] = useState(0);

    useEffect(() => {
        const updateExpenses = async () => {
            const fetchedExpenses = await fetchExpenses("all", "all");

            setExpenses(fetchedExpenses);
            setTotalExpenses(getTotalExpensesByMonthAndYear(fetchedExpenses));
        };

        updateExpenses();
    }, [])

  return (
     <div className="expenseUpperContainer">
      <div className="expenseTitle">Expenses</div>
      <div className="totalExpense">
        Total Expense: $ {totalExpenses}
      </div>
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
