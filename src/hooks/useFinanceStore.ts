import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ExpenseCategory, FinanceState } from "../types/finance";
import { getMonthKey } from "../utils/date";
import { buildMonthStats } from "../utils/stats";

const STORAGE_KEY = "finanzas:data:v1";

const initialState: FinanceState = {
  currentMonthKey: getMonthKey(),
  monthlyIncome: 0,
  categories: [],
  extraIncomes: [],
  previousMonthStats: null
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function rollMonthIfNeeded(state: FinanceState): FinanceState {
  const currentMonthKey = getMonthKey();

  if (state.currentMonthKey === currentMonthKey) {
    return state;
  }

  return {
    ...state,
    currentMonthKey,
    categories: state.categories.map((category) => ({
      ...category,
      expenses: []
    })),
    extraIncomes: [],
    previousMonthStats: buildMonthStats(state)
  };
}

export function useFinanceStore() {
  const [state, setState] = useState<FinanceState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadState() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const nextState = saved ? rollMonthIfNeeded(JSON.parse(saved) as FinanceState) : initialState;

      setState(nextState);
      setIsReady(true);
    }

    loadState();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isReady, state]);

  const updateState = useCallback((updater: (current: FinanceState) => FinanceState) => {
    setState((current) => updater(current));
  }, []);

  const actions = useMemo(
    () => ({
      addCategory(name: string, budget: number) {
        updateState((current) => ({
          ...current,
          categories: [
            ...current.categories,
            { id: createId("category"), name, budget, expenses: [] }
          ]
        }));
      },
      addExpense(categoryId: string, description: string, amount: number) {
        updateState((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  expenses: [
                    ...category.expenses,
                    { id: createId("expense"), description, amount, createdAt: new Date().toISOString() }
                  ]
                }
              : category
          )
        }));
      },
      addExtraIncome(name: string, amount: number) {
        updateState((current) => ({
          ...current,
          extraIncomes: [
            ...current.extraIncomes,
            { id: createId("income"), name, amount, createdAt: new Date().toISOString() }
          ]
        }));
      },
      deleteCategory(categoryId: string) {
        updateState((current) => ({
          ...current,
          categories: current.categories.filter((category) => category.id !== categoryId)
        }));
      },
      deleteExtraIncome(incomeId: string) {
        updateState((current) => ({
          ...current,
          extraIncomes: current.extraIncomes.filter((income) => income.id !== incomeId)
        }));
      },
      setMonthlyIncome(monthlyIncome: number) {
        updateState((current) => ({ ...current, monthlyIncome }));
      },
      updateCategoryBudget(categoryId: string, budget: number) {
        updateState((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === categoryId ? { ...category, budget } : category
          )
        }));
      },
      updateCategoryName(categoryId: string, name: string) {
        updateState((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === categoryId ? { ...category, name } : category
          )
        }));
      }
    }),
    [updateState]
  );

  return { actions, isReady, state };
}
