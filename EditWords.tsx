import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
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
import { SelectList } from "react-native-dropdown-select-list";
import {
  connectToDatabase,
  createWords,
  deleteWords,
  getBookDetails,
  getBookWords,
  getLangList,
  updateBooks,
  updateWords,
} from "./database/db_v2";

const styles = MyStylesheet;

type EditWordsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "EditWords">;
};

const EditWords: React.FC<EditWordsScreenProps> = ({ navigation }) => {
  const route: any = useRoute();
  const [bookDetail, setBookDetail] = useState<any>([]);
  const [langList, setLangList] = useState<Array<any>>([]);
  const [wordsList, setWordsList] = useState<Array<any>>([]);
  const [newText, setNewText] = useState("");
  const [newTextTrans, setNewTextTrans] = useState("");
  const [newDes, setNewDes] = useState("");
  const [newName, setNewName] = useState("");
  const [selected, setSelected] = useState(-1);
  const [wordsSelected, setWordsSelected] = useState(-1);
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "back":
        navigation.goBack();
        break;
    }
  };
  const TEXT_VALUE =
    wordsSelected != -1
      ? wordsList.find((words) => words.id == wordsSelected)?.TEXT
      : newText;
  const TEXT_TRANS_VALUE =
    wordsSelected != -1
      ? wordsList.find((words) => words.id == wordsSelected)?.TEXT_TRANS
      : newTextTrans;
  const DES_VALUE =
    wordsSelected != -1
      ? wordsList.find((words) => words.id == wordsSelected)?.DES
      : newDes;
  const onWordsChange = (id: number, attr: string, context: string) => {
    setWordsList((list_) => {
      const list = list_.map((words: any) => {
        if (words.id == id) {
          words[attr] = context;
        }
        return words;
      });
      return list;
    });
  };
  const onWordsPress = (wid: number) => {
    setWordsSelected((id_) => {
      const id = id_ == wid ? -1 : wid;
      const json = JSON.stringify(
        wordsList.find((words: any) => words.id == id),
      );
      console.log(id == -1 ? -1 : wid, id == -1 ? "NEW/UNDO" : json);
      return id;
    });
  };
  const fetchData = useCallback(async () => {
    // Logic to fetch or update your data
    console.log("Screen focused, fetching data...");
    // Example: setData(fetchedNewData);
    try {
      const db = await connectToDatabase();
      const book: any = await getBookDetails(db, route.params.bookID);
      setBookDetail(() => {
        setSelected(book.lang_id);
        setNewName(book.name);
        return book;
      });
      const lang = await getLangList(db);
      setLangList([...lang]);
      const words = await getBookWords(db, route.params.bookID);
      setWordsList([...words.reverse()]);
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
      <TouchableWithoutFeedback
        style={[{ flex: 1, display: "flex" }]}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <LinearGradient
          style={[styles.container, { zIndex: 9, display: "flex", flex: 1 }]}
          colors={["#6bbfff", "#f194ff"]} // Purple gradient
          start={{ x: 0, y: 0 }} // Top-left
          end={{ x: 1, y: 1 }} // Bottom-right
          onTouchStart={() => {}}
        >
          <View style={{ flex: 1 }}></View>

          <Text style={[styles.hints, { flex: 1 }]}>
            Edit & Save wordsbook details
          </Text>
          <View
            style={{
              flex: 4,
              zIndex: 999,
              elevation: 999,
              flexDirection: "column",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewName(text)}
                value={newName}
              />
            </View>
            <View
              style={{
                flex: 1,
                // marginBottom: 20,
                zIndex: 999,
                elevation: 10,
                overflow: "visible",
              }}
            >
              <SelectList
                setSelected={(val: number) => setSelected(val)}
                data={langList}
                save="key"
                dropdownStyles={styles.dropdownStyle}
                boxStyles={styles.boxStyle}
                defaultOption={langList[bookDetail.lang_id - 1]}
                //   inputStyles={{
                //     borderColor: "gray",
                //     borderBottomWidth: 1,
                //   }}
              />
            </View>
          </View>
          <View style={[styles.bookListButtonArea, { flex: 2, zIndex: 1 }]}>
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={() => {
                Alert.alert(
                  "Alert", // The title of the alert
                  "Confirm Save?", // The message of the alert
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
                          const result = await updateBooks(
                            db,
                            route.params.bookID,
                            newName,
                            selected,
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
              }}
            >
              <Text style={[styles.text]}>Save Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={() => onClickToPage("back")}
            >
              <Text style={[styles.text]}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.hints, { flex: 1 }]}>
            Click the item to make changes:
          </Text>
          <View
            style={{
              flex: 6,
              alignContent: "space-between",
              flexDirection: "column",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  wordsSelected == -1
                    ? setNewText(text)
                    : onWordsChange(wordsSelected, "TEXT", text)
                }
                value={TEXT_VALUE}
                placeholder={"Words"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  wordsSelected == -1
                    ? setNewTextTrans(text)
                    : onWordsChange(wordsSelected, "TEXT_TRANS", text)
                }
                value={TEXT_TRANS_VALUE}
                placeholder={"Words Translated"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  wordsSelected == -1
                    ? setNewDes(text)
                    : onWordsChange(wordsSelected, "DES", text)
                }
                value={DES_VALUE}
                placeholder={"Description"}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          <SafeAreaView
            style={[styles.bookListView, { flex: 10, display: "flex" }]}
          >
            <FlatList
              style={{
                flex: 1,
                borderTopWidth: 1,
                backgroundColor: "rgba(80, 80, 101, 0.3)",
              }}
              data={wordsList}
              persistentScrollbar
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    onWordsPress(item.id);
                  }}
                >
                  <View
                    key={item.id}
                    style={{
                      ...styles.bookListItem,
                      flexDirection: "row",
                      height: "auto",
                      justifyContent: "space-between",
                      borderColor: wordsSelected == item.id ? "brown" : "black",
                    }}
                  >
                    <Text
                      style={{ alignItems: "flex-start", alignSelf: "stretch" }}
                    >
                      {item.TEXT}
                    </Text>
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
                                  const result = await deleteWords(db, item.id);
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
                      }}
                    />
                  </View>
                </TouchableOpacity>
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
            ></FlatList>
          </SafeAreaView>
          <View style={{ ...styles.bookListButtonArea, flex: 2, zIndex: 1 }}>
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={async () => {
                if (wordsSelected == -1) {
                  alert("Please click a words to start editing.");
                } else {
                  if (TEXT_VALUE.length == 0 || TEXT_TRANS_VALUE.length == 0) {
                    alert(`Invalid empty field found.`);
                  } else {
                    try {
                      const db = await connectToDatabase();
                      const result = await updateWords(
                        db,
                        wordsSelected,
                        TEXT_VALUE,
                        TEXT_TRANS_VALUE,
                        DES_VALUE,
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
                  }
                }
              }}
            >
              <Text style={styles.text}>Save Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bookListButton, { flex: 1 }]}
              onPress={async () => {
                if (wordsSelected != -1) {
                  alert("Please unclick the word item first.");
                } else {
                  if (TEXT_VALUE.length == 0 || TEXT_TRANS_VALUE.length == 0) {
                    alert(`Invalid empty field found.`);
                  } else {
                    try {
                      const db = await connectToDatabase();
                      const result = await createWords(
                        db,
                        route.params.bookID,
                        TEXT_VALUE,
                        TEXT_TRANS_VALUE,
                        DES_VALUE,
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
                  }
                }
              }}
            >
              <Text style={styles.text}>Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditWords;
