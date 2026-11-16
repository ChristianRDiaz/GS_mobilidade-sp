import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#0056b3", // Azul SPTrans / Urbano
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0056b3",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrimary: {
    color: "#fff",
  },
  textSecondary: {
    color: "#0056b3",
  },
});
