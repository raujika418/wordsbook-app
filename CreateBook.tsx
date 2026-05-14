import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { DATABASE_NAME } from "./database/db";
import { useSQLiteContext } from "expo-sqlite";
import MyStylesheet from "./MyStylesheet";
import { useCallback, useState } from "react";
import db_command from "./database/db_command";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useFocusEffect, useRoute } from "@react-navigation/native";

type CreateBookScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Words">;
};

const CreateBook: React.FC<CreateBookScreenProps> = ({ navigation }) => {
  const route: any = useRoute();
  const db = useSQLiteContext();
  const [langList, setLangList] = useState<Array<any>>([]);
  const [selected, setSelected] = useState(-1);
  const [text, setText] = useState("");
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "create":
        if (selected > -1) {
          try {
            //   console.log(db_command.bookListCreate(text, selected));
            const result = db.runSync(
              db_command.bookListCreate(text, selected),
            );
            alert(`Create ${result.changes == 1 ? "successful" : "failed"}.`);
          } catch (error) {
            console.error(error);
          }
        }
        navigation.goBack();
        break;
      case "back":
        navigation.goBack();
        break;
    }
  };
  const fetchData = useCallback(() => {
    // Logic to fetch or update your data
    console.log("Screen focused, fetching data...");
    // Example: setData(fetchedNewData);
    try {
      const syncList = db.getAllSync(db_command.langListQuery, {
        useNewConnection: true,
      });
      setLangList(() => {
        return [...syncList];
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
      }}
      edges={["bottom"]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          style={[styles.container, { flex: 1 }]}
          colors={["#6bbfff", "#f194ff"]} // Purple gradient
          start={{ x: 0, y: 0 }} // Top-left
          end={{ x: 1, y: 1 }} // Bottom-right
        >
          <View style={{ flex: 1 }}></View>
          <Text style={styles.hints}>Enter the book details</Text>
          <View
            style={{
              flex: 15,
              flexDirection: "column",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ flex: 1, alignSelf: "center" }}>Books Title</Text>
            </View>
            <View style={{ flex: 2 }}>
              <TextInput
                style={styles.input}
                onChangeText={(newText) => setText(newText)}
                defaultValue={text}
                placeholder="Enter title here"
              />
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={{ flex: 1, alignSelf: "center" }}>
                Language Select
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <SelectList
                setSelected={(val: number) => setSelected(val)}
                data={langList}
                save="key"
                dropdownStyles={styles.dropdownStyle}
                boxStyles={styles.boxStyle}
                //   inputStyles={{
                //     borderColor: "gray",
                //     borderBottomWidth: 1,
                //   }}
              />
            </View>
            <View style={{ flex: 12 }}>
              <Text>{/* {selected} */}</Text>
            </View>
          </View>
          <View
            style={[styles.bookListButtonArea, { flex: 2, display: "flex" }]}
          >
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={() => onClickToPage("back")}
            >
              <Text style={[styles.text]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={() => onClickToPage("create")}
            >
              <Text style={[styles.text]}>Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = MyStylesheet;

export default CreateBook;
