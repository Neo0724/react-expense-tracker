const express = require("express");
const IncomeRouter = express.Router();
const { addIncome } = require("../Controllers/IncomeController.js");
const { getIncome } = require("../Controllers/IncomeController.js")
const { deleteIncome } = require("../Controllers/IncomeController.js")
const { VerifyToken } = require("../Controllers/UserController");

IncomeRouter.post("/add-income", VerifyToken, addIncome);

IncomeRouter.get("/get-income/:id", VerifyToken, getIncome);

IncomeRouter.delete("/delete-income/:id", VerifyToken, deleteIncome);

module.exports = IncomeRouter
