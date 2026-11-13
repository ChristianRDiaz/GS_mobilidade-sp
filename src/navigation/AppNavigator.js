import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Mobilidade SP - Favoritos" }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Buscar Linhas de Ônibus" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
