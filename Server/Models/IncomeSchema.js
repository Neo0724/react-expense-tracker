const mongoose = require("mongoose");

const IncomeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },

  amount: {
    type: Number,
    required: true,
    maxLength: 20,
    trim: true,
  },

  date: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
      type: String,
      required: true,
      default: "income"
  },

  description: {
    type: String,
    required: true,
    trim: true
  },
  
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

}, {timestamps: true});

module.exports = mongoose.model("income", IncomeSchema);
