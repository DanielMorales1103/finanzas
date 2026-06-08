import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Field } from "../components/Field";
import { FormModal } from "../components/FormModal";
import { useFinance } from "../context/FinanceContext";
import { ExpenseCategory } from "../types/finance";
import { colors } from "../theme/colors";
import { formatMoney, parseMoneyInput } from "../utils/money";

export function SettingsScreen() {
  const { actions, state } = useFinance();
  const [incomeInput, setIncomeInput] = useState(state.monthlyIncome ? String(state.monthlyIncome) : "");
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editBudget, setEditBudget] = useState("");
  const [editName, setEditName] = useState("");

  function saveIncome() {
    actions.setMonthlyIncome(parseMoneyInput(incomeInput));
    Alert.alert("Guardado", "Ingreso mensual actualizado.");
  }

  function openEditCategory(category: ExpenseCategory) {
    setEditingCategory(category);
    setEditName(category.name);
    setEditBudget(String(category.budget));
  }

  function saveCategory() {
    if (!editingCategory) {
      return;
    }

    const name = editName.trim();
    const budget = parseMoneyInput(editBudget);

    if (!name || budget < 0) {
      Alert.alert("Faltan datos", "Agrega un nombre y un presupuesto valido.");
      return;
    }

    actions.updateCategoryName(editingCategory.id, name);
    actions.updateCategoryBudget(editingCategory.id, budget);
    setEditingCategory(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Ingreso mensual</Text>
          <Field
            keyboardType="decimal-pad"
            label="Salario o ingreso base"
            onChangeText={setIncomeInput}
            placeholder="8000"
            value={incomeInput}
          />
          <Button label="Guardar ingreso" onPress={saveIncome} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presupuestos</Text>
          {state.categories.length === 0 ? (
            <EmptyState title="Sin categorias" message="Crea categorias en la pantalla de gastos para editarlas aqui." />
          ) : (
            state.categories.map((category) => (
              <Pressable key={category.id} onPress={() => openEditCategory(category)} style={styles.listRow}>
                <View>
                  <Text style={styles.listTitle}>{category.name}</Text>
                  <Text style={styles.mutedText}>Toca para editar</Text>
                </View>
                <Text style={styles.listAmount}>{formatMoney(category.budget)}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <FormModal
        onClose={() => setEditingCategory(null)}
        title="Editar categoria"
        visible={Boolean(editingCategory)}
      >
        <Field label="Nombre" onChangeText={setEditName} placeholder="Comida" value={editName} />
        <Field
          keyboardType="decimal-pad"
          label="Presupuesto"
          onChangeText={setEditBudget}
          placeholder="1500"
          value={editBudget}
        />
        <Button label="Guardar cambios" onPress={saveCategory} />
      </FormModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 20,
    paddingBottom: 40
  },
  listAmount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  listRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
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
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  }
});
