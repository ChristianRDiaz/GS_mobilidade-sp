import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  getBusPositions,
  getStopsWithFallback,
  getLinePredictions,
} from "../services/api";
import { getClosestStop, MAX_WALK_METERS } from "../utils/geo";
import { styles } from "../styles/MapScreen.Styles";

const INITIAL_REGION = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const getMinutesRemaining = (currentHr, targetHr) => {
  if (!currentHr || !targetHr) return null;
  const [curH, curM] = currentHr.split(":").map(Number);
  const [tarH, tarM] = targetHr.split(":").map(Number);
  let diff = tarH * 60 + tarM - (curH * 60 + curM);
  if (diff < -720) diff += 1440;
  return diff <= 0 ? "Chegando agora" : `${diff} min`;
};

export default function MapScreen({ route }) {
  const { linha } = route.params;

  // Estados: guardam o que aparece na tela
  const [vehicles, setVehicles] = useState([]);
  const [stops, setStops] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [nearestStopInfo, setNearestStopInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [usandoSentidoAlternativo, setUsandoSentidoAlternativo] =
    useState(false);

  // Refs: guardam valores que mudam sem precisar redesenhar a tela
  const mapRef = useRef(null);
  const firstLoadRef = useRef(true);

  const getUserGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return loc.coords;
    } catch (err) {
      console.log("GPS indisponível:", err.message);
      return null;
    }
  };

  const loadMapData = async () => {
    try {
      const currentCoords = await getUserGPS();

      const [posData, stopsResult, predData] = await Promise.all([
        getBusPositions(linha.cl),
        getStopsWithFallback(linha),
        getLinePredictions(linha.cl),
      ]);

      const activeBuses =
        posData && Array.isArray(posData.vs) ? posData.vs : [];
      const validStops = Array.isArray(stopsResult.stops)
        ? stopsResult.stops
        : [];
      const validPreds = Array.isArray(predData) ? predData : [];
      const apiHour = posData?.hr || "";

      setVehicles(activeBuses);
      setStops(validStops);
      setPredictions(validPreds);
      setUsandoSentidoAlternativo(stopsResult.sentidoAlternativo);
      if (apiHour) setLastUpdate(apiHour);

      const result = getClosestStop(validStops, currentCoords);

      if (result) {
        const { stop, distance } = result;
        const stopPred = validPreds.find((p) => p.cp === stop.cp);
        const nextBus = stopPred?.vs?.[0];

        setNearestStopInfo({
          stop,
          distance,
          tooFar: distance > MAX_WALK_METERS,
          nextBusPrefix: nextBus?.p || null,
          etaText: nextBus ? getMinutesRemaining(apiHour, nextBus.t) : null,
          arrivalTime: nextBus?.t || null,
        });
      } else {
        setNearestStopInfo(null);
      }

      if (mapRef.current && firstLoadRef.current) {
        if (activeBuses.length > 0) {
          mapRef.current.animateToRegion(
            {
              latitude: activeBuses[0].py,
              longitude: activeBuses[0].px,
              latitudeDelta: 0.02, 
              longitudeDelta: 0.02,
            },
            800,
          );
          firstLoadRef.current = false;
        } else if (currentCoords) {
          mapRef.current.animateToRegion(
            {
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            },
            800,
          );
          firstLoadRef.current = false;
        }
      }
    } catch (e) {
      console.log("Erro ao carregar dados do mapa:", e);
    } finally {
      setLoading(false);
    }
  };

  const openDirectionsToStop = () => {
    if (!nearestStopInfo?.stop) return;
    const { py, px, np } = nearestStopInfo.stop;
    const label = encodeURIComponent(np || "Parada SPTrans");
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${py},${px}`,
      android: `geo:0,0?q=${py},${px}(${label})`,
    });
    Linking.openURL(url);
  };

  useEffect(() => {
    loadMapData();
    const interval = setInterval(loadMapData, 15000);
    return () => clearInterval(interval);
  }, [linha.cl]);

  const getStopDescription = (stop) => {
    const stopPred = predictions.find((p) => p.cp === stop.cp);
    const nextBus = stopPred?.vs?.[0];
    if (nextBus) {
      const eta = getMinutesRemaining(lastUpdate, nextBus.t);
      return `Próximo ônibus (${nextBus.p}): ${eta} (às ${nextBus.t})`;
    }
    return stop.ed || "Sem previsão no momento";
  };

  const routeCoordinates = stops
    .filter((s) => s && s.py && s.px)
    .map((stop) => ({
      latitude: stop.py,
      longitude: stop.px,
    }));

  const formatKm = (meters) => (meters / 1000).toFixed(1).replace(".", ",");

  // Mensagem do card quando não há ponto para mostrar
  const semParadas = !loading && stops.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>
            Linha {linha.lt}-{linha.tl}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🚌 {vehicles.length} online</Text>
          </View>
        </View>
        <Text style={styles.headerSub}>
          {linha.tp} ➔ {linha.ts}
        </Text>
        {lastUpdate ? (
          <Text style={styles.updateText}>
            Atualizado às {lastUpdate} (SPTrans)
          </Text>
        ) : null}
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#0056b3"
              strokeWidth={4}
            />
          )}

          {stops.map((stop, index) => {
            if (!stop || !stop.py || !stop.px) return null;
            const isNearest = nearestStopInfo?.stop?.cp === stop.cp;
            return (
              <Marker
                key={`stop-${stop.cp || index}`}
                coordinate={{ latitude: stop.py, longitude: stop.px }}
                title={
                  isNearest
                    ? `📍 Ponto mais próximo: ${stop.np}`
                    : `Parada: ${stop.np}`
                }
                description={getStopDescription(stop)}
                anchor={{ x: 0.5, y: 0.5 }} 
              >
                <View style={{
                  width: isNearest ? 16 : 10, 
                  height: isNearest ? 16 : 10,
                  borderRadius: 8,
                  backgroundColor: isNearest ? "#28a745" : "#0056b3",
                  borderWidth: 2,
                  borderColor: "#fff", 
                }} />
              </Marker>
            );
          })}

          {vehicles.map((bus) =>
            bus && bus.py && bus.px ? (
              <Marker
                key={`bus-${bus.p}`}
                coordinate={{ latitude: bus.py, longitude: bus.px }}
                title={`Prefixo: ${bus.p}`}
                description={`Acessível: ${bus.a ? "Sim ♿" : "Não"}`}
              >
                <View style={styles.busMarker}>
                  <Text style={styles.busMarkerText}>🚌 {bus.p}</Text>
                </View>
              </Marker>
            ) : null,
          )}
        </MapView>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#0056b3" />
            <Text style={styles.loaderText}>
              Obtendo sua localização e frota ao vivo...
            </Text>
          </View>
        )}

        <View style={styles.bottomCard}>
          <View style={styles.predictionBox}>
            {nearestStopInfo ? (
              <>
                {usandoSentidoAlternativo && (
                  <Text style={styles.sentidoNote}>
                    ℹ️ Esta linha não tem paradas no sentido escolhido.
                    Mostrando o outro sentido.
                  </Text>
                )}
                <Text style={styles.predictionLabel}>
                  📍 Ponto mais próximo de você (
                  {nearestStopInfo.tooFar
                    ? `${formatKm(nearestStopInfo.distance)} km`
                    : `${nearestStopInfo.distance} m • ~${Math.max(
                        1,
                        Math.round(nearestStopInfo.distance / 80),
                      )} min a pé`}
                  ):
                </Text>
                <Text style={styles.stopName} numberOfLines={1}>
                  {nearestStopInfo.stop.np}
                </Text>

                {nearestStopInfo.tooFar ? (
                  <Text style={styles.warningText}>
                    ⚠️ Esta linha não passa perto de você. Ela fica a{" "}
                    {formatKm(nearestStopInfo.distance)} km de distância, longe
                    demais para ir a pé.
                  </Text>
                ) : nearestStopInfo.etaText ? (
                  <Text style={styles.etaHighlight}>
                    ⏱️ Chegada prevista: {nearestStopInfo.etaText} (às{" "}
                    {nearestStopInfo.arrivalTime} • Prefixo{" "}
                    {nearestStopInfo.nextBusPrefix})
                  </Text>
                ) : (
                  <Text style={styles.etaMuted}>
                    ℹ️ Sem veículos próximos a esta parada no momento.
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.etaMuted}>
                {loading
                  ? "Buscando parada..."
                  : semParadas
                    ? "Não encontramos paradas monitoradas para esta linha. A SPTrans só fornece dados de paradas para corredores específicos."
                    : "Não foi possível encontrar um ponto. Verifique se o GPS está ativado e tente novamente."}
              </Text>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.refreshBtn, { flex: 1, marginRight: 8 }]}
              onPress={loadMapData}
            >
              <Text style={styles.refreshBtnText}>🔄 Atualizar</Text>
            </TouchableOpacity>

            {nearestStopInfo?.stop && !nearestStopInfo.tooFar && (
              <TouchableOpacity
                style={styles.routeBtn}
                onPress={openDirectionsToStop}
              >
                <Text style={styles.refreshBtnText}>🚶 Ir até o Ponto</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}