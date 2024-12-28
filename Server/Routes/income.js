const express = require("express");
const { addIncome } = require("../Controllers/IncomeController.js");
const { deleteIncome } = require("../Controllers/IncomeController.js");
const { VerifyToken } = require("../Controllers/UserController");
const {
  getIncomeByMonthAndYear,
} = require("../Controllers/IncomeController.js");

const IncomeRouter = express.Router();

IncomeRouter.post("/add-income", VerifyToken, addIncome);

IncomeRouter.delete("/delete-income/:id", VerifyToken, deleteIncome);

IncomeRouter.get(
  "/get-income/:id/:month/:year/:type",
  VerifyToken,
  getIncomeByMonthAndYear,
);

module.exports = IncomeRouter;
