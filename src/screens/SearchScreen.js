import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/SearchScreenStyles";
import Input from "../components/Input";
import Button from "../components/Button";
import BusCard from "../components/BusCard";
import {
  getFavorites,
  toggleFavorite,
  getStopFavorites,
  toggleStopFavorite,
} from "../storage/storage";
import {
  searchBusLines,
  searchStops,
  getBusPositions,
  getStopPredictions,
} from "../services/api";

const MAX_LINES_WITH_BUS_INFO = 10;

export default function SearchScreen({ navigation }) {
  
  const [modo, setModo] = useState("linhas");
  const [searchTerm, setSearchTerm] = useState("");
  const [lines, setLines] = useState([]);
  const [stops, setStops] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stopFavorites, setStopFavorites] = useState([]);
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [busInfo, setBusInfo] = useState({});
  const [stopPreds, setStopPreds] = useState({});
  const [openStop, setOpenStop] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const [lineFavs, stopFavs] = await Promise.all([
      getFavorites(),
      getStopFavorites(),
    ]);
    setFavorites(lineFavs);
    setStopFavorites(stopFavs);
    return { lineFavs, stopFavs };
  };


  const loadBusCounts = async (list) => {
    const entries = await Promise.all(
      list.slice(0, MAX_LINES_WITH_BUS_INFO).map(async (linha) => {
        const { vs } = await getBusPositions(linha.cl);
        return [
          linha.cl,
          {
            total: vs.length,
            accessible: vs.filter((bus) => bus.a).length,
          },
        ];
      }),
    );
    setBusInfo((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  };

  const loadStopPredictions = async (list) => {
    const entries = await Promise.all(
      list.map(async (parada) => [
        parada.cp,
        await getStopPredictions(parada.cp),
      ]),
    );
    setStopPreds((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
  };

  const changeModo = (novoModo) => {
    setModo(novoModo);
    setShowingFavorites(false);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    setShowingFavorites(false);
    if (!searchTerm.trim()) return;
    try {
      if (modo === "linhas") {
        const data = await searchBusLines(searchTerm);
        setLines(data);
        loadBusCounts(data);
      } else {
        const data = await searchStops(searchTerm);
        setStops(data);
      }
    } catch (error) {
      console.log("Erro na pesquisa:", error.message);
    }
  };

  const handleShowFavorites = async () => {
    setShowingFavorites(true);
    const { lineFavs, stopFavs } = await loadFavorites();
    loadBusCounts(lineFavs);
    loadStopPredictions(stopFavs);
  };

  const handleToggleLineFavorite = async (linha) => {
    const updated = await toggleFavorite(linha);
    setFavorites(updated);
  };

  const handleToggleStopFavorite = async (parada) => {
    const updated = await toggleStopFavorite(parada);
    setStopFavorites(updated);
    if (updated.some((item) => item.cp === parada.cp)) {
      loadStopPredictions([parada]);
    }
  };

  const handleOpenStop = (parada) => {
    if (openStop === parada.cp) {
      setOpenStop(null);
      return;
    }
    setOpenStop(parada.cp);
    loadStopPredictions([parada]);
  };

  const isLineFav = (linha) => favorites.some((f) => f.cl === linha.cl);
  const isStopFav = (parada) => stopFavorites.some((f) => f.cp === parada.cp);
  const visibleLines = onlyAccessible
    ? lines.filter((l) => (busInfo[l.cl]?.accessible ?? 0) > 0)
    : lines;

  const favoriteItems = [
    ...favorites.map((l) => ({ _kind: "line", key: `line-${l.cl}`, data: l })),
    ...stopFavorites.map((s) => ({
      _kind: "stop",
      key: `stop-${s.cp}`,
      data: s,
    })),
  ];

  const searchItems =
    modo === "linhas"
      ? visibleLines.map((l) => ({
          _kind: "line",
          key: `line-${l.cl}`,
          data: l,
        }))
      : stops.map((s) => ({ _kind: "stop", key: `stop-${s.cp}`, data: s }));

  const listData = showingFavorites ? favoriteItems : searchItems;

  const renderPredictions = (data) => {
    if (data === undefined) {
      return <Text style={styles.predMuted}>Carregando previsões...</Text>;
    }
    if (!data || !Array.isArray(data.l) || data.l.length === 0) {
      return (
        <Text style={styles.predMuted}>
          Sem previsão para esta parada no momento.
        </Text>
      );
    }

    return data.l.map((linha, index) => {
      const proximos = (linha.vs || []).slice(0, 2);
      return (
        <View key={`${linha.cl}-${index}`} style={styles.predRow}>
          <Text style={styles.predLinha}>{linha.c || linha.cl}</Text>
          <Text style={styles.predText}>
            {proximos.length === 0
              ? "sem previsão"
              : proximos
                  .map((bus) => `${bus.t}${bus.a ? " ♿" : ""}`)
                  .join("  •  ")}
          </Text>
        </View>
      );
    });
  };

  const renderLine = (linha) => {
    const info = busInfo[linha.cl];
    return (
      <View>
        <BusCard
          linha={`${linha.lt}-${linha.tl}`}
          nome={`${linha.tp} / ${linha.ts}`}
          sentido={linha.sl}
          isFavorite={isLineFav(linha)}
          onFavoritePress={() => handleToggleLineFavorite(linha)}
        />
        {info && (
          <Text style={styles.busCount}>
            🚌 {info.total} online • ♿ {info.accessible} acessível(is)
          </Text>
        )}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate("MapScreen", { linha })}
        >
          <Text style={styles.mapButtonText}>
            🗺️ Ver Ônibus no Mapa ao Vivo
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStop = (parada) => {
    const favorita = isStopFav(parada);
    const aberta = showingFavorites || openStop === parada.cp;

    return (
      <View style={styles.stopCard}>
        <View style={styles.stopHeader}>
          <Text style={styles.stopName} numberOfLines={2}>
            🚏 {parada.np}
          </Text>
          <TouchableOpacity onPress={() => handleToggleStopFavorite(parada)}>
            <Ionicons
              name={favorita ? "heart" : "heart-outline"}
              size={24}
              color={favorita ? "#ff3b30" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {parada.ed ? <Text style={styles.stopAddress}>{parada.ed}</Text> : null}

        {!showingFavorites && (
          <TouchableOpacity
            style={styles.predBtn}
            onPress={() => handleOpenStop(parada)}
          >
            <Text style={styles.predBtnText}>
              {openStop === parada.cp
                ? "Ocultar previsões"
                : "🕒 Ver previsões de chegada"}
            </Text>
          </TouchableOpacity>
        )}

        {aberta && (
          <View style={styles.predBox}>
            {renderPredictions(stopPreds[parada.cp])}
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) =>
    item._kind === "line" ? renderLine(item.data) : renderStop(item.data);

  const emptyMessage = showingFavorites
    ? "Nenhuma linha ou parada favoritada ainda."
    : modo === "linhas" && onlyAccessible && lines.length > 0
      ? "Nenhuma linha com ônibus acessíveis entre as primeiras consultadas."
      : "Pesquise acima para ver resultados.";

  return (
    <View style={styles.container}>
      <View style={styles.modoRow}>
        <TouchableOpacity
          style={[styles.modoBtn, modo === "linhas" && styles.modoBtnAtivo]}
          onPress={() => changeModo("linhas")}
        >
          <Text
            style={[styles.modoText, modo === "linhas" && styles.modoTextAtivo]}
          >
            🚌 Linhas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modoBtn, modo === "paradas" && styles.modoBtnAtivo]}
          onPress={() => changeModo("paradas")}
        >
          <Text
            style={[
              styles.modoText,
              modo === "paradas" && styles.modoTextAtivo,
            ]}
          >
            🚏 Paradas
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {modo === "linhas"
          ? "Digite o número ou nome da linha:"
          : "Digite o nome ou endereço da parada:"}
      </Text>
      <Input
        placeholder={
          modo === "linhas"
            ? "Ex: 8000 ou Lapa"
            : "Ex: Paulista ou Avenida Nazaré"
        }
        value={searchTerm}
        onChangeText={setSearchTerm}
        iconName="search"
        onSubmitEditing={handleSearch}
      />

      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Button title="Pesquisar" onPress={handleSearch} />
        </View>
        <TouchableOpacity
          style={styles.favTabButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.favTabButtonText}>
            ❤️ Favoritos ({favorites.length + stopFavorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {modo === "linhas" && !showingFavorites && (
        <View style={styles.switchRow}>
          <Switch value={onlyAccessible} onValueChange={setOnlyAccessible} />
          <Text style={styles.switchText}>
            ♿ Só linhas com ônibus acessíveis
          </Text>
        </View>
      )}

      {showingFavorites && (
        <View style={styles.filterBanner}>
          <Text style={styles.filterText}>
            ⭐ Suas linhas e paradas favoritas
          </Text>
        </View>
      )}

      <FlatList
        style={styles.resultsList}
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
      />
    </View>
  );
}