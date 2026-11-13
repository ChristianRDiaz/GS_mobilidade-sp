import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerInfo: {
    padding: 16,
    backgroundColor: "#0056b3",
    paddingTop: 50,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSub: { color: "#e0e0e0", fontSize: 13, marginTop: 2 },
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
