import axios from "axios";
import { useGlobalContext } from "../Context/useGlobalContext";
import calenderIcon from "/calendar.png";
import commentIcon from "/comment.png";
import dollarIcon from "/dollar.png";
import deleteIcon from "/delete.png";
import { useCookies } from "react-cookie";

export function ExpenseContainer({ expenses }) {
  let date = expenses.date.split("T")[0].split("-").reverse().join("-");

  const { fetchExpenses, BASE_URL } = useGlobalContext();

  const [cookies, _] = useCookies(["access_token"]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/expense/delete-expense/${expenses._id}`, {
        headers: { authorization: cookies.access_token },
      });
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="incomeAndExpenseContainer">
      <div className="upperContainer">
        <img src={`${expenses.category}.png`} alt="" className="categoryIcon" />
        <div className="details">
          <div className="detailsUpperContainer">
            <div className="redDot"></div>
            <div className="title">{expenses.title}</div>
          </div>
          <div className="detailsLowerContainer">
            <div className="amount">
              <img src={dollarIcon} alt="dollarIcon" className="dollarIcon" />
              <div className="amountText">{expenses.amount}</div>
            </div>
            <div className="date">
              <img
                src={calenderIcon}
                alt="calenderIcon"
                className="calenderIcon"
              />
              <div className="dateText">{date}</div>
            </div>
            <div className="description">
              <img
                src={commentIcon}
                alt="commentIcon"
                className="commentIcon"
              />
              <div className="descriptionText">{expenses.description}</div>
            </div>
          </div>
        </div>
        <img
          src={deleteIcon}
          alt="deleteIcon"
          className="deleteIcon"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}

export function IncomeContainer({ income }) {
  const date = income.date.split("T")[0].split("-").reverse().join("-");

  const { fetchIncome, BASE_URL } = useGlobalContext();

  const [cookies, _] = useCookies(["access_token"]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/income/delete-income/${income._id}`, {
        headers: { authorization: cookies.access_token },
      });
      fetchIncome();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="incomeAndExpenseContainer">
      <div className="upperContainer">
        <img src={`${income.category}.png`} alt="" className="categoryIcon" />
        <div className="details">
          <div className="detailsUpperContainer">
            <div className="greenDot"></div>
            <div className="title">{income.title}</div>
          </div>
          <div className="detailsLowerContainer">
            <div className="amount">
              <img src={dollarIcon} alt="dollarIcon" className="dollarIcon" />
              <div className="amountText">{income.amount}</div>
            </div>
            <div className="date">
              <img
                src={calenderIcon}
                alt="calenderIcon"
                className="calenderIcon"
              />
              <div className="dateText">{date}</div>
            </div>
            <div className="description">
              <img
                src={commentIcon}
                alt="commentIcon"
                className="commentIcon"
              />
              <div className="descriptionText">{income.description}</div>
            </div>
          </div>
        </div>
        <img
          src={deleteIcon}
          alt="deleteIcon"
          className="deleteIcon"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}

export function HistoryContainer({ history }) {
  const style = {
    color: history.type === "income" ? "green" : "red",
  };

  return (
    <div className="historyAndExpenseContainer">
      <div className="historyTitle" style={style}>
        {history.title}
      </div>
      <div className="historyAmount" style={style}>
        {history.type === "income" ? `+ ` : `- `}
        {history.amount}
      </div>
    </div>
  );
}
