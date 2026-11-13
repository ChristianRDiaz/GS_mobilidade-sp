import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styles } from "../styles/SearchScreenStyles";
import Input from "../components/Input";
import Button from "../components/Button";
import BusCard from "../components/BusCard";
import { getFavorites, toggleFavorite } from "../storage/storage";
import { searchBusLines } from "../services/api";
import { SPTRANS_TOKEN } from "../services/config";

export default function SearchScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const data = await searchBusLines(SPTRANS_TOKEN, searchTerm);
    setResults(data);
  };

  const handleToggleFavorite = async (item) => {
    const updated = await toggleFavorite(item);
    setFavorites(updated);
  };

  const isFav = (item) => {
    return favorites.some((fav) => fav.cl === item.cl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite o número ou nome da linha:</Text>
      <Input
        placeholder="Ex: 8000 ou Lapa"
        value={searchTerm}
        onChangeText={setSearchTerm}
        iconName="search"
      />
      <Button title="Pesquisar Linhas" onPress={handleSearch} />

      <FlatList
        style={styles.resultsList}
        data={results}
        keyExtractor={(item) => String(item.cl)}
        renderItem={({ item }) => (
          <View>
            <BusCard
              linha={`${item.lt}-${item.tl}`}
              nome={`${item.tp} / ${item.ts}`}
              sentido={item.sl}
              isFavorite={isFav(item)}
              onFavoritePress={() => handleToggleFavorite(item)}
            />
            <TouchableOpacity
              style={localStyles.mapButton}
              onPress={() => navigation.navigate("MapScreen", { linha: item })}
            >
              <Text style={localStyles.mapButtonText}>
                🗺️ Ver Ônibus no Mapa ao Vivo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  mapButton: {
    backgroundColor: "#e6f0fa",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#b3d1ff",
  },
  mapButtonText: {
    color: "#0056b3",
    fontWeight: "bold",
    fontSize: 13,
  },
});
