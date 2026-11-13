import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "../styles/SearchScreenStyles";
import Input from "../components/Input";
import Button from "../components/Button";
import BusCard from "../components/BusCard";
import { getFavorites, toggleFavorite } from "../storage/storage";
import { searchBusLines } from "../services/api";
import { SPTRANS_TOKEN } from "../services/config";

export default function SearchScreen() {
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

  // Dentro da sua SearchScreen:
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    // Chama a API real da SPTrans usando o seu token configurado
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusCard
            linha={item.cl}
            nome={`${item.tp} - ${item.lt}`}
            sentido={item.sl}
            isFavorite={isFav(item)}
            onFavoritePress={() => handleToggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}
