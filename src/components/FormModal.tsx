import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type FormModalProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
  visible: boolean;
};

export function FormModal({ children, onClose, title, visible }: FormModalProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>x</Text>
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(23, 33, 29, 0.28)",
    flex: 1,
    justifyContent: "flex-end"
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.tintSoft,
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  closeText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 18,
    padding: 20
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  }
});
