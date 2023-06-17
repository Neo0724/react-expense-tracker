import axios from "axios"
import { useGlobalContext } from "../Context/GlobalContextProvider"
import calenderIcon from "../../public/calendar.png"
import commentIcon from "../../public/comment.png"
import dollarIcon from "../../public/dollar.png"
import deleteIcon from "../../public/delete.png"

export function ExpenseContainer({ expenses, setExpenses }) {
  let date = expenses.date.split("T")[0].split("-").reverse().join("-")

  const { fetchExpenses, BASE_URL } = useGlobalContext()

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/expense/delete-expense/${expenses._id}`)
      fetchExpenses()
      alert("Deleted successful")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="incomeAndExpenseContainer">
        <div className="upperContainer">
          <img src={`../../public/${expenses.category}.png`} alt="" className="categoryIcon" />
          <div className="details">
            <div className="detailsUpperContainer">
              <div className="redDot"></div>
              <div className="title">{expenses.title}</div>
            </div>
            <div className="detailsLowerContainer">
              <div className="amount"> 
                <img src={dollarIcon} alt="dollarIcon" className="dollarIcon"/> 
                <div className="amountText">{expenses.amount}</div>
              </div>
              <div className="date">
                <img src={calenderIcon} alt="calenderIcon" className="calenderIcon"/> 
                <div className="dateText">{date}</div>
              </div>
              <div className="description"> 
                <img src={commentIcon} alt="commentIcon" className="commentIcon"/> 
                <div className="descriptionText">{expenses.description}</div>
              </div>
            </div>
          </div>
          <img src={deleteIcon} alt="deleteIcon" className="deleteIcon" onClick={handleDelete}/>
        </div>
    </div>
  )
}

export function IncomeContainer({ income, setIncome }) {
  let date = income.date.split("T")[0].split("-").reverse().join("-")

  const { fetchIncome, BASE_URL } = useGlobalContext()
  console.log(BASE_URL)
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/income/delete-income/${income._id}`)
      alert("Deleted successful")
      fetchIncome()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="incomeAndExpenseContainer">
        <div className="upperContainer">
          <img src={`../../public/${income.category}.png`} alt="" className="categoryIcon" />
          <div className="details">
            <div className="detailsUpperContainer">
              <div className="greenDot"></div>
              <div className="title">{income.title}</div>
            </div>
            <div className="detailsLowerContainer">
              <div className="amount"> 
                <img src={dollarIcon} alt="dollarIcon" className="dollarIcon"/> 
                <div className="amountText">{income.amount}</div>
              </div>
              <div className="date"> 
                <img src={calenderIcon} alt="calenderIcon" className="calenderIcon"/> 
                <div className="dateText">{date}</div>
              </div>
              <div className="description"> 
                <img src={commentIcon} alt="commentIcon" className="commentIcon"/> 
                <div className="descriptionText">{income.description}</div>
              </div>
            </div>
          </div>
          <img src={deleteIcon} alt="deleteIcon" className="deleteIcon" onClick={handleDelete}/>
        </div>
    </div>
  )
}
