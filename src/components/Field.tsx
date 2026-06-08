import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "../theme/colors";

type FieldProps = TextInputProps & {
  label: string;
};

export function Field({ label, ...props }: FieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  }
});
