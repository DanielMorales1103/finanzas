import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FinanceProvider } from "./src/context/FinanceContext";
import { CurrentInfoScreen } from "./src/screens/CurrentInfoScreen";
import { ExtraIncomeScreen } from "./src/screens/ExtraIncomeScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { RootStackParamList } from "./src/navigation/types";
import { colors } from "./src/theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.surface,
    primary: colors.accent,
    text: colors.text
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <FinanceProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: "800" }
            }}
          >
            <Stack.Screen component={HomeScreen} name="Home" options={{ headerShown: false }} />
            <Stack.Screen component={CurrentInfoScreen} name="CurrentInfo" options={{ title: "Info actual" }} />
            <Stack.Screen component={ExtraIncomeScreen} name="ExtraIncome" options={{ title: "Ingresos extra" }} />
            <Stack.Screen component={StatsScreen} name="Stats" options={{ title: "Estadisticas" }} />
            <Stack.Screen component={SettingsScreen} name="Settings" options={{ title: "Ajustes" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </FinanceProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
