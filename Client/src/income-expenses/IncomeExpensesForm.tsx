import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../Context/useGlobalContext";
import { useToastContext } from "../Context/useToastContext";
import { customAxios } from "../utils/custom-axios";
import { useAuthContext } from "../Context/useAuthContext";
import { IncomeType } from "../types/Income";
import { ExpenseType } from "../types/Expense";

export default function IncomeExpensesForm({
  type,
  setIncome,
  setExpenses,
  setTotalIncome,
  setTotalExpenses,
}:
  | {
      type: "expense";
      setExpenses: React.Dispatch<React.SetStateAction<ExpenseType[]>>;
      setTotalExpenses: React.Dispatch<React.SetStateAction<number>>;
      setTotalIncome?: undefined;
      setIncome?: undefined;
    }
  | {
      type: "income";
      setIncome: React.Dispatch<React.SetStateAction<IncomeType[]>>;
      setTotalIncome: React.Dispatch<React.SetStateAction<number>>;
      setExpenses?: undefined;
      setTotalExpenses?: undefined;
    }) {
  const {
    setClose,
    fetchIncome,
    fetchExpenses,
    getTotalExpensesByMonthAndYear,
    getTotalIncomeByMonthAndYear,
  } = useGlobalContext();
  const [data, setData] = useState({
    title: "",
    amount: 0,
    date: new Date(),
    category: "",
    description: "",
    userOwner: "",
  });

  const userOwner = localStorage.getItem("User ID");
  const { toast } = useToastContext();
  const { isAuthenticated } = useAuthContext();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
    type: string,
  ) => {
    switch (type) {
      case "title":
        setData((prev) => {
          return { ...prev, title: e.target.value };
        });
        break;

      case "amount":
        setData((prev) => {
          return {
            ...prev,
            amount: parseFloat(e.target.value),
          };
        });
        break;

      case "category":
        setData((prev) => {
          let category = e.target.value;
          category === "foodandbeverage"
            ? (category = "Food and Beverage")
            : category;

          if (e.target.value === "other") {
            return { ...prev, category: e.target.value, title: "" };
          } else {
            return {
              ...prev,
              category: e.target.value,
              title: category.charAt(0).toUpperCase() + category.slice(1),
            };
          }
        });
        return;

      case "description":
        setData((prev) => {
          return { ...prev, description: e.target.value };
        });
        return;

      default:
        return;
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setData((prev) => {
        return { ...prev, date: date };
      });
    }
  };

  const submitIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!isAuthenticated) {
        setClose((prev) => !prev);
        return;
      }

      const formDataWithUserId = {
        ...data,
        userOwner,
        date: data.date ? data.date.toISOString() : null,
      };

      const res = await customAxios.post(`/income/add-income`, {
        ...formDataWithUserId,
      });

      if (res.status === 200) {
        const updatedIncome = await fetchIncome("all", "all", "all");
        if (type === "income") {
          setIncome(updatedIncome);
          setTotalIncome(() => {
            return getTotalIncomeByMonthAndYear(updatedIncome);
          });
        }
        toast("Success", "New income added successfully");
      } else {
        toast("Error", "Unexpected error occured. Please try again later");
      }
    } catch (err) {
      console.log(err);
      toast("Error", "Unexpected error occured. Please try again later");
    }
  };

  const submitExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!isAuthenticated) {
        setClose((prev) => !prev);
        return;
      }

      console.log(data.date.toISOString());

      const formDataWithUserId = {
        ...data,
        userOwner,
        date: data.date ? data.date.toISOString() : null,
      };

      const res = await customAxios.post(`/expense/add-expense`, {
        ...formDataWithUserId,
      });

      if (res.status === 200) {
        const updatedExpenses = await fetchExpenses("all", "all", "all");
        if (type === "expense") {
          setExpenses(updatedExpenses);
          setTotalExpenses(() => {
            return getTotalExpensesByMonthAndYear(updatedExpenses);
          });
        }
        toast("Success", "New expense added successfully");
      } else {
        toast("Error", "Unexpected error occured. Please try again later");
      }
    } catch (err) {
      console.log(err);
      toast("Error", "Unexpected error occured. Please try again later");
    }
  };

  const IncomeSelect = () => {
    return (
      <select
        required
        value={data.category}
        onChange={(e) => handleChange(e, "category")}
      >
        <option value="" disabled>
          Select an option
        </option>
        <option value="salary">Salary</option>
        <option value="freelancing">Freelancing</option>
        <option value="investment">Investment</option>
        <option value="scholarship">Scholarship</option>
        <option value="bank">Bank Transfer</option>
        <option value="other">Other</option>
      </select>
    );
  };

  const ExpensesSelect = () => {
    return (
      <select
        required
        value={data.category}
        onChange={(e) => handleChange(e, "category")}
      >
        <option value="" disabled>
          Select an option
        </option>
        <option value="accomodation">Accomodation</option>
        <option value="foodandbeverage">Food And Beverage</option>
        <option value="medical">Medical</option>
        <option value="transport">Trasnsport Fee</option>
        <option value="stationary">Stationary</option>
        <option value="other">Other</option>
      </select>
    );
  };

  return (
    <form
      action="POST"
      className="formContainer"
      onSubmit={(e) => {
        type === "income" ? submitIncome(e) : submitExpense(e);
      }}
    >
      <input
        type="number"
        step="any"
        className="amountInput"
        placeholder="Enter the amount..."
        required
        value={data.amount}
        onChange={(e) => handleChange(e, "amount")}
      />
      <ReactDatePicker
        wrapperClassName="max-w-[450px] w-full"
        dateFormat="dd/MM/yyyy"
        selected={data.date}
        onChange={(date) => handleDateChange(date)}
        placeholderText="Select a date..."
        startDate={data.date}
      />
      {type === "income" ? <IncomeSelect /> : <ExpensesSelect />}
      {data.category === "other" ? (
        <input
          type="text"
          className="titleInput"
          placeholder="Enter the title..."
          required
          value={data.title}
          onChange={(e) => handleChange(e, "title")}
        />
      ) : null}
      <textarea
        cols={30}
        rows={6}
        maxLength={70}
        placeholder="Enter description"
        className="descriptionInput"
        value={data.description}
        onChange={(e) => handleChange(e, "description")}
      ></textarea>
      <button className="submitBtn" type="submit">
        submit
      </button>
    </form>
  );
}
