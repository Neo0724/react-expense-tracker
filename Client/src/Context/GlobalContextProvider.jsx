/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-case-declarations */
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { navbarItems } from "../Component/navbarItems";
import { useCookies } from "react-cookie";
import { useCallback } from "react";

export const GlobalContext = React.createContext();

export const GlobalContextProvider = ({ children }) => {
  const BASE_URL = "https://mern-expense-tracker-213j.onrender.com";

  const [expenses, setExpenses] = useState([]);

  const [income, setIncome] = useState([]);

  const userOwner = localStorage.getItem("User ID");

  const [cookies, _] = useCookies(["access_token"]);

  const [close, setClose] = useState(true);

  const [loginErr, setLoginErr] = useState({ text: "", error: false });

  const [dashboardMonth, setDashboardMonth] = useState("all");

  const [dashboardYear, setDashboardYear] = useState("all");

  const [transactionMonth, setTransactionMonth] = useState({
    income: "all",
    expense: "all",
  });

  const [transactionYear, setTransactionYear] = useState({
    income: "all",
    expense: "all",
  });

  const dictForMonth = {
    all: "Every Months",
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const [navbar, setNavbar] = useState(() => {
    const exist = localStorage.getItem("Navbar");
    if (exist) {
      return JSON.parse(exist);
    }

    return navbarItems;
  });

  useEffect(() => {
    localStorage.setItem("Navbar", JSON.stringify(navbar));
  }, [navbar]);

  const getTotalIncomeByMonthAndYear = () => {
    if (income.length === 0) {
      return 0;
    }

    let totalIncome = 0;

    // Show all
    if (dashboardMonth === "all" && dashboardYear === "all") {
      income.map((item) => {
        totalIncome += item.amount;
      });
    } 
    // Show specific year
    else if (dashboardMonth === "all" && dashboardYear !== "all") {
      income.forEach((item) => {
        if (
          item.date.split("T")[0].split("-")[0].toString() ===
          dashboardYear
        ) {
          totalIncome += item.amount;
        }
      });
    } 
    // Show specific month
    else if (dashboardMonth !== "all" && dashboardYear === "all") {
      income.forEach((item) => {
        if (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        ) {
          totalIncome += item.amount;
        }
      });
    } 
    // Show specific year and month
    else {
      income.forEach((item) => {
        if (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth &&
          item.date.split("T")[0].split("-")[0].toString() ===
            dashboardYear
        ) {
          totalIncome += item.amount;
        }
      });
    }

    return totalIncome.toFixed(2);
  };

  const getAllExpenses = () => {
    if (expenses.length === 0) return 0;

    let totalExpenses = 0;

    expenses.forEach((expense) => {
      totalExpenses += expense.amount;
    });

    return totalExpenses.toFixed(2);
  };

  const getAllIncome = () => {
    if (income.length === 0) return 0;

    let totalIncome = 0;

    income.forEach((income) => {
      totalIncome += income.amount;
    });

    return totalIncome.toFixed(2);
  };

  const getTotalExpensesByMonthAndYear = () => {
    if (expenses.length === 0) {
      return 0;
    }

    let totalExpenses = 0;

    // Show all
    if (dashboardMonth === "all" && dashboardYear === "all") {
      expenses.map((item) => {
        totalExpenses += item.amount;
      });
    } 
    // Show specific year
    else if (dashboardMonth === "all" && dashboardYear !== "all") {
      expenses.forEach((item) => {
        if (
          item.date.split("T")[0].split("-")[0].toString() ===
          dashboardYear
        ) {
          totalExpenses += item.amount;
        }
      });
    } 
    // Show specific month
    else if (dashboardMonth !== "all" && dashboardYear === "all") {
      expenses.forEach((item) => {
        if (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        ) {
          totalExpenses += item.amount;
        }
      });
    } 
    // Show specific year and month
    else {
      expenses.forEach((item) => {
        if (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth &&
          item.date.split("T")[0].split("-")[0].toString() ===
            dashboardYear
        ) {
          totalExpenses += item.amount;
        }
      });
    }

    return totalExpenses.toFixed(2);
  };

  const getBalance = () => {
    return (
      getTotalIncomeByMonthAndYear(dashboardMonth) -
      getTotalExpensesByMonthAndYear(dashboardMonth)
    ).toFixed(2);
  };

  const fetchExpenses = useCallback(async () => {
    try {
      if (!userOwner) {
        setExpenses([]);
        return;
      }
      const response = await axios.get(
        `${BASE_URL}/expense/get-expense/${userOwner}`,
        { headers: { authorization: cookies.access_token } }
      );
      setExpenses(response.data);
    } catch (err) {
      console.log(err);
    }
  }, [userOwner, cookies.access_token]);

  const fetchIncome = useCallback(async () => {
    try {
      if (!userOwner) {
        setIncome([]);
        return;
      }
      const res = await axios.get(
        `${BASE_URL}/income/get-income/${userOwner}`,
        { headers: { authorization: cookies.access_token } }
      );
      setIncome(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [userOwner, cookies.access_token]);

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, [cookies.access_token, userOwner, fetchExpenses, fetchIncome]);

  const getSelectedMonthHistoryTransaction = () => {
    let selectedMonthIncome = income.filter((item) => {
      if (dashboardMonth === "all") {
        return item;
      } else {
        return (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        );
      }
    });

    let selectedMonthExpense = expenses.filter((item) => {
      if (dashboardMonth === "all") {
        return item;
      } else {
        return (
          item.date
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
            .split("-")[1]
            .toString() === dashboardMonth
        );
      }
    });
    const history = [...selectedMonthIncome, ...selectedMonthExpense].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return history.splice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        expenses,
        income,
        setExpenses,
        setIncome,
        fetchExpenses,
        fetchIncome,
        BASE_URL,
        setNavbar,
        navbar,
        getTotalExpensesByMonthAndYear,
        getTotalIncomeByMonthAndYear,
        getBalance,
        getSelectedMonthHistoryTransaction,
        setClose,
        close,
        setLoginErr,
        loginErr,
        dashboardMonth,
        setDashboardMonth,
        transactionMonth,
        setTransactionMonth,
        dictForMonth,
        getAllIncome,
        getAllExpenses,
        transactionYear,
        setTransactionYear,
        dashboardYear,
        setDashboardYear,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
