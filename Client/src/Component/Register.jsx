import axios from "axios"
import { useNavigate } from "react-router"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Register() {
  const [data, setData] = useState({ username: "", password: "" })

  const navigate = useNavigate()

  const handleUsernameChange = (e) => {
    setData(prev => {
      return ({...prev, username: e.target.value})
    })
  }

  const handlePasswordChange = (e) => {
    setData(prev => {
      return ({...prev, password: e.target.value})
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post("https://mern-expense-tracker-213j.onrender.com/auth/register", { username: data.username, password: data.password })
      navigate("/intermediateExpenseTracker/login")
    } catch (err) {
      alert(err)
    }

  }
  return (
    <form action="POST" className="authContainer" onSubmit={handleSubmit}>
      <input type="text" className="usernameInput"  placeholder="Enter your username..." value={data.username} onChange={ handleUsernameChange} required={true}/>
      <div className="horizontalLine"></div>
      <input type="password" className="usernameInput" placeholder="Enter your password ..." value={data.password} onChange={handlePasswordChange} required={true}/>
      <div className="horizontalLine"></div>
      <button className="submitBtn" type="submit">register</button>
      <span>Already have an account? <Link to="/expenseTracker/login">Log in now</Link></span>
    </form> 
  )
}
