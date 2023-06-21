import {  BrowserRouter, Routes, Route  } from "react-router-dom"
import Dashboard from "./Component/Dashboard"
import Register from "./Component/Register"
import Navbar from "./Navbar"
import Login from "./Component/Login"
import Expenses from "./Component/Expenses"
import Income from "./Component/Income"
import ViewTransaction from "./Component/ViewTransaction"
import PopUp from "./PopUp"
import LoginError from "./LoginError"

function App() {

  return (
    <BrowserRouter> 
      <Navbar />
      <PopUp />
      <LoginError />
      <Routes>
        <Route path="intermediateExpenseTrackerFrontend/" element={<Dashboard />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/dashboard" element={<Dashboard />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/view transaction" element={<ViewTransaction />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/income" element={<Income />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/expenses" element={<Expenses />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/register" element={<Register />}></Route>
        <Route path="intermediateExpenseTrackerFrontend/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
