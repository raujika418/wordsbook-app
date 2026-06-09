import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { DATABASE_NAME } from "./database/db";
import MyStylesheet from "./MyStylesheet";
import { useEffect, useState, useCallback } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  connectToDatabase,
  getBookList,
  deleteBookList,
} from "./database/db_v2";

type WordsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Words">;
};

const Words: React.FC<WordsScreenProps> = ({ navigation }) => {
  const route: any = useRoute();
  const [bookList, setBookList] = useState<Array<any>>([]);
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "create":
        navigation.navigate("CreateBook");
        break;
      case "back":
        navigation.goBack();
        break;
    }
  };
  const fetchData = useCallback(async () => {
    // Logic to fetch or update your data
    console.log("Screen focused, fetching data...");
    // Example: setData(fetchedNewData);
    try {
      const db = await connectToDatabase();
      const asynclist = await getBookList(db);
      console.log(JSON.stringify(asynclist));
      setBookList(() => {
        return [...asynclist.reverse()];
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
      <LinearGradient
        style={[styles.container, { flex: 1 }]}
        colors={["#6bbfff", "#f194ff"]} // Purple gradient
        start={{ x: 0, y: 0 }} // Top-left
        end={{ x: 1, y: 1 }} // Bottom-right
      >
        <View style={{ flex: 1 }}></View>
        <Text style={[styles.hints, { flex: 1 }]}>
          Select or create your wordsbook
        </Text>

        <SafeAreaView
          style={[styles.bookListView, { flex: 18, display: "flex" }]}
        >
          <FlatList
            style={{
              flex: 1,
              borderTopWidth: 1,
              backgroundColor: "rgba(80, 80, 101, 0.3)",
            }}
            data={bookList}
            persistentScrollbar
            renderItem={({ item }: any) => (
              <View key={item.id} style={styles.bookListItem}>
                <View style={styles.bookListItemTitle}>
                  <Text style={styles.bookListItemTitleText}>{item.name}</Text>
                </View>
                <View style={styles.bookListItemOp}>
                  <Text style={styles.bookListItemLang}>{item.lang}</Text>
                  <View style={styles.bookListItemIconsGroup}>
                    <MaterialCommunityIcons
                      name="book-edit"
                      size={25}
                      color="black"
                      onPress={() => {
                        navigation.navigate("EditWords", {
                          bookID: item.id,
                        });
                        console.log(`EDIT ${item.id}`);
                      }}
                    />
                    <AntDesign
                      name="delete"
                      size={25}
                      color="black"
                      onPress={() => {
                        Alert.alert(
                          "Confirmation", // The title of the alert
                          "Confirm delete?", // The message of the alert
                          [
                            {
                              text: "No", // The text for the 'No' button
                              onPress: () => {}, // Callback for 'No'
                              style: "cancel", // (iOS only) Sets the button style to 'cancel'
                            },
                            {
                              text: "Yes", // The text for the 'Yes' button
                              onPress: async () => {
                                try {
                                  const db = await connectToDatabase();
                                  const result = await deleteBookList(
                                    db,
                                    item.id,
                                  );
                                  alert(
                                    (() => {
                                      fetchData();
                                      return `Edit ${result[0]?.rowsAffected == 1 ? "successful" : "failed"}.`;
                                    })(),
                                  );
                                } catch (error) {
                                  console.error(error);
                                }
                              }, // Callback for 'Yes'
                            },
                          ],
                          { cancelable: false }, // (Android only) Prevents dismissing the alert by tapping outside
                        );

                        console.log(`DELETE ${item.id}`);
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={{ ...styles.bookListItem, height: "auto" }}>
                <Text
                  style={{ alignItems: "flex-start", alignSelf: "stretch" }}
                >
                  No Record Yet
                </Text>
              </View>
            )}
            keyExtractor={(item: any) => item.id}
          />
        </SafeAreaView>
        <View style={[styles.bookListButtonArea, { flex: 2 }]}>
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
            <Text style={[styles.text]}>Create Book</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = MyStylesheet;

export default Words;
