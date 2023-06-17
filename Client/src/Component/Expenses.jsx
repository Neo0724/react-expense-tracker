import React from 'react'
import Form from '../Form/FormComponent'
import { useContext } from 'react'
import { useGlobalContext } from '../Context/GlobalContextProvider'
import { ExpenseContainer } from './IncomeAndExpenseContainer'

export default function Expenses() {

    const { expenses, setExpenses } = useGlobalContext()

    let totalExpenses = 0;
    expenses.map(item => {
      let amount = item.amount
      totalExpenses += amount
    })

  return (
    <div className="expenseUpperContainer">
      <div className="expenseTitle">Income</div>
      <div className="totalExpense">Total Expense: $ {totalExpenses}</div>
      <div className="expenseLowerContainer">
        <Form type="expense"/>
        <div className="expenseTransactionContainer">
          {!expenses.length ? <div>Empty</div> : null}
          {expenses.map(expenses => {
            const randomID = crypto.randomUUID()
            return <ExpenseContainer expenses={expenses} setExpenses={setExpenses} key={randomID} />
          })}
        </div>
      </div>
    </div>
  )
}
