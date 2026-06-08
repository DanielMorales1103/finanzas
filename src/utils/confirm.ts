import { Alert, Platform } from "react-native";

export function confirmAction(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }

    return;
  }

  Alert.alert(title, message, [
    { style: "cancel", text: "Cancelar" },
    { onPress: onConfirm, style: "destructive", text: "Eliminar" }
  ]);
}
