import React from "react";
import { View, TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/InputStyles";

export default function Input({
  placeholder,
  value,
  onChangeText,
  iconName,
  onSubmitEditing,
}) {
  return (
    <View style={styles.container}>
      {iconName && (
        <Ionicons name={iconName} size={20} color="#666" style={styles.icon} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search" 
        onSubmitEditing={onSubmitEditing} 
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
