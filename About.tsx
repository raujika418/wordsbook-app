import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import MyStylesheet from "./MyStylesheet";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type AboutScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "About">;
};

const About: React.FC<AboutScreenProps> = ({ navigation }) => {
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "words":
        navigation.navigate("Words");
        break;
      case "training":
        navigation.navigate("Training");
        break;
      case "back":
        navigation.goBack();
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
        <View style={{ flex: 2 }}></View>
        <Image
          style={{ flex: 12, width: "100%" }}
          source={require("./assets/Power.png")}
        />
        <View style={{ flex: 9, width: "100%" }}>
          <Text style={{ fontSize: 18, padding: 3 }}>
            {/* Setting */}
            Ho Yuen, Chu
          </Text>
          <Text style={{ fontSize: 18, padding: 3 }}>
            Freelance mail: {"\n"}howard.chu.2204n@gmail.com
          </Text>
          <Text style={{ fontSize: 18, padding: 3 }}>
            Instagram: {"\n"}@lischu57
          </Text>
          <Text style={{ fontSize: 18, padding: 3 }}>
            WhatsApp: {"\n"}+852 9774 4273
          </Text>
          <Text style={{ fontSize: 18, padding: 3 }}>
            Telegram: {"\n"}@hermit1997
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookListButton,
            {
              // marginTop: 5,
              flex: 2,
              alignItems: "center",
              alignSelf: "stretch",
              padding: 5,
            },
          ]}
          onPress={() => onClickToPage("back")}
        >
          <Text style={[styles.text]}>Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create(MyStylesheet);
