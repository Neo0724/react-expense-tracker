const express = require("express")
const { addExpense } = require("../Controllers/ExpenseController")
const { getExpense } = require("../Controllers/ExpenseController")
const { deleteExpense }= require("../Controllers/ExpenseController")

const ExpenseRouter = express.Router()

ExpenseRouter.post("/add-expense", addExpense)

ExpenseRouter.get("/get-expense", getExpense)

ExpenseRouter.delete("/delete-expense/:id", deleteExpense)



module.exports = ExpenseRouter