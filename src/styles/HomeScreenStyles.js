import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 12 },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 24,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  footer: { marginTop: "auto", paddingVertical: 12 },
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
