import React from 'react'
import Form from '../Form/FormComponent'
import { useContext } from 'react'
import { useGlobalContext } from '../Context/GlobalContextProvider'
import { IncomeContainer } from './IncomeAndExpenseContainer'

export default function Income() {
  const { income, setIncome } = useGlobalContext()
  let totalIncome = 0;
  income.map(item => {
    totalIncome += item.amount
  })
  
  return (
    <div className="incomeUpperContainer">
      <div className="incomeTitle">Income</div>
      <div className="totalIncome">Total Income: $ {totalIncome}</div>
      <div className="incomeLowerContainer">
        <Form type="income" />
        <div className="incomeTransactionContainer">
          {income.length === 0 ? <div className='empty'>Empty</div> : null}
          {income.map(income => {
            console.log(income)
            const randomID = crypto.randomUUID()
            return <IncomeContainer income={income} setIncome={setIncome} key={randomID} />
          })}
        </div>
      </div>
    </div>
  )
}
