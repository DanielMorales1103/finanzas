import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Field } from "../components/Field";
import { FormModal } from "../components/FormModal";
import { SummaryCard } from "../components/SummaryCard";
import { useFinance } from "../context/FinanceContext";
import { colors } from "../theme/colors";
import { confirmAction } from "../utils/confirm";
import { formatMoney, parseMoneyInput } from "../utils/money";
import { getTotalExtraIncome } from "../utils/stats";

export function ExtraIncomeScreen() {
  const { actions, state } = useFinance();
  const [amount, setAmount] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const total = getTotalExtraIncome(state);

  function submitIncome() {
    const parsedAmount = parseMoneyInput(amount);
    const trimmedName = name.trim();

    if (!trimmedName || parsedAmount <= 0) {
      Alert.alert("Faltan datos", "Agrega el origen del ingreso y un monto mayor a cero.");
      return;
    }

    actions.addExtraIncome(trimmedName, parsedAmount);
    setName("");
    setAmount("");
    setIsModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <SummaryCard label="Total extra" value={formatMoney(total)} detail="Ingresos adicionales del mes" />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Entradas</Text>
            <Text style={styles.mutedText}>Registra de donde viene cada ingreso extra.</Text>
          </View>
          <Button label="Nuevo" onPress={() => setIsModalVisible(true)} />
        </View>

        {state.extraIncomes.length === 0 ? (
          <EmptyState
            title="No hay ingresos extra"
            message="Registra entradas como freelance, ventas o bonos."
          />
        ) : (
          <View style={styles.list}>
            {state.extraIncomes.map((income) => (
              <View key={income.id} style={styles.listRow}>
                <View>
                  <Text style={styles.listTitle}>{income.name}</Text>
                  <Text style={styles.mutedText}>Ingreso extra</Text>
                </View>
                <View style={styles.rowEnd}>
                  <Text style={styles.incomeAmount}>+{formatMoney(income.amount)}</Text>
                  <Pressable
                    onPress={() =>
                      confirmAction(
                        "Eliminar ingreso extra",
                        `Se eliminara "${income.name}" del mes actual.`,
                        () => actions.deleteExtraIncome(income.id)
                      )
                    }
                  >
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FormModal onClose={() => setIsModalVisible(false)} title="Nuevo ingreso extra" visible={isModalVisible}>
        <Field label="Origen" onChangeText={setName} placeholder="Freelance" value={name} />
        <Field keyboardType="decimal-pad" label="Monto" onChangeText={setAmount} placeholder="500" value={amount} />
        <Button label="Guardar ingreso" onPress={submitIncome} />
      </FormModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
    paddingBottom: 40
  },
  deleteText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right"
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
  rowEnd: {
    alignItems: "flex-end",
    gap: 6
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  }
});
