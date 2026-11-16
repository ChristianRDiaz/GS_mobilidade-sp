import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@sptrans_favorites";
const STOP_FAVORITES_KEY = "@sptrans_stop_favorites";

// Chave do cache de paradas de uma linha, por exemplo "@sptrans_stops_1234"
const stopsKey = (codigoLinha) => `@sptrans_stops_${codigoLinha}`;

// ---------- Linhas favoritas ----------

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }
};

export const toggleFavorite = async (busLine) => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((item) => item.cl === busLine.cl);

    const updatedFavorites = exists
      ? favorites.filter((item) => item.cl !== busLine.cl)
      : [...favorites, busLine];

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
    return getFavorites();
  }
};

// ---------- Paradas favoritas ----------

export const getStopFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(STOP_FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao buscar paradas favoritas:", error);
    return [];
  }
};

export const toggleStopFavorite = async (parada) => {
  try {
    const favorites = await getStopFavorites();
    const exists = favorites.some((item) => item.cp === parada.cp);

    const updatedFavorites = exists
      ? favorites.filter((item) => item.cp !== parada.cp)
      : [...favorites, parada];

    await AsyncStorage.setItem(
      STOP_FAVORITES_KEY,
      JSON.stringify(updatedFavorites),
    );
    return updatedFavorites;
  } catch (error) {
    console.error("Erro ao alternar parada favorita:", error);
    return getStopFavorites();
  }
};

// ---------- Cache de paradas por linha ----------

export const getCachedStops = async (codigoLinha) => {
  try {
    const data = await AsyncStorage.getItem(stopsKey(codigoLinha));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao ler paradas do cache:", error);
    return null;
  }
};

export const saveCachedStops = async (codigoLinha, stops) => {
  try {
    await AsyncStorage.setItem(stopsKey(codigoLinha), JSON.stringify(stops));
  } catch (error) {
    console.error("Erro ao salvar paradas no cache:", error);
  }
};
