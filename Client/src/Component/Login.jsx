import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { useCookies } from "react-cookie"
import { Link } from "react-router-dom"

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" })

  const [cookie, setCookie] = useCookies(["access_token"])

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
      const res = await axios.post("http://localhost:3000/auth/login", { username: data.username, password: data.password })
      setCookie("access_token", res.data.token)
      localStorage.setItem("User ID", res.data.userID)
      alert("Login Success")
      navigate("/expenseTracker/dashboard")
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
      <button className="submitBtn" type="submit">login</button>
      <span>Do not have an account? <Link to="/expenseTracker/register">Register now</Link></span>
    </form> 
  )
}
