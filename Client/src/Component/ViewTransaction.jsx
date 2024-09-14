import { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "../Context/useGlobalContext";
import { ExpenseContainer } from "./IncomeAndExpenseContainer";
import { IncomeContainer } from "./IncomeAndExpenseContainer";

export default function ViewTransaction() {
    const {
        fetchExpenses,
        fetchIncome
    } = useGlobalContext();

    const [transactionMonth, setTransactionMonth] = useState({
        income: "all",
        expense: "all",
    });

    const [transactionYear, setTransactionYear] = useState({
        income: "all",
        expense: "all",
    });

    const [ expenses, setExpenses ] = useState([])

    const [ income, setIncome ] = useState([])

    const updateIncome = useCallback(async (month, year) => {
        const fetchedIncome = await fetchIncome(month, year)

        setIncome(fetchedIncome)
    }, [fetchIncome])


    const updateExpenses = useCallback(async (month, year) => {
        const fetchedExpenses = await fetchExpenses(month, year)

        setExpenses(fetchedExpenses)
    }, [fetchExpenses])


    const changeMonth = (e, category) => {
        const selectedMonth = e.target.value;

        setTransactionMonth((prev) => ({
            ...prev,
            [category]: selectedMonth
        }));
    };

    const changeYear = (e, category) => {
        const selectedYear = e.target.value;

        setTransactionYear((prev) => ({
            ...prev,
            [category]: selectedYear
        }));
    };

    useEffect(() => {
        updateIncome(transactionMonth.income, transactionYear.income);

    }, [transactionMonth.income, transactionYear.income, updateIncome]);

    useEffect(() => {
        updateExpenses(transactionMonth.expense, transactionYear.expense);

    }, [transactionMonth.expense, transactionYear.expense, updateExpenses]);

    const MonthSelect = ({ category }) => {
        return (
            <select
            placeholder="1"
            value={
                category === "income"
                ? transactionMonth.income
                : transactionMonth.expense
            }
            onChange={(e) => changeMonth(e, category)}
            className="monthSelector"
            >
            <option value="all">all</option>
            <option value="01">1</option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            </select>
        );
    };

    const YearSelect = ({ category }) => {
        return (
            <select
            placeholder="2023"
            value={
                category === "income"
                ? transactionYear.income
                : transactionYear.expense
            }
            onChange={(e) => changeYear(e, category)}
            className="monthSelector"
            >
            <option value="all">all</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            </select>
        );
    };

    return (
        <div className="viewTransactionContainer">
        <div className="viewIncomeContainer">
        <div className="viewTransactionTitle">
        Income Transactions on : Month: <MonthSelect category="income" /> |
        Year: <YearSelect category="income" />
        </div>
        <div className="viewIncomeDetailsContainer">
        {!income || income.length === 0 ? (
            <div className="empty">Empty ...</div>
        ) : 
            income.map((income) => {
            const randomID = crypto.randomUUID();
            return <IncomeContainer income={income} key={randomID} />;
        })}
        </div>
        </div>
        <div className="viewExpensesContainer">
        <div className="viewTransactionTitle">
        Expense Transactions on : Month: <MonthSelect category="expense" /> |
        Year: <YearSelect category="expense" />
        </div>
        <div className="viewExpensesDetailsContainer">
        {!expenses || expenses.length === 0 ? (
            <div className="empty">Empty ...</div>
        ) : expenses.map((expense) => {
            const randomID = crypto.randomUUID();
            return (
                <ExpenseContainer
                expense={expense}
                key={randomID}
                />
            );
        })}
        </div>
        </div>
        </div>
    );
}
