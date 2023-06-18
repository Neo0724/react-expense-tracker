import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'

const GlobalContext = React.createContext()

export const GlobalContextProvider = ({ children }) => {
    const BASE_URL = "http://localhost:3000"

    const [expenses, setExpenses] = useState([])

    const [income, setIncome] = useState([])

    const userOwner = localStorage.getItem("User ID")

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/expense/get-expense/${userOwner}`)
            setExpenses(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchIncome = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/income/get-income/${userOwner}`)
            setIncome(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchExpenses()
        fetchIncome()
    },[])

    return (
        <GlobalContext.Provider value={{ expenses, income, setExpenses, setIncome, fetchExpenses, fetchIncome, BASE_URL }}>
            { children }
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)

