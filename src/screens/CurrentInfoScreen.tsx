import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SummaryCard } from "../components/SummaryCard";
import { useFinance } from "../context/FinanceContext";
import { colors } from "../theme/colors";
import { formatMonthKey } from "../utils/date";
import { formatMoney } from "../utils/money";
import { getTotalBudget, getTotalExpenses, getTotalExtraIncome } from "../utils/stats";

export function CurrentInfoScreen() {
  const { state } = useFinance();
  const totalBudget = getTotalBudget(state);
  const totalExpenses = getTotalExpenses(state);
  const totalExtraIncome = getTotalExtraIncome(state);
  const currentBalance = state.monthlyIncome + totalExtraIncome - totalExpenses;
  const availableToBudget = state.monthlyIncome + totalExtraIncome - totalBudget;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{formatMonthKey(state.currentMonthKey)}</Text>
          <Text style={styles.title}>Info actual</Text>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryCard label="Balance actual" value={formatMoney(currentBalance)} detail="Ingreso + extras - gastos" />
          <SummaryCard label="Sin asignar" value={formatMoney(availableToBudget)} detail="Disponible para presupuestar" />
          <SummaryCard label="Presupuestado" value={formatMoney(totalBudget)} detail="Total asignado a categorias" />
          <SummaryCard label="Gastado" value={formatMoney(totalExpenses)} detail={`${formatMoney(totalExtraIncome)} en extras`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 20,
    paddingBottom: 40
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  header: {
    gap: 8
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  summaryGrid: {
    gap: 12
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900"
  }
});
