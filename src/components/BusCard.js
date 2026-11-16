import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/BusCardStyles";

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