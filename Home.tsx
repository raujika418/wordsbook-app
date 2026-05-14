import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSQLiteContext } from "expo-sqlite";
import MyStylesheet from "./MyStylesheet";
import * as SQLite from "expo-sqlite";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const db = useSQLiteContext();
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "words":
        navigation.navigate("Words");
        break;
      case "training":
        navigation.navigate("Training");
        break;
    }
  };
  const getI18N = () => {};
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        backgroundColor: "transparent",
      }}
      edges={["bottom"]}
    >
      <LinearGradient
        style={[styles.container, { flex: 1 }]}
        colors={["#6bbfff", "#f194ff"]} // Purple gradient
        start={{ x: 0, y: 0 }} // Top-left
        end={{ x: 1, y: 1 }} // Bottom-right
      >
        {/* 1 + 3 + 10*/}
        <View style={{ flex: 1 }}></View>
        <Text style={[styles.app_title, { flex: 1 }]}>THE WORDS</Text>
        <Text style={[styles.app_title, { flex: 1 }]}>NOTEBOOK</Text>
        <View style={[styles.view, { flex: 4, display: "flex" }]}>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={() => onClickToPage("words")}
          >
            <Text style={[styles.text]}>Wordsbook Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1 }]}
            onPress={() => onClickToPage("training")}
          >
            <Text style={[styles.text]}>Trainning Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1, borderColor: "grey" }]}
            onPress={() => {
              // Replaces the old deleteDatabaseAsync if using newer expo-sqlite versions
              console.log("deleting");
              // SQLite.deleteDatabaseSync("db_v1.db");
            }}
          >
            <Text style={[styles.text, { color: "grey" }]}>
              {/* Setting */}
              About Developer
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}></View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create(MyStylesheet);
