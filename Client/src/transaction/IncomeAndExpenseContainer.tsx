import calenderIcon from "/calendar.png";
import commentIcon from "/comment.png";
import dollarIcon from "/dollar.png";
import deleteIcon from "/delete.png";
import { useToastContext } from "../Context/useToastContext";
import { customAxios } from "../utils/custom-axios";
import { ExpenseType } from "../types/Expense";
import { IncomeType } from "../types/Income";

export function ExpenseContainer({
  expense,
  setExpenses,
  setTotalExpenses,
}: {
  expense: ExpenseType;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseType[]>>;
  setTotalExpenses?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { toast } = useToastContext();

  let date = expense
    ? expense.date.split("T")[0].split("-").reverse().join("-")
    : "";

  const handleDelete = async () => {
    try {
      await customAxios.delete(`/expense/delete-expense/${expense._id}`);

      setExpenses((prev) => {
        return prev.filter((item) => {
          return item._id !== expense._id;
        });
      });

      if (setTotalExpenses) {
        setTotalExpenses((prev) => {
          return prev - expense.amount;
        });
      }
      toast("Success", "Deleted successfully!");
    } catch (err) {
      toast("Error", "Unexpected error occured");
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

export function IncomeContainer({
  income,
  setIncome,
  setTotalIncome,
}: {
  income: IncomeType;
  setIncome: React.Dispatch<React.SetStateAction<IncomeType[]>>;
  setTotalIncome?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { toast } = useToastContext();

  const date = income.date.split("T")[0].split("-").reverse().join("-");

  const handleDelete = async () => {
    try {
      await customAxios.delete(`/income/delete-income/${income._id}`);

      setIncome((prev) => {
        let filteredIncome = prev.filter((item) => {
          return item._id !== income._id;
        });

        return filteredIncome;
      });

      if (setTotalIncome) {
        setTotalIncome((prev) => {
          return prev - income.amount;
        });
      }

      toast("Success", "Deleted successfully!");
    } catch (err) {
      toast("Error", "Unexpected error occured");
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
