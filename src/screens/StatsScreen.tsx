import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "../components/EmptyState";
import { SummaryCard } from "../components/SummaryCard";
import { useFinance } from "../context/FinanceContext";
import { colors } from "../theme/colors";
import { formatMonthKey } from "../utils/date";
import { formatMoney } from "../utils/money";

export function StatsScreen() {
  const { state } = useFinance();
  const stats = state.previousMonthStats;

  if (!stats) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <EmptyState
            title="Aun no hay estadisticas"
            message="Cuando cambie el mes, la app guardara el resumen del mes anterior aqui."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.sectionTitle}>{formatMonthKey(stats.monthKey)}</Text>
          <Text style={styles.mutedText}>Resumen conservado del mes anterior.</Text>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryCard label="Ingreso base" value={formatMoney(stats.monthlyIncome)} detail="Salario del mes" />
          <SummaryCard label="Extras" value={formatMoney(stats.totalExtraIncome)} detail="Ingresos adicionales" />
          <SummaryCard label="Gastos" value={formatMoney(stats.totalExpenses)} detail="Total gastado" />
          <SummaryCard label="Balance final" value={formatMoney(stats.finalBalance)} detail="Ingreso + extras - gastos" />
        </View>

        <View style={styles.list}>
          {stats.categories.map((category) => (
            <View key={category.id} style={styles.listRow}>
              <View>
                <Text style={styles.listTitle}>{category.name}</Text>
                <Text style={styles.mutedText}>Presupuesto {formatMoney(category.budget)}</Text>
              </View>
              <Text style={category.remaining < 0 ? styles.expenseAmount : styles.incomeAmount}>
                {formatMoney(category.remaining)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
    paddingBottom: 40
  },
  expenseAmount: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "900"
  },
  incomeAmount: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "900"
  },
  list: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  listRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 16
  },
  listTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  summaryGrid: {
    gap: 12
  }
});
