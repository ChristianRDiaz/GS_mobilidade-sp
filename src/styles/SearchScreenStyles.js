import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  label: { fontSize: 16, color: "#333", marginBottom: 4, fontWeight: "500" },
  resultsList: { marginTop: 16 },
});

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
