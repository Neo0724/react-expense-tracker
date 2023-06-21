const express = require("express")
const { addExpense } = require("../Controllers/ExpenseController")
const { getExpense } = require("../Controllers/ExpenseController")
const { deleteExpense }= require("../Controllers/ExpenseController")
const { VerifyToken } = require("../Controllers/UserController");

const ExpenseRouter = express.Router()

ExpenseRouter.post("/add-expense", VerifyToken, addExpense)

ExpenseRouter.get("/get-expense/:id", VerifyToken, getExpense)

ExpenseRouter.delete("/delete-expense/:id", VerifyToken, deleteExpense)



module.exports = ExpenseRouter