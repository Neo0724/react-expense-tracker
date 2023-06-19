import { useGlobalContext } from "../Context/GlobalContextProvider"
import Chart from "./Chart"
import { HistoryContainer } from "./IncomeAndExpenseContainer"

export default function Dashboard() {
  const { getTotalExpenses, getTotalIncome, getBalance, getHistory } = useGlobalContext()
  
  const style = {
    color: getBalance() < 0 ? "red" : "green"
  }
  return (
    <div className="dashboardContainer">
      <div className="overview">Overview</div>
      <Chart />
      <div className="amountAndHistoryContainer">
        <div className="amountContainer">
          <div className="expenseAndIncomeDashboard">
            <div className="totalExpensesDashboard" style={{ color: "red"}}>Total Expenses:  ${getTotalExpenses()}</div>
            <div className="totalIncomeDashboard" style={{ color: "green"}}>Total Income:  ${getTotalIncome()}</div>
          </div>
          <div className="totalBalanceDashboard" style={style}>Total Balance: ${getBalance()}</div>
        </div>
        <div className="historyContainer">
          <div className="historyContainerTitle">Recent History: </div>
          {!getHistory().length ? <div className="empty">Empty</div> : null}
          {getHistory().map(item => {
            const randomID = crypto.randomUUID()
            return <HistoryContainer history={item} key={randomID}/>
          })}
        </div>
      </div>
    </div>
  )
}
