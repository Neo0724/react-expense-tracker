import React from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import { useGlobalContext } from '../Context/GlobalContextProvider';
import { all } from 'axios';
ChartJs.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)

export default function Chart() {
    const { income, expenses } = useGlobalContext();

    const incomeAmount = income.map(item => item.amount);

    const expensesAmount = expenses.map(item => item.amount);

    const incomeDate = income.map(item => {
        const formattedDate =  item.date.split("T")[0].split("-").reverse().join("-");
        return formattedDate;
    });

    const expensesDate = expenses.map(item => {
        const formattedDate =  item.date.split("T")[0].split("-").reverse().join("-");
        return formattedDate;
    });

    const allDate = [...incomeDate, ...expensesDate]

    const data = {
        labels: income.length === 0 && expenses.length === 0 ? [] : allDate,

        datasets: [
            {
                label: "Income",
                data: income.length === 0 ? [] : incomeAmount,
                backgroundColor: "green"
            },
            {
                label: "Expenses",
                data: expenses.length === 0 ? [] : expensesAmount,
                backgroundColor: "red"
            }
        ]
    };

    allDate.sort((a, b) => new Date(a) - new Date(b))

    return (
        <div className="chartContainer">
            <Line data={data} className='chart' />
        </div>
    );
}
