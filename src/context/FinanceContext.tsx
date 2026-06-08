import { createContext, ReactNode, useContext } from "react";

import { useFinanceNotifications } from "../hooks/useFinanceNotifications";
import { useFinanceStore } from "../hooks/useFinanceStore";

type FinanceContextValue = ReturnType<typeof useFinanceStore>;

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const store = useFinanceStore();
  useFinanceNotifications(store.isReady, store.state);

  return <FinanceContext.Provider value={store}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance debe usarse dentro de FinanceProvider");
  }

  return context;
}
