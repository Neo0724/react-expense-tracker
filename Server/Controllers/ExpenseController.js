const ExpenseSchema = require("../Models/ExpenseSchema");
const moment = require('moment-timezone')

const addExpense = async (req, res) => {
  const { title, amount, date, category, description, type, userOwner } = req.body;

  const newDate = moment.utc(date).tz("Asia/Shanghai").format();

  try {
    const Expense = await ExpenseSchema.create({
      title,
      amount,
      date: newDate,
      category,
      description,
      userOwner,
      type
    });

    await Expense.save();

    res.status(200).json({ message: "Expense added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const { id } = req.params
    const Expense = await ExpenseSchema.find({ userOwner: id });

    res.status(200).json(Expense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


const getExpenseByMonthAndYear = async (req,res) => {
    try{
        const { id, month, year } = req.params;

        let regExp = null;


        if(month === "all" && year === "all") {
            regExp = new RegExp("\\d{4}");

        } else if (month !== "all" && year === "all") {
            regExp = new RegExp(`\\d{4}-${month}`);

        } else if (month === "all" && year !== "all") {
            regExp = new RegExp(`${year}-0?\\d{1,2}`);

        } else {
            regExp = new RegExp(`${year}-${month}`);
        } 

        const Expense = await ExpenseSchema.find({ userOwner: id, date: regExp });

        res.status(200).json(Expense);

    } catch {
        res.status(500).json({ message: "Server Error" });
    };
} 

const getHistoryByMonthAndYear = async (req, res) => {
    try {
        const { id, month, year } = req.params;

        let regExp = null;


        if(month === "all" && year === "all") {
            regExp = new RegExp("\\d{4}");

        } else if (month !== "all" && year === "all") {
            regExp = new RegExp(`\\d{4}-${month}`);

        } else if (month === "all" && year !== "all") {
            regExp = new RegExp(`${year}-0?\\d{1,2}`);

        } else {
            regExp = new RegExp(`${year}-${month}`);
        } 

        const Expense = await ExpenseSchema.aggregate([
            {
                $unionWith: { coll: "incomes" }
            },
            {
                $addFields: {
                    // Convert ObjectId to string
                    userOwnerStr: { $toString: "$userOwner" }  
                }
            },
            {
                $match: {
                    userOwnerStr: id,
                    date: regExp
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $limit: 3
            }
        ]);


        res.status(200).json(Expense);


    } catch {
        res.status(500).json({ message: "Server Error" });
    }
} 


const deleteExpense = async (req, res) => {
  const { id } = req.params;
  
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
exports.getExpenseByMonthAndYear = getExpenseByMonthAndYear;
exports.getHistoryByMonthAndYear =  getHistoryByMonthAndYear;

