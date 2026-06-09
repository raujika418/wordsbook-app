import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { createTables, connectToDatabase } from "./database/db_v2";
import Home from "./Home";
import Words from "./Words";
import Training from "./Training";
import CreateBook from "./CreateBook";
import EditWords from "./EditWords";
import TrainingMain from "./TrainingMain";
import About from "./About";
import { enablePromise, openDatabase } from "react-native-sqlite-storage";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
      console.log("loaded");
      setIsDbReady(true);
    } catch (error) {
      setDbError("Database init failed");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{dbError}</Text>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Initializing database...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // ← This makes Home your default screen
        screenOptions={{
          headerShown: false,
          cardStyle: { zIndex: 1, backgroundColor: "transparent" },
          presentation: "transparentModal",
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Words" component={Words} />
        <Stack.Screen name="Training" component={Training} />
        <Stack.Screen name="TrainingMain" component={TrainingMain} />
        <Stack.Screen name="CreateBook" component={CreateBook} />
        <Stack.Screen name="EditWords" component={EditWords} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
