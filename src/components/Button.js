import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ title, onPress, type = "primary" }) {
  const isPrimary = type === "primary";

  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.textPrimary : styles.textSecondary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#0056b3", // Azul SPTrans / Urbano
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0056b3",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrimary: {
    color: "#fff",
  },
  textSecondary: {
    color: "#0056b3",
  },
});
