const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const UserRouter = require("./Routes/user.js");
const IncomeRouter = require("./Routes/income.js");
const ExpenseRouter = require("./Routes/expense.js");
require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "https://neo0724.github.io",
      "http://localhost:5173",
      "https://neo0724-expense-tracker.netlify.app",
    ],
  }),
);

const port = process.env.PORT || 3000;

app.use(express.json());

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("Db connected");
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.json({ message: "Api running" });
});

app.use("/auth", UserRouter);
app.use("/income", IncomeRouter);
app.use("/expense", ExpenseRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Running on port ${port}`);
});
