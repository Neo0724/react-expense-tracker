import React from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import { useGlobalContext } from '../Context/GlobalContextProvider';
import { all } from 'axios';
ChartJs.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

export default function Chart() {
    const { income, expenses, month } = useGlobalContext();

    let filteredIncome = income.filter(item => {
        if ( month === "all") return item 
        return item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === month
    })

    let filteredExpense = expenses.filter(item => {
        if ( month === "all") return item 
        return item.date.split("T")[0].split("-").reverse().join("-").split("-")[1].toString() === month
    })

    const incomeAmount = filteredIncome.map(item => item.amount);

    const expensesAmount = filteredExpense.map(item => item.amount);

    const incomeDate = filteredIncome.map(item => {
        const formattedDate =  item.date.split("T")[0].split("-").reverse().join("-");
        return formattedDate;
    });

    const expensesDate = filteredExpense.map(item => {
        const formattedDate =  item.date.split("T")[0].split("-").reverse().join("-");
        return formattedDate;
    });

    const allDate = [...incomeDate, ...expensesDate]

    const handleResize = () => {
        console.log("Resized")
    }

    const options = {
        maintainAspectRatio: false,
        responsive: true
    }

    const data = {
        labels: filteredIncome.length === 0 && filteredExpense.length === 0 ? [] : allDate,

        datasets: [
            {
                label: "Income",
                data: filteredIncome.length === 0 ? [] : incomeAmount,
                backgroundColor: "green"
            },
            {
                label: "Expenses",
                data: filteredExpense.length === 0 ? [] : expensesAmount,
                backgroundColor: "red"
            }
        ],
    };

    allDate.sort((a, b) => new Date(a) - new Date(b))

    return (
        <div className="chartContainer">
            <Line data={data} options={options}/>
        </div>
    );
}
