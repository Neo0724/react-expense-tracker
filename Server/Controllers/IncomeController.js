const IncomeSchema = require("../Models/IncomeSchema");
const moment = require("moment-timezone");

const addIncome = async (req, res) => {
  const { title, amount, date, category, description, type, userOwner } =
    req.body;

  const newDate = moment.utc(date).tz("Asia/Shanghai").format();

  try {
    const income = await IncomeSchema.create({
      title,
      amount,
      date: newDate,
      category,
      description,
      userOwner,
      type,
    });

    await income.save();

    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getIncomeByMonthAndYear = async (req, res) => {
  try {
    const { id, month, year, type } = req.params;

    let regExp = null;

    if (month === "all" && year === "all") {
      regExp = new RegExp("\\d{4}");
    } else if (month !== "all" && year === "all") {
      regExp = new RegExp(`\\d{4}-${month}`);
    } else if (month === "all" && year !== "all") {
      regExp = new RegExp(`${year}-0?\\d{1,2}`);
    } else {
      regExp = new RegExp(`${year}-${month}`);
    }

    let Income = null;

    if (type === "all") {
      Income = await IncomeSchema.find({ userOwner: id, date: regExp });
    } else {
      Income = await IncomeSchema.find({
        userOwner: id,
        date: regExp,
        category: type,
      });
    }

    res.status(200).json(Income);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    await IncomeSchema.findByIdAndDelete(id);

    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addIncome = addIncome;
exports.deleteIncome = deleteIncome;
exports.getIncomeByMonthAndYear = getIncomeByMonthAndYear;
