import {  BrowserRouter, Routes, Route  } from "react-router-dom"
import Dashboard from "./Component/Dashboard"
import Register from "./Component/Register"
import Navbar from "./Navbar"
import Login from "./Component/Login"
import Expenses from "./Component/Expenses"
import Income from "./Component/Income"
import ViewTransaction from "./Component/ViewTransaction"
import PopUp from "./PopUp"

function App() {

  return (
    <BrowserRouter> 
      <Navbar />
      <PopUp />
      <Routes>
        <Route path="/expenseTracker/dashboard" element={<Dashboard />}></Route>
        <Route path="/expenseTracker/view transaction" element={<ViewTransaction />}></Route>
        <Route path="/expenseTracker/income" element={<Income />}></Route>
        <Route path="/expenseTracker/expenses" element={<Expenses />}></Route>
        <Route path="/expenseTracker/register" element={<Register />}></Route>
        <Route path="/expenseTracker/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
