import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Field } from "../components/Field";
import { FormModal } from "../components/FormModal";
import { useFinance } from "../context/FinanceContext";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { ExpenseCategory } from "../types/finance";
import { confirmAction } from "../utils/confirm";
import { formatMonthKey } from "../utils/date";
import { formatMoney, parseMoneyInput } from "../utils/money";
import { getCategorySpent } from "../utils/stats";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const menuItems = [
  { route: "CurrentInfo", title: "Info actual" },
  { route: "ExtraIncome", title: "Ingresos extra" },
  { route: "Stats", title: "Estadisticas" },
  { route: "Settings", title: "Ajustes" }
] as const;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { actions, isReady, state } = useFinance();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [categoryBudget, setCategoryBudget] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  function openRoute(route: keyof RootStackParamList) {
    setIsMenuVisible(false);
    navigation.navigate(route);
  }

  function submitCategory() {
    const name = categoryName.trim();
    const budget = parseMoneyInput(categoryBudget);

    if (!name || budget <= 0) {
      Alert.alert("Faltan datos", "Agrega un nombre y un presupuesto mayor a cero.");
      return;
    }

    actions.addCategory(name, budget);
    setCategoryName("");
    setCategoryBudget("");
    setIsCategoryModalVisible(false);
  }

  function submitExpense() {
    if (!selectedCategory) {
      return;
    }

    const description = expenseDescription.trim();
    const amount = parseMoneyInput(expenseAmount);

    if (!description || amount <= 0) {
      Alert.alert("Faltan datos", "Agrega una descripcion y un monto mayor a cero.");
      return;
    }

    actions.addExpense(selectedCategory.id, description, amount);
    setExpenseDescription("");
    setExpenseAmount("");
    setSelectedCategory(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appHeader}>
        <Pressable onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.eyebrow}>{formatMonthKey(state.currentMonthKey)}</Text>
          <Text style={styles.headerTitle}>Gastos</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {state.categories.length === 0 ? (
          <EmptyState
            title="Aun no hay categorias"
            message="Toca el boton + para crear tu primera categoria de gastos."
          />
        ) : (
          state.categories.map((category) => (
            <CategoryCard
              category={category}
              key={category.id}
              onAddExpense={() => setSelectedCategory(category)}
              onDelete={() =>
                confirmAction(
                  "Eliminar categoria",
                  `Se eliminara "${category.name}" con sus gastos del mes actual.`,
                  () => actions.deleteCategory(category.id)
                )
              }
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => setIsCategoryModalVisible(true)}
        style={({ pressed }) => [styles.fab, pressed ? styles.pressed : null]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal animationType="fade" transparent visible={isMenuVisible} onRequestClose={() => setIsMenuVisible(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setIsMenuVisible(false)}>
          <Pressable style={styles.menuPanel}>
            <Text style={styles.menuTitle}>Menu</Text>
            {menuItems.map((item) => (
              <Pressable key={item.route} onPress={() => openRoute(item.route)} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <FormModal
        onClose={() => setIsCategoryModalVisible(false)}
        title="Nueva categoria"
        visible={isCategoryModalVisible}
      >
        <Field label="Nombre" onChangeText={setCategoryName} placeholder="Comida" value={categoryName} />
        <Field
          keyboardType="decimal-pad"
          label="Presupuesto"
          onChangeText={setCategoryBudget}
          placeholder="1500"
          value={categoryBudget}
        />
        <Button label="Guardar categoria" onPress={submitCategory} />
      </FormModal>

      <FormModal
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory ? `Gasto en ${selectedCategory.name}` : "Nuevo gasto"}
        visible={Boolean(selectedCategory)}
      >
        <Field
          label="Descripcion"
          onChangeText={setExpenseDescription}
          placeholder="Supermercado"
          value={expenseDescription}
        />
        <Field
          keyboardType="decimal-pad"
          label="Monto"
          onChangeText={setExpenseAmount}
          placeholder="320"
          value={expenseAmount}
        />
        <Button label="Registrar gasto" onPress={submitExpense} />
      </FormModal>
    </SafeAreaView>
  );
}

function CategoryCard({
  category,
  onAddExpense,
  onDelete
}: {
  category: ExpenseCategory;
  onAddExpense: () => void;
  onDelete: () => void;
}) {
  const spent = getCategorySpent(category);
  const remaining = category.budget - spent;
  const progress = category.budget > 0 ? Math.min(spent / category.budget, 1) : 0;
  const isOverBudget = remaining < 0;
  const isLow = !isOverBudget && remaining <= category.budget * 0.2;
  const statusColor = isOverBudget ? colors.danger : isLow ? colors.warning : colors.success;
  const statusBackground = isOverBudget ? colors.dangerSoft : isLow ? colors.warningSoft : colors.successSoft;

  return (
    <Pressable onPress={onAddExpense} style={[styles.categoryCard, { backgroundColor: statusBackground }]}>
      <View style={styles.categoryTop}>
        <View style={styles.categoryTitleBlock}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryMeta}>
            {formatMoney(spent)} de {formatMoney(category.budget)}
          </Text>
        </View>
        <Text style={[styles.remaining, { color: statusColor }]}>{formatMoney(remaining)}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: statusColor, width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.tapHint}>Toca para agregar gasto</Text>
        <Pressable onPress={onDelete}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </Pressable>
      </View>

      {category.expenses.length > 0 ? (
        <View style={styles.expenseList}>
          {category.expenses.slice(-2).reverse().map((expense) => (
            <View key={expense.id} style={styles.expenseRow}>
              <Text style={styles.expenseDescription}>{expense.description}</Text>
              <Text style={styles.expenseAmount}>-{formatMoney(expense.amount)}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  categoryCard: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 13,
    padding: 16
  },
  categoryMeta: {
    color: colors.textMuted,
    fontSize: 13
  },
  categoryName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  categoryTitleBlock: {
    flex: 1,
    gap: 4
  },
  categoryTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  container: {
    gap: 14,
    padding: 16,
    paddingBottom: 108
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800"
  },
  expenseAmount: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "800"
  },
  expenseDescription: {
    color: colors.text,
    flex: 1,
    fontSize: 14
  },
  expenseList: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12
  },
  expenseRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 999,
    bottom: 26,
    height: 58,
    justifyContent: "center",
    position: "absolute",
    right: 22,
    width: 58
  },
  fabText: {
    color: colors.background,
    fontSize: 34,
    fontWeight: "500",
    lineHeight: 38
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  headerTitleBlock: {
    gap: 2
  },
  loading: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center"
  },
  menuBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    flex: 1
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  menuChevron: {
    color: colors.accent,
    fontSize: 28,
    lineHeight: 30
  },
  menuIcon: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 26
  },
  menuItem: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 54,
    paddingVertical: 12
  },
  menuItemText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  menuPanel: {
    backgroundColor: colors.surface,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    gap: 4,
    height: "100%",
    padding: 20,
    paddingTop: 56,
    width: 292
  },
  menuTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12
  },
  pressed: {
    opacity: 0.82
  },
  progressFill: {
    borderRadius: 999,
    height: "100%"
  },
  progressTrack: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 10,
    overflow: "hidden"
  },
  remaining: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right"
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  }
});
