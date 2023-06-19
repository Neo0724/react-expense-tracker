import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'
import { navbarItems } from '../Component/navbarItems'
import { useCookies } from 'react-cookie'

const GlobalContext = React.createContext()

export const GlobalContextProvider = ({ children }) => {
    const BASE_URL = "http://localhost:3000"

    const [expenses, setExpenses] = useState([])

    const [income, setIncome] = useState([])

    const userOwner = localStorage.getItem("User ID")

    const [ cookies, setCookies ] = useCookies(["access_token"])

    const [ navbar, setNavbar ] = useState(() => {
      const exist = localStorage.getItem("Navbar")
      if (exist) {
        return JSON.parse(exist)
      } 

      return navbarItems
    })

    const [ close, setClose ] = useState(true)

    useEffect(() => {
      localStorage.setItem("Navbar", JSON.stringify(navbar))
    }, [navbar])

    const fetchExpenses = async () => {
        try {
            if (!userOwner) {
                setExpenses([])
                return
            }
            const response = await axios.get(`${BASE_URL}/expense/get-expense/${userOwner}`)
            setExpenses(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchIncome = async () => {
        try {
            if (!userOwner) {
                setIncome([])
                return
            }
            const res = await axios.get(`${BASE_URL}/income/get-income/${userOwner}`)
            setIncome(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getTotalIncome = () => {
        if (income.length === 0) {
            return 0
        }

        let totalIncome = 0

        income.map(item => {
            totalIncome += item.amount
        })

        return totalIncome
    }

    const getTotalExpenses = () => {
        if (expenses.length === 0) {
            return 0
        }

        let totalExpenses = 0

        expenses.map(item => {
            totalExpenses += item.amount
        })

        return totalExpenses
    }

    const getBalance = () => {
        return getTotalIncome() - getTotalExpenses()
    }

    useEffect(() => {
        fetchExpenses()
        fetchIncome()
    },[userOwner])

    const getHistory = () => {
        const history = ([...income, ...expenses]).sort((a,b) => new Date(b.date) - new Date(a.date))
        return history.splice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{ expenses, income, setExpenses, setIncome, fetchExpenses, fetchIncome, BASE_URL, setNavbar, navbar, getTotalExpenses, getTotalIncome, getBalance, getHistory, setClose, close }}>
            { children }
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)

