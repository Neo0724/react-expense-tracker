import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { customAxios } from "../utils/custom-axios";
import { navbarItems } from "../nav/navbarItems";
import { ExpenseType } from "../types/Expense";
import { IncomeType } from "../types/Income";
import { HistoryType } from "../types/History";
import { NavbarItemType } from "../types/NavbarItem";
import { GlobalContextType } from "../types/GlobalContext";

export const GlobalContext = React.createContext({} as GlobalContextType);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [close, setClose] = useState(true);

  const [loginErr, setLoginErr] = useState({ text: "", error: false });

  const dictForMonth = new Map<string, string>();

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

  const [navbar, setNavbar] = useState<NavbarItemType[]>(() => {
    const exist = localStorage.getItem("Navbar");
    if (exist) {
      return JSON.parse(exist);
    }

    return navbarItems;
  });

  useEffect(() => {
    localStorage.setItem("Navbar", JSON.stringify(navbar));
  }, [navbar]);

  const getTotalExpensesByMonthAndYear = (expenses: ExpenseType[]): number => {
    if (!expenses || expenses.length === 0) {
      return 0;
    }

    return Number(
      expenses
        .reduce((acc: number, expense) => acc + expense.amount, 0)
        .toFixed(2),
    );
  };

  const getTotalIncomeByMonthAndYear = (incomes: IncomeType[]): number => {
    if (!incomes || incomes.length === 0) {
      return 0;
    }

    return Number(
      incomes
        .reduce((acc: number, item: IncomeType) => acc + item.amount, 0)
        .toFixed(2),
    );
  };

  const getBalance = (totalExpenses: number, totalIncome: number): number => {
    return Number((totalIncome - totalExpenses).toFixed(2));
  };

  const fetchExpenses = useCallback(
    async (
      month: string,
      year: string,
      type: string,
    ): Promise<ExpenseType[]> => {
      let expenses: ExpenseType[] = [];
      try {
        const res = await customAxios.get(
          `/expense/get-expense/${month.toString()}/${year.toString()}/${type}`,
        );

        if (res.data.success) {
          expenses = res.data.data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        return expenses;
      }
    },
    [],
  );

  const fetchIncome = useCallback(
    async (
      month: string,
      year: string,
      type: string,
    ): Promise<IncomeType[]> => {
      let incomes: IncomeType[] = [];

      try {
        const res = await customAxios.get(
          `/income/get-income/${month.toString()}/${year.toString()}/${type}`,
        );

        if (res.data.success) {
          incomes = res.data.data;
        }
      } catch (err) {
        console.log(err);
      } finally {
        return incomes;
      }
    },
    [],
  );

  const getHistory = async (
    month: string,
    year: string,
  ): Promise<HistoryType[]> => {
    let histories: HistoryType[] = [];
    try {
      const res = await customAxios.get(
        `/expense/get-history/${month.toString()}/${year.toString()}`,
      );

      if (res.data.success) {
        histories = res.data.data;
      }
    } catch (err) {
      console.log(err);
    } finally {
      return histories;
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        fetchExpenses,
        fetchIncome,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
