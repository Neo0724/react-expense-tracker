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
      regExp = new RegExp("");
    } else if (month !== "all" && year === "all") {
      regExp = new RegExp(`^\\d{4}-${month}`);
    } else if (month === "all" && year !== "all") {
      regExp = new RegExp(`^${year}`);
    } else {
      regExp = new RegExp(`^${year}-${month}`);
    }

    let income = null;

    if (type === "all") {
      income = await IncomeSchema.find({ userOwner: id, date: regExp }).sort({
        date: -1,
      });
    } else {
      income = await IncomeSchema.find({
        userOwner: id,
        date: regExp,
        category: type,
      }).sort({
        date: -1,
      });
    }

    res.status(200).json(income);
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
