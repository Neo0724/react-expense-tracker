const type = ["expenses", "income"] as const;

export const incomeCategories = [
  "salary",
  "freelancing",
  "investment",
  "scholarship",
  "bank",
  "other",
] as const;

export type IncomeType = {
  _id: string;
  title: string;
  amount: number;
  type: (typeof type)[number];
  date: string;
  category: (typeof incomeCategories)[number];
  description: string;
};
