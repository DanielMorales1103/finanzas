import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type SummaryCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: ReactNode;
};

export function SummaryCard({ label, value, detail, icon }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 16
  },
  detail: {
    color: colors.textMuted,
    fontSize: 13
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.tintSoft,
    borderRadius: 999,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  value: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700"
  }
});
