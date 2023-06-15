const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose");
const UserRouter = require("./Routes/user.js")
const IncomeRouter = require("./Routes/income.js")
const ExpenseRouter = require("./Routes/expense.js")

app.use(cors())
app.use(express.json())

try {
  mongoose.connect(
    "mongodb+srv://TashiNeo:neoben007@expensetracker.jvbirbj.mongodb.net/expenseTracker?retryWrites=true&w=majority"
  );
  console.log("Db connected")
} catch (err) {
  console.log(err)
}

app.use("/auth", UserRouter)
app.use("/income", IncomeRouter)
app.use("/expense", ExpenseRouter)

app.listen(3000, () => console.log("Server running on port 3000"))