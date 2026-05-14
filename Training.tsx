import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSQLiteContext } from "expo-sqlite";
import MyStylesheet from "./MyStylesheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import db_command from "./database/db_command";
import { useFocusEffect, useRoute } from "@react-navigation/native";

type TrainingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Training">;
};

const Training: React.FC<TrainingScreenProps> = ({ navigation }) => {
  const route: any = useRoute();
  const db = useSQLiteContext();
  const [bookSelected, setBookSelected] = useState(-1);
  const [bookList, setBookList] = useState<Array<any>>([]);
  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "tmain":
        navigation.navigate("TrainingMain", { bookID: bookSelected });
        break;
      case "back":
        navigation.goBack();
        break;
    }
  };
  const onWordsPress = (wid: number) => {
    setBookSelected((id_) => {
      const id = id_ == wid ? -1 : wid;
      const json = JSON.stringify(
        bookList.find((words: any) => words.ID == id),
      );
      console.log(id == -1 ? -1 : wid, id == -1 ? "NEW/UNDO" : json);
      return id;
    });
  };
  const fetchData = useCallback(() => {
    // Logic to fetch or update your data
    try {
      console.log("Screen focused, fetching data...");
      console.log(db_command.bookListQuery);
      const asynclist = db.getAllSync(db_command.bookListQuery, {
        useNewConnection: true,
      });
      const reversed = asynclist.reverse();
      console.log("reversed: " + JSON.stringify(reversed));
      setBookList([...reversed]);
    } catch (error) {
      console.error(error);
    }
    // Example: setData(fetchedNewData);
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
        style={[styles.container, { flex: 1, display: "flex" }]}
        colors={["#6bbfff", "#f194ff"]} // Purple gradient
        start={{ x: 0, y: 0 }} // Top-left
        end={{ x: 1, y: 1 }} // Bottom-right
      >
        {/* 1 + 3 + 10*/}
        <View style={{ flex: 1 }}></View>
        <Text style={styles.app_title}>Trainning</Text>
        <Text style={[styles.hints, { flex: 1 }]}>
          Select a wordsbook and start
        </Text>
        <SafeAreaView style={{ ...styles.bookListView, flex: 7 }}>
          <FlatList
            style={{
              borderTopWidth: 1,
              backgroundColor: "rgba(80, 80, 101, 0.3)",
            }}
            data={bookList}
            persistentScrollbar
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  onWordsPress(item.ID);
                }}
              >
                <View
                  style={{
                    ...styles.bookListItem,
                    flexDirection: "row",
                    height: "auto",
                    justifyContent: "space-between",
                    borderColor: bookSelected == item.ID ? "brown" : "black",
                  }}
                >
                  <Text
                    style={{ alignItems: "flex-start", alignSelf: "stretch" }}
                  >
                    {item.WORDSBOOKS_NAME}
                  </Text>
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
            keyExtractor={(item: any) => item.ID}
          ></FlatList>
        </SafeAreaView>
        <View
          style={{
            ...styles.bookListButtonArea,
            ...styles.view,
            flex: 3,
            zIndex: 1,
            flexDirection: "column",
          }}
        >
          <TouchableOpacity
            style={[
              styles.bookListButton,
              { flex: 1, borderColor: bookSelected == -1 ? "gray" : "black" },
            ]}
            disabled={bookSelected == -1}
            onPress={() => {
              onClickToPage("tmain");
            }}
          >
            <Text
              style={[
                styles.text,
                { color: bookSelected == -1 ? "gray" : "black" },
              ]}
            >
              Start Trainning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bookListButton,
              {
                // marginTop: 5,
                flex: 1,
                borderColor: "grey",
                alignItems: "center",
                alignSelf: "stretch",
              },
            ]}
            disabled
            onPress={() => {}}
          >
            <Text style={[styles.text, { color: "grey" }]}>Scoreboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bookListButton,
              {
                // marginTop: 5,
                flex: 1,
                alignItems: "center",
                alignSelf: "stretch",
              },
            ]}
            onPress={() => onClickToPage("back")}
          >
            <Text style={[styles.text]}>Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Training;

const styles = StyleSheet.create(MyStylesheet);
