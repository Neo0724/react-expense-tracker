import { useGlobalContext } from "../Context/GlobalContextProvider"
import Chart from "./Chart"
import { HistoryContainer } from "./IncomeAndExpenseContainer"
import { useState } from "react"

export default function Dashboard() {
  const { getTotalExpenses, getTotalIncome, getBalance, getSelectedMonthHistoryTransaction, dashboardMonth, setDashboardMonth, dictForMonth } = useGlobalContext()
  
  const style = {
    color: getBalance() < 0 ? "red" : "green"
  }

  const changeMonth = (e) => {
    setDashboardMonth(e.target.value)
  }


  const MonthSelect = () => {
    return (
        <select placeholder="1" value={dashboardMonth} onChange={(e) => changeMonth(e)} className="monthSelector">
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
    )
  }

  return (
    <div className="dashboardContainer">
      <div className="overview">Month: <MonthSelect /></div>
      <Chart />
      <div className="amountAndHistoryContainer">
        <div className="amountContainer">
          <div className="expenseAndIncomeDashboard">
            <div className="totalExpensesDashboard" style={{ color: "red"}}>Total Expenses:  ${getTotalExpenses(dashboardMonth)}</div>
            <div className="totalIncomeDashboard" style={{ color: "green"}}>Total Income:  ${getTotalIncome(dashboardMonth)}</div>
          </div>
          <div className="totalBalanceDashboard" style={style}>Total Balance: ${getBalance(dashboardMonth)}</div>
        </div>
        <div className="historyContainer">
          <div className="historyContainerTitle">Transaction History on {dictForMonth[dashboardMonth]}: </div>
          {!getSelectedMonthHistoryTransaction(dashboardMonth).length ? <div className="empty">Empty</div> : null}
          {getSelectedMonthHistoryTransaction(dashboardMonth).map(item => {
            const randomID = crypto.randomUUID()
            return <HistoryContainer history={item} key={randomID}/>
          })}
        </div>
      </div>
    </div>
  )
}
