const express = require("express");
const IncomeRouter = express.Router();
const { addIncome } = require("../Controllers/IncomeController.js");
const { getIncome } = require("../Controllers/IncomeController.js")
const { deleteIncome } = require("../Controllers/IncomeController.js")

IncomeRouter.post("/add-income", addIncome);

IncomeRouter.get("/get-income", getIncome);

IncomeRouter.delete("/delete-income/:id", deleteIncome);

module.exports = IncomeRouter
