const express = require("express")
const { addExpense } = require("../Controllers/ExpenseController")
const { deleteExpense }= require("../Controllers/ExpenseController")
const { VerifyToken } = require("../Controllers/UserController");
const { getExpenseByMonthAndYear } = require("../Controllers/ExpenseController")
const { getHistoryByMonthAndYear } = require("../Controllers/ExpenseController")

const ExpenseRouter = express.Router()

ExpenseRouter.post("/add-expense", VerifyToken, addExpense)

ExpenseRouter.delete("/delete-expense/:id", VerifyToken, deleteExpense)

ExpenseRouter.get("/get-expense/:id/:month/:year", VerifyToken, getExpenseByMonthAndYear)

ExpenseRouter.get("/get-history/:id/:month/:year", VerifyToken, getHistoryByMonthAndYear)


module.exports = ExpenseRouter
