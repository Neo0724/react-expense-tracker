import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'
import { navbarItems } from '../Component/navbarItems'
import { useCookies } from 'react-cookie'

const GlobalContext = React.createContext()

export const GlobalContextProvider = ({ children }) => {
    const BASE_URL = "https://mern-expense-tracker-213j.onrender.com"

    const [expenses, setExpenses] = useState([])

    const [income, setIncome] = useState([])

    const userOwner = localStorage.getItem("User ID")

    const [ cookies, setCookies ] = useCookies(["access_token"])
    
    const [ close, setClose ] = useState(true)

    const [ loginErr, setLoginErr ] = useState({ text: "", error: false })

    const [ navbar, setNavbar ] = useState(() => {
      const exist = localStorage.getItem("Navbar")
      if (exist) {
        return JSON.parse(exist)
      } 

      return navbarItems
    })

    const pathname = window.location.pathname.split("/")[2];

    useEffect(() => {
        switch(pathname) {
            case "dashboard" || "":
                setNavbar(prev => {
                    let newNavbar = prev.map(prev => {
                        if (prev.id === 1) {
                            return {...prev, active: true}
                        } return {...prev, active: false}
                    })
                    return newNavbar
                }) 
                return;

            case "view%20transaction":
                setNavbar(prev => {
                    let newNavbar = prev.map(prev => {
                        if (prev.id === 2) {
                            return {...prev, active: true}
                        } return {...prev, active: false}
                    })
                    return newNavbar
                }) 
                return;

            case "income":
                setNavbar(prev => {
                    let newNavbar = prev.map(prev => {
                        if (prev.id === 3) {
                            return {...prev, active: true}
                        } return {...prev, active: false}
                    })
                    return newNavbar
                }) 
                return;

            case "expenses":
                setNavbar(prev => {
                    let newNavbar = prev.map(prev => {
                        if (prev.id === 4) {
                            return {...prev, active: true}
                        } return {...prev, active: false}
                    })
                    return newNavbar
                }) 
                return;
            
            default:
                return

        }

    }, [pathname])

    useEffect(() => {
      localStorage.setItem("Navbar", JSON.stringify(navbar))
    }, [navbar.active])

    const fetchExpenses = async () => {
        try {
            if (!userOwner) {
                setExpenses([])
                return
            }
            const response = await axios.get(`${BASE_URL}/expense/get-expense/${userOwner}`, { headers: { authorization: cookies.access_token } })
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
            const res = await axios.get(`${BASE_URL}/income/get-income/${userOwner}`, { headers: { authorization: cookies.access_token } })
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
        console.log("Done fetch")
    },[cookies.access_token])

    const getHistory = () => {
        const history = ([...income, ...expenses]).sort((a,b) => new Date(b.date) - new Date(a.date))
        return history.splice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{ expenses, income, setExpenses, setIncome, fetchExpenses, fetchIncome, BASE_URL, setNavbar, navbar, getTotalExpenses, getTotalIncome, getBalance, getHistory, setClose, close, setLoginErr, loginErr }}>
            { children }
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)

