import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native"; // Adicionado TouchableOpacity
import { styles } from "../styles/HomeScreenStyles";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../components/Button";
import BusCard from "../components/BusCard";
import { getFavorites, toggleFavorite } from "../storage/storage";

export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

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

  // Função para navegar para o mapa
  const handleOpenMap = (item) => {
    navigation.navigate("MapScreen", { linha: item });
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
            <View>
              <BusCard
                linha={item.cl}
                nome={`${item.tp} - ${item.lt}`}
                sentido={item.sl}
                isFavorite={true}
                onFavoritePress={() => handleRemoveFavorite(item)}
              />
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleOpenMap(item)}
              >
                <Text style={styles.mapButtonText}>
                  🗺️ Ver Ônibus no Mapa ao Vivo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Pesquisar Nova Linha"
          onPress={() => navigation.navigate("SearchScreen")}
        />
      </View>
    </View>
  );
}
