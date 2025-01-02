/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useGlobalContext } from "../Context/useGlobalContext";
import { useCookies } from "react-cookie";
import { useToastContext } from "../Context/useToastContext";

export default function FormComponent({
  type,
  setIncome,
  setExpenses,
  setTotalIncome,
  setTotalExpenses,
}) {
  const {
    BASE_URL,
    setClose,
    fetchIncome,
    fetchExpenses,
    getTotalExpensesByMonthAndYear,
    getTotalIncomeByMonthAndYear,
  } = useGlobalContext();
  const [data, setData] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
    userOwner: "",
  });

  // eslint-disable-next-line no-unused-vars
  const userOwner = localStorage.getItem("User ID");
  // eslint-disable-next-line no-unused-vars
  const [cookies, _] = useCookies(["access_token"]);
  const { toast } = useToastContext();

  const handleChange = (e, type) => {
    switch (type) {
      case "title":
        setData((prev) => {
          return { ...prev, title: e.target.value };
        });
        break;

      case "amount":
        setData((prev) => {
          return { ...prev, amount: e.target.value };
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

  const handleDateChange = (date) => {
    setData((prev) => {
      return { ...prev, date: date };
    });
  };

  const submitIncome = async (e) => {
    e.preventDefault();
    try {
      if (!cookies.access_token) {
        setClose((prev) => !prev);
        return;
      }
      const formDataWithUserId = { ...data, userOwner };
      const res = await axios.post(
        `${BASE_URL}/income/add-income`,
        { ...formDataWithUserId },
        { headers: { authorization: cookies.access_token } }
      );

      console.log(res);

      if (res.status === 200) {
        const updatedIncome = await fetchIncome("all", "all", "all");
        setIncome(updatedIncome);
        setTotalIncome(() => {
          return getTotalIncomeByMonthAndYear(updatedIncome);
        });
        toast("Success", "New income added successfully");
      } else {
        toast("Error", "Unexpected error occured. Please try again later");
      }
    } catch (err) {
      console.log(err);
      toast("Error", "Unexpected error occured. Please try again later");
    }
  };

  const submitExpense = async (e) => {
    e.preventDefault();
    try {
      if (!cookies.access_token) {
        setClose((prev) => !prev);
        return;
      }
      const formDataWithUserId = { ...data, userOwner };
      const res = await axios.post(
        `${BASE_URL}/expense/add-expense`,
        { ...formDataWithUserId },
        { headers: { authorization: cookies.access_token } }
      );

      if (res.status === 200) {
        const updatedExpenses = await fetchExpenses("all", "all", "all");
        setExpenses(updatedExpenses);
        setTotalExpenses(() => {
          return getTotalExpensesByMonthAndYear(updatedExpenses);
        });
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
        placeholder="Select a category"
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
        placeholder="Select a category"
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
        type="text"
        className="amountInput"
        placeholder="Enter the amount..."
        required
        value={data.amount}
        onChange={(e) => handleChange(e, "amount")}
      />
      <ReactDatePicker
        className="dateInput"
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
        cols="30"
        rows="6"
        maxLength="70"
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
