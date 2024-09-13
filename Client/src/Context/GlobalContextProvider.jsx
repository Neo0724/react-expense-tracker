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
    const BASE_URL = "http://localhost:3000";

    // online url =  "https://mern-expense-tracker-213j.onrender.com"

    const [expenses, setExpenses] = useState([]);

    const [income, setIncome] = useState([]);

    const [history, setHistory] = useState([]);

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

    // TODO Implement get transactionYear and transactionMonth income and expenses

    const getIncomeTransactionsByYearAndMonth = async () => {

    }

    const getExpensesTransactionsByYearAndMonth = async () => {

    }

    const getTotalIncomeByMonthAndYear = () => {
        if (income.length === 0) {
            return 0;
        }

        let totalIncome = 0;

        income.forEach((item) => {
            totalIncome += item.amount;
        })

        return totalIncome.toFixed(2);


    };

    const getAllExpenses = () => {
        if (expenses.length === 0) {
            return 0;
        }

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

        expenses.forEach((item) => {
            totalExpenses += item.amount;
        })

        return totalExpenses.toFixed(2);
    };

    const getBalance = () => {
        return (
            getTotalIncomeByMonthAndYear() -
            getTotalExpensesByMonthAndYear()
        ).toFixed(2);
    };

    const fetchExpenses = useCallback(async () => {
        try {
            if (!userOwner) {
                setExpenses([]);
                return;
            }

            const response = await axios.get(
                `${BASE_URL}/expense/get-expense/${userOwner}/${dashboardMonth.toString()}/${dashboardYear.toString()}`,
                { headers: { authorization: cookies.access_token } }
            );
            setExpenses(response.data);
        } catch (err) {
            console.log(err);
        }
    }, [userOwner, cookies.access_token, dashboardMonth, dashboardYear]);

    const fetchIncome = useCallback(async () => {
        try {
            if (!userOwner) {
                setIncome([]);
                return;
            }

            const res = await axios.get(
                `${BASE_URL}/income/get-income/${userOwner}/${dashboardMonth.toString()}/${dashboardYear.toString()}`,
                { headers: { authorization: cookies.access_token } }
            );
            setIncome(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [userOwner, cookies.access_token, dashboardMonth, dashboardYear]);

    const getSelectedMonthHistoryTransaction = useCallback(async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/expense/get-history/${userOwner}/${dashboardMonth.toString()}/${dashboardYear.toString()}`,
                { headers: { authorization: cookies.access_token } }
            );
            setHistory(res.data);
        } catch (err) {
            console.log(err)
        }
    }, [userOwner, cookies.access_token, dashboardMonth, dashboardYear]);

    useEffect(() => {
        getSelectedMonthHistoryTransaction();
        fetchIncome();
        fetchExpenses();
    }, [cookies.access_token, userOwner, fetchExpenses, fetchIncome, getSelectedMonthHistoryTransaction, dashboardMonth, dashboardYear]);

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
                history,
                getIncomeTransactionsByYearAndMonth,
                getExpensesTransactionsByYearAndMonth
        }}
        >
        {children}
        </GlobalContext.Provider>
    );
};
