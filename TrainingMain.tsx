import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { RootStackParamList } from "./types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import MyStylesheet from "./MyStylesheet";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Progress from "react-native-progress";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { connectToDatabase, getBookWords } from "./database/db_v2";

type TrainingMainScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "TrainingMain">;
};

const TrainingMain: React.FC<TrainingMainScreenProps> = ({ navigation }) => {
  const route: any = useRoute();

  const shuffleArray = (array: Array<any>) => {
    // Create a shallow copy to avoid mutating the original array
    const shuffledArr = [...array];
    for (let i = shuffledArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements using array destructuring
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }
    return shuffledArr;
  };

  const [wordList, setWordsList] = useState<Array<any>>([]);
  const [mcChoice, setMcChoice] = useState<Array<any>>([]);
  const [selected, setSelected] = useState(-1);
  const [rightNum, setRightNum] = useState(0);
  const [wrongNum, setWrongNum] = useState(0);
  const [missedNum, setMissedNum] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(-3.5);
  const [pressed, setPressed] = useState(false);
  const [limit, setLimit] = useState(0);
  const [quitAlertText, setQuitAlertText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [previous, setPrevious] = useState<Boolean>(true);
  const intervalRef: any = useRef(null);

  const onClickToPage = (pageId: string) => {
    switch (pageId) {
      case "back":
        toggleTimer(); // set `isRunning = false`
        navigation.goBack();
        break;
    }
  };
  const toggleTimer = () => {
    setIsRunning((prev) => {
      if (wordList.length < 8) {
        setQuitAlertText(
          "Too less words in wordsbook, click Quit to terminate training.",
        );
        setShowAlert(true);
        return prev;
      }
      return !prev;
    });
  };
  const pickFour = (index: number) => {
    if (index < wordList.length) {
      const right_answer = wordList[index];
      // console.log(JSON.stringify());
      console.log("right_answer: " + JSON.stringify(right_answer));
      const three_wrong = shuffleArray(
        wordList.filter((_, nth) => nth != index),
      ).slice(0, 3);
      console.log("three_wrong: " + JSON.stringify(three_wrong));
      const pos = Math.floor((Math.random() * 12) % 4);
      const four = three_wrong
        .slice(0, pos)
        .concat(right_answer)
        .concat(three_wrong.slice(pos, 4));
      console.log("four_choice: " + JSON.stringify(four));
      setMcChoice([...four]);
    } else {
      setMcChoice([]);
    }
  };
  const fetchData = useCallback(async () => {
    // Logic to fetch or update your data
    console.log("Screen focused, fetching data...");
    // Example: setData(fetchedNewData);  const wordListInit = shuffleArray(
    try {
      const db = await connectToDatabase();
      const words = shuffleArray(await getBookWords(db, route.params.bookID));
      setWordsList([...words]);
    } catch (error) {
      console.error(error);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );
  // useEffect hook to handle the timer logic when `isRunning` changes
  useEffect(() => {
    if (isRunning) {
      // Start the interval and store its ID in the ref
      intervalRef.current = setInterval(() => {
        // console.log("running");
        setSeconds((prev) => {
          setLimit((prev_) => {
            if (prev_ + 0.1 >= 3.5) {
              setSelected((s) => {
                if (s + 1 >= wordList.length) {
                  setShowSummary(true);
                  setShowAlert(true);
                  toggleTimer();
                  return -1;
                }
                if (prev_ + 0.1 >= 3.3) {
                  if (s > -1) {
                    setMissedNum((i) => i + 1);
                  }
                  setPrevious(false);
                  pickFour(s + 1);
                  return s + 1;
                }
                return s;
              });
              return 0;
            } else {
              return prev_ + 0.1;
            }
          });
          return prev + 0.1;
        });
      }, 100); // Update every 1000 milliseconds (1 second)
    } else {
      // Clear the interval if the timer is paused or stopped
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, showSummary, showAlert, mcChoice]);
  const getI18N = () => {};
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
        <View
          style={[
            {
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: 99999,
              elevation: 99999,
              display: showAlert ? "flex" : "none",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              padding: 10,
              margin: 30,
              backgroundColor: "#FFF",
              alignSelf: "stretch",
              display: "flex",
              borderRadius: 5,
            }}
          >
            <Text
              style={{ padding: 3, display: showSummary ? "none" : "flex" }}
            >
              {quitAlertText}
            </Text>
            <Text
              style={{ padding: 3, display: showSummary ? "flex" : "none" }}
            >
              {`Playful! Time Used: ${seconds.toFixed(1)}s, ` +
                `Accuracy: ${Math.floor((rightNum / wordList.length) * 100)}%`}
            </Text>
            <TouchableOpacity
              style={[styles.bookListButton, { padding: 5 }]}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text>quit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{ flex: 1 }}
          >{`TIME PASSED: ${seconds.toFixed(1)}`}</Text>
          <Text style={{ flex: 1, color: previous ? "green" : "red" }}>
            {selected > 0 ? `YOU ARE ${previous ? "RIGHT!" : "WRONG."}` : ""}
          </Text>
        </View>
        {/* <Text style={styles.hints}>{route.params.bookID}</Text> */}
        <View style={[styles.view, { flex: 5 }]}>
          <Text
            style={{
              alignItems: "center",
              alignSelf: "stretch",
              justifyContent: "center",
              fontSize: 50,
            }}
          >
            {selected > -1 && selected < wordList.length
              ? wordList[selected].TEXT
              : "GAME READY"}
          </Text>
        </View>
        <View
          style={[
            styles.view,
            {
              flex: 1,
              flexDirection: "row",
              // marginHorizontal: 5,
            },
          ]}
        >
          <Progress.Bar
            progress={limit / 3.5}
            style={{
              alignSelf: "center",
              flex: 1,
            }}
            width={null}
            color="black"
          />
        </View>
        <View
          style={[
            styles.view,
            {
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
              // marginHorizontal: 5,
            },
          ]}
        >
          <Text
            style={{
              flex: 1,
              // marginHorizontal: 5,
              alignItems: "center",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            Right: {rightNum}
          </Text>
          <Text
            style={{
              flex: 1,
              // marginHorizontal: 5,
              alignItems: "center",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            Wrong: {wrongNum}
          </Text>
          <Text
            style={{
              flex: 1,
              // marginHorizontal: 5,
              alignItems: "center",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            Missed:
            {missedNum}
          </Text>
          <Text
            style={{
              flex: 1,
              // marginHorizontal: 5,
              alignItems: "center",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            Total: {selected + 1}/{wordList.length}
          </Text>
        </View>
        <View style={{ ...styles.bookListView, flex: 6 }}>
          {mcChoice.map((item, nth) => (
            <TouchableOpacity
              key={nth}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={[
                pressed
                  ? item?.id != wordList[selected]?.id
                    ? { backgroundColor: "rgba(256, 0, 0,0.3)" }
                    : { backgroundColor: "rgba(0, 256, 0,0.3)" }
                  : {
                      backgroundColor: "rgba(0, 0, 0,0.1)",
                    },
                {
                  flex: 1,
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                  borderTopLeftRadius: 25,
                  alignContent: "space-around",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginBottom: 3,
                },
              ]}
              onPress={() => {
                if (selected + 1 >= wordList.length) {
                  if (item?.id != wordList[selected]?.id) {
                    setWrongNum((i) => i + 1);
                  } else {
                    setRightNum((i) => i + 1);
                  }
                  setShowSummary(true);
                  setShowAlert(true);
                  toggleTimer();
                } else {
                  if (item?.id != wordList[selected]?.id) {
                    setSelected((s) => {
                      setPrevious(false);
                      setWrongNum((i) => i + 1);
                      setLimit(0);
                      pickFour(s + 1);
                      return s + 1;
                    });
                  } else {
                    setSelected((s) => {
                      setPrevious(true);
                      setRightNum((i) => i + 1);
                      setLimit(0);
                      pickFour(s + 1);
                      return s + 1;
                    });
                  }
                }
              }}
            >
              <Text style={{ alignSelf: "center" }}>{item?.TEXT_TRANS}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TouchableOpacity
          style={styles.bookListButton}
          onPress={() => {
            setSelected((s) => {
              setLimit(0);
              return s + 1;
            });
          }}
        >
          <Text>skip</Text>
        </TouchableOpacity> */}
        <View style={{ ...styles.bookListButtonArea, flex: 2 }}>
          <TouchableOpacity
            style={[styles.bookListButton, { flex: 1 }]}
            onPress={() => {
              toggleTimer();
            }}
          >
            <Text>{isRunning ? "pause" : "start"}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ ...styles.bookListButtonArea, flex: 2 }}>
          <TouchableOpacity
            style={[
              styles.bookListButton,
              { flex: 1, borderColor: isRunning ? "gray" : "black" },
            ]}
            disabled={isRunning}
            onPress={() => {
              onClickToPage("back");
            }}
          >
            <Text style={{ color: isRunning ? "gray" : "black" }}>quit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TrainingMain;

const styles = StyleSheet.create(MyStylesheet);
