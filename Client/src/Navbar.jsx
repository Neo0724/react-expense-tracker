import { useNavigate } from 'react-router'
import { useCookies } from 'react-cookie'
import { useState, useEffect } from 'react'
import dashboardIcon from "/public/dashboard.png"
import expenseIcon from "/public/expense.png"
import profitIcon from "/public/profits.png"
import viewTransactionIcon from "/public/transaction.png"
import NavbarComponent from "./Component/NavbarComponent"
import { navbarItems } from './Component/navbarItems'
import { useGlobalContext } from './Context/GlobalContextProvider'

export default function Navbar() {
    const [ cookies, setCookies ] = useCookies(["access_token"]) 

    const navigate = useNavigate()

    const { navbar, setNavbar } = useGlobalContext()

    const removeNavbarItem = async () => {
      return new Promise((resolve, reject) => {
        const defaultNavbar = navbar.map(item => {
          return {...item, active: false}
        })

        setNavbar(defaultNavbar)

        resolve(defaultNavbar)
      })
    }

    const handleSignOut = async () => {
        localStorage.removeItem("Navbar")
        const defaultNavbar = await removeNavbarItem()
        console.log(defaultNavbar)
        setCookies("access_token", "")
        localStorage.removeItem("User ID")
        navigate("/expenseTracker/login")
    }
  return (
    <div className="navbarContainer">
        <div className="register" onClick={() => navigate("/expenseTracker/register")}>Register</div>
        {navbar.map(item => {
          let randomID = crypto.randomUUID()
          return <NavbarComponent id={item.id} name={item.name} icon={item.icon} active={item.active} setNavbar={setNavbar} key={randomID}/>
        })}
        <div className="signOut" onClick={handleSignOut}>Sign Out</div>
    </div>
  )
}
