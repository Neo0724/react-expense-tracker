import { useNavigate } from 'react-router'
import { useCookies } from 'react-cookie'
import { useState } from 'react'
import dashboardIcon from "/public/dashboard.png"
import expenseIcon from "/public/expense.png"
import profitIcon from "/public/profits.png"
import viewTransactionIcon from "/public/transaction.png"
import NavbarComponent from "./Component/NavbarComponent"
import { navbarItems } from './Component/navbarItems'

export default function Navbar() {
    const [ cookies, setCookies ] = useCookies(["access_token"]) 

    const navigate = useNavigate()

    const [ navbar, setNavbar ] = useState(navbarItems)

    const handleSignOut = () => {
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
