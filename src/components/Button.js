import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../styles/ButtonStyles";

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