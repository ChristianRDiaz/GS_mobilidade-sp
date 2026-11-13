import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@sptrans_favorites";

// Buscar linhas favoritas salvas
export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
};

// Salvar ou remover uma linha dos favoritos
export const toggleFavorite = async (busLine) => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((item) => item.cl === busLine.cl);

    let updatedFavorites;
    if (exists) {
      // Remove se já existir
      updatedFavorites = favorites.filter((item) => item.cl !== busLine.cl);
    } else {
      // Adiciona se não existir
      updatedFavorites = [...favorites, busLine];
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
    return [];
  }
};
