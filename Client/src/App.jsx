import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Register from "./auth/Register";
import Navbar from "./nav/Navbar";
import Login from "./auth/Login";
import Expenses from "./income-expenses/Expenses";
import Income from "./income-expenses/Income";
import ViewTransaction from "./transaction/ViewTransaction";
import PopUp from "./utils/PopUp";
import LoginError from "./auth/LoginError";

function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <PopUp />
      <LoginError />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/view-transaction" element={<ViewTransaction />}></Route>
        <Route path="/income" element={<Income />}></Route>
        <Route path="/expenses" element={<Expenses />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
