import { FinanceState, MonthStats } from "../types/finance";

export function getCategorySpent(category: { expenses: Array<{ amount: number }> }) {
  return category.expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getTotalBudget(state: Pick<FinanceState, "categories">) {
  return state.categories.reduce((total, category) => total + category.budget, 0);
}

export function getTotalExpenses(state: Pick<FinanceState, "categories">) {
  return state.categories.reduce((total, category) => total + getCategorySpent(category), 0);
}

export function getTotalExtraIncome(state: Pick<FinanceState, "extraIncomes">) {
  return state.extraIncomes.reduce((total, income) => total + income.amount, 0);
}

export function buildMonthStats(state: FinanceState): MonthStats {
  const totalBudget = getTotalBudget(state);
  const totalExpenses = getTotalExpenses(state);
  const totalExtraIncome = getTotalExtraIncome(state);

  return {
    monthKey: state.currentMonthKey,
    monthlyIncome: state.monthlyIncome,
    totalBudget,
    totalExpenses,
    totalExtraIncome,
    finalBalance: state.monthlyIncome + totalExtraIncome - totalExpenses,
    categories: state.categories.map((category) => {
      const spent = getCategorySpent(category);

      return {
        id: category.id,
        name: category.name,
        budget: category.budget,
        spent,
        remaining: category.budget - spent
      };
    }),
    extraIncomes: state.extraIncomes
  };
}
