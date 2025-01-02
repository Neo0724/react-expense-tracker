import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import axios from "axios";
import { navbarItems } from "../Component/navbarItems";
import { useCookies } from "react-cookie";

export const GlobalContext = React.createContext();

// eslint-disable-next-line react/prop-types
export const GlobalContextProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_LOCAL_URL;

  const userOwner = localStorage.getItem("User ID");

  // eslint-disable-next-line no-unused-vars
  const [cookies, _] = useCookies(["access_token"]);

  const [close, setClose] = useState(true);

  const [loginErr, setLoginErr] = useState({ text: "", error: false });

  const dictForMonth = new Map();

  dictForMonth.set("all", "every month");
  dictForMonth.set("01", "January");
  dictForMonth.set("02", "February");
  dictForMonth.set("03", "March");
  dictForMonth.set("04", "April");
  dictForMonth.set("05", "May");
  dictForMonth.set("06", "June");
  dictForMonth.set("07", "July");
  dictForMonth.set("08", "August");
  dictForMonth.set("09", "September");
  dictForMonth.set("10", "October");
  dictForMonth.set("11", "November");
  dictForMonth.set("12", "December");

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

  const getTotalExpensesByMonthAndYear = (expenses) => {
    if (!expenses || expenses.length === 0) {
      return 0;
    }

    return expenses
      .reduce((acc, expense) => acc + expense.amount, 0)
      .toFixed(2);
  };

  const getTotalIncomeByMonthAndYear = (income) => {
    if (!income || income.length === 0) {
      return 0;
    }

    return income.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
  };

  const getBalance = (totalExpenses, totalIncome) => {
    return (totalIncome - totalExpenses).toFixed(2);
  };

  const fetchExpenses = useCallback(
    async (month, year, type) => {
      try {
        if (!userOwner) {
          return [];
        }

        const response = await axios.get(
          `${BASE_URL}/expense/get-expense/${userOwner}/${month.toString()}/${year.toString()}/${type}`,
          { headers: { authorization: cookies.access_token } }
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    [BASE_URL, cookies.access_token, userOwner]
  );

  const fetchIncome = useCallback(
    async (month, year, type) => {
      try {
        if (!userOwner) {
          return [];
        }

        const response = await axios.get(
          `${BASE_URL}/income/get-income/${userOwner}/${month.toString()}/${year.toString()}/${type}`,
          { headers: { authorization: cookies.access_token } }
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    [BASE_URL, cookies.access_token, userOwner]
  );

  const getHistory = async (month, year) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/expense/get-history/${userOwner}/${month.toString()}/${year.toString()}`,
        { headers: { authorization: cookies.access_token } }
      );

      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        fetchExpenses,
        fetchIncome,
        BASE_URL,
        setNavbar,
        navbar,
        getTotalExpensesByMonthAndYear,
        getTotalIncomeByMonthAndYear,
        getBalance,
        getHistory,
        setClose,
        close,
        setLoginErr,
        loginErr,
        dictForMonth,
        cookies,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
