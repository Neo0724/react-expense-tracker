const ExpenseSchema = require("../Models/ExpenseSchema");

const addExpense = async (req, res) => {
  const { title, amount, type, date, category } = req.body;

  try {
    const Expense = await ExpenseSchema.create({
      title,
      amount,
      type,
      date,
      category,
    });

    await Expense.save();

    res.status(200).json({ message: "Expense added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const Expense = await ExpenseSchema.find({});

    res.status(200).json(Expense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await ExpenseSchema.findByIdAndDelete(id);

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addExpense = addExpense;
exports.getExpense = getExpense;
exports.deleteExpense = deleteExpense;
