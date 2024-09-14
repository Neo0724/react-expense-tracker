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
        Total Expense: $ {parseFloat(totalExpenses).toFixed(2)}
      </div>
      <div className="expenseLowerContainer">
        <Form type="expense" setExpenses={setExpenses} setTotalExpenses={setTotalExpenses} />
        <div className="expenseTransactionContainer">
          <div className="listOfExpenses">List of Expenses: </div>
      {!expenses || expenses.length === 0 ? 
          <div className="empty">Empty ...</div> 
          : 
          expenses.map((expense) => {
              const randomID = crypto.randomUUID();
              return (
                  <ExpenseContainer
                  expense={expense}
                  setExpenses={setExpenses}
                  setTotalExpenses={setTotalExpenses}
                  key={randomID}
                  />
              );
          })
      }
          
        </div>
      </div>
    </div>

  );
}
