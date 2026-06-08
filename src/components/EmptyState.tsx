import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 18
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  }
});
