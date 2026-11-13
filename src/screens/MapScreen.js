import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getBusPositions } from "../services/api";

export default function MapScreen({ route }) {
  const { linha } = route.params || {
    cl: 8000,
    lt: "8000",
    tp: "Terminal Lapa",
    ts: "Praça Ramos",
  };
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noBusMessage, setNoBusMessage] = useState(false);

  const [region, setRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  const fetchPositions = async () => {
    const data = await getBusPositions(linha.cl);

    if (data && data.vs && data.vs.length > 0) {
      setVehicles(data.vs);
      setNoBusMessage(false);
      setRegion({
        latitude: data.vs[0].py,
        longitude: data.vs[0].px,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    } else {
      setVehicles([]);
      setNoBusMessage(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 15000);
    return () => clearInterval(interval);
  }, [linha.cl]);

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Linha: {linha.lt}</Text>
        <Text style={styles.headerSub}>
          {linha.tp} ➔ {linha.ts}
        </Text>
      </View>

      {noBusMessage && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>
            ⚠️ Nenhum veículo desta linha transmitindo posição no momento.
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loaderText}>
            Localizando ônibus em tempo real...
          </Text>
        </View>
      ) : (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          {vehicles.map((bus) => (
            <Marker
              key={bus.p}
              coordinate={{
                latitude: bus.py,
                longitude: bus.px,
              }}
              title={`Ônibus: ${bus.p}`}
              description={`Acessível: ${bus.a ? "Sim" : "Não"}`}
            >
              <View style={styles.busMarker}>
                <Text style={styles.busMarkerText}>
                  🚌 {bus.lt || linha.lt}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerInfo: {
    padding: 16,
    backgroundColor: "#0056b3",
    paddingTop: 50,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSub: { color: "#e0e0e0", fontSize: 13, marginTop: 2 },
  alertBanner: {
    backgroundColor: "#fff3cd",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ffeeba",
  },
  alertText: { color: "#856404", fontSize: 12, fontWeight: "bold" },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#555", fontSize: 14 },
  busMarker: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0056b3",
    elevation: 4,
  },
  busMarkerText: { fontWeight: "bold", fontSize: 12, color: "#0056b3" },
});
