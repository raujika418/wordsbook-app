import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { initDatabase, DATABASE_NAME } from "./database/db";
import Home from "./Home";
import Words from "./Words";
import Training from "./Training";
import CreateBook from "./CreateBook";
import EditWords from "./EditWords";
import TrainingMain from "./TrainingMain";
import Storage from "expo-sqlite/kv-store";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const setupDb = () => {
      try {
        initDatabase();
        setIsDbReady(true);
        // const hasLaunched = await Storage.getItem("@app_has_launched");
        // if (hasLaunched === null) {
          // await Storage.setItem("@app_has_launched", "true");
          // alert("Please click Wordsbook Management at first start.");
        // }
      } catch (error) {
        setDbError("Database init failed");
        console.error(error);
      }
    };
    setupDb();
  }, []);

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
    <SQLiteProvider databaseName={DATABASE_NAME}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
