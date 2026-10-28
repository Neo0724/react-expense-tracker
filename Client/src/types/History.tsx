import { expenseCategories } from "./Expense";
import { incomeCategories } from "./Income";

const type = ["expenses", "income"] as const;

export type HistoryType = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  description: string;
} & (
  | {
      type: (typeof type)[0];
      category: (typeof expenseCategories)[number];
    }
  | {
      type: (typeof type)[1];
      category: (typeof incomeCategories)[number];
    }
);
