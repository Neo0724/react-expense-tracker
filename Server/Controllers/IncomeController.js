const IncomeSchema = require("../Models/IncomeSchema");

const addIncome = async (req, res) => {
  const { title, amount, type, date, category } = req.body;

  try {
    const income = await IncomeSchema.create({
      title,
      amount,
      type,
      date,
      category,
    });

    await income.save();

    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const income = await IncomeSchema.find({});

    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteIncome = async (req,res) => {
    const { id } = req.params
    console.log(id)
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
