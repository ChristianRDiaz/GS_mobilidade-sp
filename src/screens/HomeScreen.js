import React, { useState, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "../styles/HomeScreenStyles";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../components/Button";
import BusCard from "../components/BusCard";
import { getFavorites, toggleFavorite } from "../storage/storage";

export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Recarrega os favoritos toda vez que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  const handleRemoveFavorite = async (item) => {
    const updated = await toggleFavorite(item);
    setFavorites(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Linhas Favoritas</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>
          Nenhuma linha favoritada ainda. Use a busca para encontrar e
          favoritar!
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.cl)}
          renderItem={({ item }) => (
            <BusCard
              linha={item.cl}
              nome={`${item.tp} - ${item.lt}`}
              sentido={item.sl}
              isFavorite={true}
              onFavoritePress={() => handleRemoveFavorite(item)}
            />
          )}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Pesquisar Nova Linha"
          onPress={() => navigation.navigate("Search")}
        />
      </View>
    </View>
  );
}