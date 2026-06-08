import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { FinanceState } from "../types/finance";
import { getCategorySpent } from "./stats";

const APP_NOTIFICATION_KEY = "finanzas";
const BUDGET_ALERT_TYPE = "budget-alert";
const DAILY_REMINDER_TYPE = "daily-expense-reminder";
const DEFAULT_CHANNEL_ID = "finanzas-alerts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function requestNotificationPermissions() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
      importance: Notifications.AndroidImportance.HIGH,
      name: "Alertas de finanzas",
      vibrationPattern: [0, 250, 250, 250]
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();

  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();

  return requestedPermissions.granted;
}

export async function syncFinanceNotifications(state: FinanceState) {
  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    return false;
  }

  await cancelOwnScheduledNotifications();
  await scheduleDailyExpenseReminders();
  await scheduleBudgetAlertsUntilMonthEnd(state);

  return true;
}

async function cancelOwnScheduledNotifications() {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter((notification) => notification.content.data?.app === APP_NOTIFICATION_KEY)
      .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier))
  );
}

async function scheduleDailyExpenseReminders() {
  await Promise.all([
    scheduleDailyExpenseReminder(13, "Recuerda registrar tus gastos de la tarde."),
    scheduleDailyExpenseReminder(22, "Cierra el dia registrando cualquier gasto pendiente.")
  ]);
}

async function scheduleDailyExpenseReminder(hour: number, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      body,
      data: {
        app: APP_NOTIFICATION_KEY,
        type: DAILY_REMINDER_TYPE
      },
      title: "Registra tus gastos"
    },
    trigger: {
      channelId: DEFAULT_CHANNEL_ID,
      hour,
      minute: 0,
      type: Notifications.SchedulableTriggerInputTypes.DAILY
    }
  });
}

async function scheduleBudgetAlertsUntilMonthEnd(state: FinanceState) {
  const criticalCategories = state.categories
    .map((category) => {
      const spent = getCategorySpent(category);
      const remaining = category.budget - spent;
      const remainingRatio = category.budget > 0 ? remaining / category.budget : 0;

      return {
        name: category.name,
        remaining,
        remainingRatio
      };
    })
    .filter((category) => category.remainingRatio <= 0.3);

  if (criticalCategories.length === 0) {
    return;
  }

  const title = criticalCategories.some((category) => category.remaining <= 0)
    ? "No deberias gastar mas en esto"
    : "Presupuesto bajo";
  const body = criticalCategories
    .slice(0, 4)
    .map((category) =>
      category.remaining <= 0
        ? `${category.name}: ya esta en cero o negativo`
        : `${category.name}: queda menos del 30%`
    )
    .join("\n");

  const noonDates = getRemainingNoonDatesForCurrentMonth();

  await Promise.all(
    noonDates.map((date) =>
      Notifications.scheduleNotificationAsync({
        content: {
          body,
          data: {
            app: APP_NOTIFICATION_KEY,
            type: BUDGET_ALERT_TYPE
          },
          title
        },
        trigger: {
          channelId: DEFAULT_CHANNEL_ID,
          date,
          type: Notifications.SchedulableTriggerInputTypes.DATE
        }
      })
    )
  );
}

function getRemainingNoonDatesForCurrentMonth() {
  const now = new Date();
  const dates: Date[] = [];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  for (let day = now.getDate(); day <= lastDayOfMonth; day += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), day, 12, 0, 0, 0);

    if (date.getTime() > now.getTime()) {
      dates.push(date);
    }
  }

  return dates;
}
