import { ExpenseType } from "./Expense";
import { HistoryType } from "./History";
import { IncomeType } from "./Income";
import { NavbarItemType } from "./NavbarItem";

export type GlobalContextType = {
  fetchExpenses: (
    month: string,
    year: string,
    type: string,
  ) => Promise<ExpenseType[]>;
  fetchIncome: (
    month: string,
    year: string,
    type: string,
  ) => Promise<IncomeType[]>;
  setNavbar: React.Dispatch<React.SetStateAction<NavbarItemType[]>>;
  navbar: NavbarItemType[];
  getTotalExpensesByMonthAndYear: (expenses: ExpenseType[]) => number;
  getTotalIncomeByMonthAndYear: (incomes: IncomeType[]) => number;
  getBalance: (totalExpenses: number, totalIncome: number) => number;
  getHistory: (month: string, year: string) => Promise<HistoryType[]>;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
  close: boolean;
  setLoginErr: React.Dispatch<
    React.SetStateAction<{ text: string; error: boolean }>
  >;
  loginErr: { text: string; error: boolean };
  dictForMonth: Map<string, string>;
};
