import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "./src/screens/SearchScreen";
import MapScreen from "./src/screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SearchScreen">
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ title: "Buscar Linhas" }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "Tempo Real — SPTrans" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
