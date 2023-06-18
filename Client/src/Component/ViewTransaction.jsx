import { useGlobalContext } from "../Context/GlobalContextProvider"
import { ExpenseContainer } from "./IncomeAndExpenseContainer"
import { IncomeContainer } from "./IncomeAndExpenseContainer"

export default function ViewTransaction() {
    const { income, expenses } = useGlobalContext()
  return (
    <div className="viewTransactionContainer">
        <div className="viewIncomeContainer">
            <div className="viewTransactionTitle">All Income Transaction</div>
            <div className="viewIncomeDetailsContainer">
                {income.map(income => {
                    const randomID = crypto.randomUUID()
                    return <IncomeContainer income={income} key={randomID}/>
                })}
            </div>
        </div>
        <div className="viewExpensesContainer">
            <div className="viewTransactionTitle">All Expenses Transaction</div>
            <div className="viewExpensesDetailsContainer">
                {expenses.map(expenses => {
                    const randomID = crypto.randomUUID()
                    return <ExpenseContainer expenses={expenses} key={randomID}/>
                })}
            </div>
        </div>
    </div>
  )
}
