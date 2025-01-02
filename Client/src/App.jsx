import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Component/Dashboard";
import Register from "./Component/Register";
import Navbar from "./Navbar";
import Login from "./Component/Login";
import Expenses from "./Component/Expenses";
import Income from "./Component/Income";
import ViewTransaction from "./Component/ViewTransaction";
import PopUp from "./PopUp";
import LoginError from "./LoginError";
import { ToastContextProvider } from "./Context/ToastContextProvider";

function App() {
  return (
    <HashRouter>
      <Navbar />
      <PopUp />
      <LoginError />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route
          path="intermediateExpenseTracker/dashboard"
          element={<Dashboard />}
        ></Route>
        <Route
          path="intermediateExpenseTracker/view transaction"
          element={<ViewTransaction />}
        ></Route>
        <Route
          path="intermediateExpenseTracker/income"
          element={
            // <ToastContextProvider>
            <Income />
            // </ToastContextProvider>
          }
        ></Route>
        <Route
          path="intermediateExpenseTracker/expenses"
          element={
            <ToastContextProvider>
              <Expenses />
            </ToastContextProvider>
          }
        ></Route>
        <Route
          path="intermediateExpenseTracker/register"
          element={<Register />}
        ></Route>
        <Route
          path="intermediateExpenseTracker/login"
          element={<Login />}
        ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
