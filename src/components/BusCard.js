import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BusCard({
  linha,
  nome,
  sentido,
  onFavoritePress,
  isFavorite,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{linha}</Text>
        </View>
        <TouchableOpacity onPress={onFavoritePress}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ff3b30" : "#666"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.nome} numberOfLines={2}>
        {nome}
      </Text>
      <Text style={styles.sentido}>
        Sentido:{" "}
        {sentido === 1
          ? "Terminal Principal -> Secundário"
          : "Secundário -> Principal"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#e6f0fa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#0056b3",
    fontWeight: "bold",
    fontSize: 14,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sentido: {
    fontSize: 12,
    color: "#666",
  },
});
