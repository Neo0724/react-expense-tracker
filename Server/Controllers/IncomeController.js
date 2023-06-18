const IncomeSchema = require("../Models/IncomeSchema");
const moment = require("moment-timezone")

const addIncome = async (req, res) => {
  const { title, amount, date, category, description, type, userOwner } = req.body;

  const newDate = moment.utc(date).tz("Asia/Shanghai").format();

  try {
    const income = await IncomeSchema.create({
      title,
      amount,
      date: newDate,
      category,
      description,
      userOwner,
      type
    });

    await income.save();

    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const { id } = req.params
    const income = await IncomeSchema.find({ userOwner: id });

    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteIncome = async (req,res) => {
    const { id } = req.params
    try {
        await IncomeSchema.findByIdAndDelete(id)

        res.json({ message: "Income deleted"})

    } catch (err) {
        res.status(500).json({ message: "Server Error" });      
    }
}

exports.addIncome = addIncome;
exports.getIncome = getIncome;
exports.deleteIncome = deleteIncome;
