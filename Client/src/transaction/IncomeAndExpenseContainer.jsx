/* eslint-disable react/prop-types */
import axios from "axios";
import { useGlobalContext } from "../Context/useGlobalContext";
import calenderIcon from "/calendar.png";
import commentIcon from "/comment.png";
import dollarIcon from "/dollar.png";
import deleteIcon from "/delete.png";
import { useCookies } from "react-cookie";

export function ExpenseContainer({ expense, setExpenses, setTotalExpenses }) {
  let date = expense
    ? expense.date.split("T")[0].split("-").reverse().join("-")
    : "";

  const { BASE_URL } = useGlobalContext();

  // eslint-disable-next-line no-unused-vars
  const [cookies, _] = useCookies(["access_token"]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/expense/delete-expense/${expense._id}`, {
        headers: { authorization: cookies.access_token },
      });

      setExpenses((prev) => {
        return prev.filter((item) => {
          return item._id !== expense._id;
        });
      });

      setTotalExpenses((prev) => {
        return prev - expense.amount;
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="incomeAndExpenseContainer">
      <div className="upperContainer">
        <img src={`${expense.category}.png`} alt="" className="categoryIcon" />
        <div className="details">
          <div className="detailsUpperContainer">
            <div className="redDot"></div>
            <div className="title">{expense.title}</div>
          </div>
          <div className="detailsLowerContainer">
            <div className="amount">
              <img src={dollarIcon} alt="dollarIcon" className="dollarIcon" />
              <div className="amountText">{expense.amount}</div>
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
              <div className="descriptionText">{expense.description}</div>
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

export function IncomeContainer({ income, setIncome, setTotalIncome }) {
  const date = income.date.split("T")[0].split("-").reverse().join("-");

  const { BASE_URL } = useGlobalContext();

  // eslint-disable-next-line no-unused-vars
  const [cookies, _] = useCookies(["access_token"]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/income/delete-income/${income._id}`, {
        headers: { authorization: cookies.access_token },
      });

      setIncome((prev) => {
        let filteredIncome = prev.filter((item) => {
          return item._id !== income._id;
        });

        return filteredIncome;
      });

      setTotalIncome((prev) => {
        return prev - income.amount;
      });
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

