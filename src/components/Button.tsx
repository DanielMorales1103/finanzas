import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ label, onPress, variant = "primary" }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={[styles.label, variant === "secondary" ? styles.secondaryLabel : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  danger: {
    backgroundColor: colors.danger
  },
  label: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.82
  },
  primary: {
    backgroundColor: colors.accent
  },
  secondary: {
    backgroundColor: colors.tintSoft,
    borderColor: colors.border,
    borderWidth: 1
  },
  secondaryLabel: {
    color: colors.accent
  }
});
