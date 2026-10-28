const type = ["expenses", "income"] as const;

export const expenseCategories = [
  "accomodation",
  "foodandbeverage",
  "medical",
  "transport",
  "stationary",
  "other",
] as const;

export type ExpenseType = {
  _id: string;
  title: string;
  amount: number;
  type: (typeof type)[number];
  date: string;
  category: (typeof expenseCategories)[number];
  description: string;
};
