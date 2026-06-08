import { useEffect } from "react";

import { FinanceState } from "../types/finance";
import { syncFinanceNotifications } from "../utils/notifications";

export function useFinanceNotifications(isReady: boolean, state: FinanceState) {
  useEffect(() => {
    if (!isReady) {
      return;
    }

    syncFinanceNotifications(state).catch((error) => {
      console.warn("No se pudieron sincronizar las notificaciones", error);
    });
  }, [isReady, state]);
}
