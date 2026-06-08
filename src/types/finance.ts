export type Expense = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  budget: number;
  expenses: Expense[];
};

export type ExtraIncome = {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
};

export type MonthStats = {
  monthKey: string;
  monthlyIncome: number;
  totalBudget: number;
  totalExpenses: number;
  totalExtraIncome: number;
  finalBalance: number;
  categories: Array<{
    id: string;
    name: string;
    budget: number;
    spent: number;
    remaining: number;
  }>;
  extraIncomes: ExtraIncome[];
};

export type FinanceState = {
  currentMonthKey: string;
  monthlyIncome: number;
  categories: ExpenseCategory[];
  extraIncomes: ExtraIncome[];
  previousMonthStats: MonthStats | null;
};
