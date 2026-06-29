import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import db_command from "./db_command";

// Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    { name: "db_v2.db", location: "default" },
    () => {
    },
    (error: any) => {
      console.error(error);
      throw Error("Could not connect to database");
    },
  );
};
export const createTables = async (db: SQLiteDatabase) => {
  const WordsCreate = `
        CREATE TABLE IF NOT EXISTS WORDS(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            WORDSBOOK_ID INTEGER NOT NULL,
            WORDS_TEXT CHAR(50) NOT NULL,
            WORDS_TEXT_TRANSLATED CHAR(50) NOT NULL,
            DES CHAR(50) NULL,
            FOREIGN KEY (WORDSBOOK_ID) REFERENCES WORDSBOOKS(ID)
        )
    `;
  const WordsBooksCreate = `
        CREATE TABLE IF NOT EXISTS WORDSBOOKS(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            WORDSBOOKS_NAME CHAR(50) NOT NULL,
            LANG_ID INTEGER NOT NULL,
            FOREIGN KEY (LANG_ID) REFERENCES LANG(ID)
        )
    `;
  const LangCreate = `
        CREATE TABLE IF NOT EXISTS LANG(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            LANG_CODE CHAR(50) NOT NULL,
            LANG_DISPLAY_NAME CHAR(50) NOT NULL
        )
    `;
  const ScoreboardCreate = `
        CREATE TABLE IF NOT EXISTS SCOREBOARD(
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            CREATE_DTM DATETIME NOT NULL,
            WORDSBOOK_ID INTEGER NOT NULL,
            SCORE INTEGER NOT NULL,
            FOREIGN KEY (WORDSBOOK_ID) REFERENCES WORDSBOOKS(ID)
        )
    `;
  const langRows = [
    [1, "en-US", "ENGLISH (UNITED STATES)"],
    [2, "zh-CN", "CHINESE (SIMPLIFIED)"],
    [3, "zh-TW", "CHINESE (TRADITIONAL)"],
    [4, "ja-JP", "JAPANESE (JAPAN)"],
    [5, "en-GB", "English (United Kingdom)"],
    [6, "ko-KR", "Korean (South Korea)"],
    [7, "es-ES", "Spanish (Spain)"],
    [8, "es-MX", "Spanish (Mexico)"],
    [9, "fr-FR", "French (France)"],
    [10, "fr-CA", "French (Canada)"],
    [11, "de-DE", "German (Germany)"],
    [12, "de-AT", "German (Austria)"],
    [13, "it-IT", "Italian (Italy)"],
    [14, "pt-BR", "Portuguese (Brazil)"],
    [15, "pt-PT", "Portuguese (Portugal)"],
    [16, "ru-RU", "Russian (Russia)"],
    [17, "ar-SA", "Arabic (Saudi Arabia)"],
    [18, "hi-IN", "Hindi (India)"],
    [19, "vi-VN", "Vietnamese (Vietnam)"],
    [20, "th-TH", "Thai (Thailand)"],
    [21, "id-ID", "Indonesian (Indonesia)"],
    [22, "ms-MY", "Malay (Malaysia)"],
    [23, "tr-TR", "Turkish (Turkey)"],
    [24, "nl-NL", "Dutch (Netherlands)"],
    [25, "sv-SE", "Swedish (Sweden)"],
    [26, "Others", "Others Languages"],
  ];
  const langInsert =
    `INSERT OR REPLACE INTO LANG (ID, LANG_CODE, LANG_DISPLAY_NAME)` +
    ` VALUES ${langRows.map(() => "(?,?,?)").join(",")}`;
  const wordsbookRows = [
    [1, "心, 夏目漱石", 4],
    [2, "1984, George Orwell", 1],
    [3, "ごじゅうおん 五十音, 「明覺」僧侶", 4],
  ];
  const wordsbookInsert =
    `INSERT OR REPLACE INTO WORDSBOOKS (ID, WORDSBOOKS_NAME, LANG_ID)` +
    ` VALUES ${wordsbookRows.map(() => "(?,?,?)").join(",")}`;
  const wordsRows = [
    [
      1,
      1,
      "貴方",
      "あなた ANATA 您（女性常用）",
      "夫妻、情侶之間 (Testing word, delete is not allow)",
    ],
    [2, 1, "心", "こころ kokoro 心", " - (Testing word, delete is not allow)"],
    [
      3,
      1,
      "君",
      "きみ kimi 你（同輩/晚輩）",
      " - (Testing word, delete is not allow)",
    ],
    [4, 1, "私", "わたくし 我", " - (Testing word, delete is not allow)"],
    [
      5,
      1,
      "卒業",
      "そつぎょう sotsugyou 畢業",
      " - (Testing word, delete is not allow)",
    ],
    [
      6,
      1,
      "手紙",
      "てがみ tegami 信",
      " - (Testing word, delete is not allow)",
    ],
    [
      7,
      1,
      "親類",
      "しんるい sinnrui 親戚",
      " - (Testing word, delete is not allow)",
    ],
    [
      8,
      1,
      "端書/葉書",
      "はがき hagaki 明信片",
      " - (Testing word, delete is not allow)",
    ],
    [
      9,
      1,
      "見逃し",
      "みのがし minogasi 看漏／錯過",
      " - (Testing word, delete is not allow)",
    ],
    [
      10,
      2,
      "Comrades!",
      "同志們！",
      "又可解戰友，伙伴 (Testing word, delete is not allow)",
    ],
    [11, 3, "あ/ア", "a", "(Testing word, delete is not allow)"],
    [12, 3, "い/イ", "i", "(Testing word, delete is not allow)"],
    [13, 3, "う/ウ", "u", "(Testing word, delete is not allow)"],
    [14, 3, "え/エ", "e", "(Testing word, delete is not allow)"],
    [15, 3, "お/オ", "o", "(Testing word, delete is not allow)"],
    [16, 3, "か/カ", "ka", "(Testing word, delete is not allow)"],
    [17, 3, "け/キ", "ki", "(Testing word, delete is not allow)"],
    [18, 3, "く/ク", "ku", "(Testing word, delete is not allow)"],
    [19, 3, "け/キ", "ke", "(Testing word, delete is not allow)"],
    [20, 3, "こ/コ", "ko", "(Testing word, delete is not allow)"],
    [21, 3, "さ/サ", "sa", "(Testing word, delete is not allow)"],
    [22, 3, "し/シ", "si", "(Testing word, delete is not allow)"],
    [23, 3, "す/ス", "su", "(Testing word, delete is not allow)"],
    [24, 3, "せ/セ", "se", "(Testing word, delete is not allow)"],
    [25, 3, "そ/ソ", "so", "(Testing word, delete is not allow)"],
    [26, 3, "た/タ", "ta", "(Testing word, delete is not allow)"],
    [27, 3, "ち/テ", "chi", "(Testing word, delete is not allow)"],
    [28, 3, "つ/ツ", "tsu", "(Testing word, delete is not allow)"],
    [29, 3, "て/テ", "te", "(Testing word, delete is not allow)"],
    [30, 3, "と/ト", "to", "(Testing word, delete is not allow)"],
    [31, 3, "な/ナ", "na", "(Testing word, delete is not allow)"],
    [32, 3, "に/ニ", "ni", "(Testing word, delete is not allow)"],
    [33, 3, "ぬ/ヌ", "no", "(Testing word, delete is not allow)"],
    [34, 3, "ね/ネ", "ne", "(Testing word, delete is not allow)"],
    [35, 3, "の/ノ", "no", "(Testing word, delete is not allow)"],
    [36, 3, "は/ハ", "ha", "(Testing word, delete is not allow)"],
    [37, 3, "ひ/ヒ", "hi", "(Testing word, delete is not allow)"],
    [38, 3, "ふ/フ", "fu", "(Testing word, delete is not allow)"],
    [39, 3, "へ/ヘ", "he", "(Testing word, delete is not allow)"],
    [40, 3, "ほ/ホ", "ho", "(Testing word, delete is not allow)"],
    [41, 3, "ま/マ", "ma", "(Testing word, delete is not allow)"],
    [42, 3, "み/ミ", "mi", "(Testing word, delete is not allow)"],
    [43, 3, "む/ム", "mu", "(Testing word, delete is not allow)"],
    [44, 3, "め/メ", "me", "(Testing word, delete is not allow)"],
    [45, 3, "も/モ", "mo", "(Testing word, delete is not allow)"],
    [46, 3, "や/ヤ", "ya", "(Testing word, delete is not allow)"],
    [47, 3, "ゆ/ユ", "yu", "(Testing word, delete is not allow)"],
    [48, 3, "よ/ヨ", "yo", "(Testing word, delete is not allow)"],
    [49, 3, "ら/ラ", "ra", "(Testing word, delete is not allow)"],
    [50, 3, "り/リ", "ri", "(Testing word, delete is not allow)"],
    [51, 3, "る/ル", "ru", "(Testing word, delete is not allow)"],
    [52, 3, "れ/レ", "re", "(Testing word, delete is not allow)"],
    [53, 3, "ろ/ロ", "ro", "(Testing word, delete is not allow)"],
    [54, 3, "わ/ワ", "wa", "(Testing word, delete is not allow)"],
    [55, 3, "を/ヲ", "wo", "(Testing word, delete is not allow)"],
    [56, 3, "ん/ン", "nn", "(Testing word, delete is not allow)"],
    [57, 3, "きゃ/キャ", "kya", "(Testing word, delete is not allow)"],
    [58, 3, "きゅ/キュ", "kyu", "(Testing word, delete is not allow)"],
    [59, 3, "きょ/キョ", "kyo", "(Testing word, delete is not allow)"],
    [60, 3, "しゃ/シャ", "sha", "(Testing word, delete is not allow)"],
    [61, 3, "しゅ/シュ", "shu", "(Testing word, delete is not allow)"],
    [62, 3, "しょ/ショ", "sho", "(Testing word, delete is not allow)"],
    [63, 3, "ちゃ/チャ", "cha", "(Testing word, delete is not allow)"],
    [64, 3, "ちゅ/チュ", "chu", "(Testing word, delete is not allow)"],
    [65, 3, "ちょ/チョ", "cho", "(Testing word, delete is not allow)"],
    [66, 3, "にゃ/ニャ", "nya", "(Testing word, delete is not allow)"],
    [67, 3, "にゅ/ニュ", "nyu", "(Testing word, delete is not allow)"],
    [68, 3, "にょ/ニョ", "nyo", "(Testing word, delete is not allow)"],
    [69, 3, "ひゃ/ヒャ", "hya", "(Testing word, delete is not allow)"],
    [70, 3, "ひゅ/ヒュ", "hyu", "(Testing word, delete is not allow)"],
    [71, 3, "ひょ/ヒョ", "hyo", "(Testing word, delete is not allow)"],
    [72, 3, "みゃ/ミャ", "mya", "(Testing word, delete is not allow)"],
    [73, 3, "みゅ/ミュ", "myu", "(Testing word, delete is not allow)"],
    [74, 3, "みょ/ミョ", "myo", "(Testing word, delete is not allow)"],
    [75, 3, "りゃ/リャ", "rya", "(Testing word, delete is not allow)"],
    [76, 3, "りゅ/リュ", "ryu", "(Testing word, delete is not allow)"],
    [77, 3, "りょ/リョ", "ryo", "(Testing word, delete is not allow)"],
    [78, 3, "が/ガ", "ga", "(Testing word, delete is not allow)"],
    [79, 3, "ぎ/ギ", "gi", "(Testing word, delete is not allow)"],
    [80, 3, "ぐ/グ", "gu", "(Testing word, delete is not allow)"],
    [81, 3, "げ/ゲ", "ge", "(Testing word, delete is not allow)"],
    [82, 3, "ご/ゴ", "go", "(Testing word, delete is not allow)"],
    [83, 3, "ざ/ザ", "za", "(Testing word, delete is not allow)"],
    [84, 3, "じ/ジ", "ji", "(Testing word, delete is not allow)"],
    [85, 3, "ず/ズ", "zu", "(Testing word, delete is not allow)"],
    [86, 3, "ぜ/ゼ", "ze", "(Testing word, delete is not allow)"],
    [87, 3, "ぞ/ゾ", "zo", "(Testing word, delete is not allow)"],
    [88, 3, "だ/ダ", "da", "(Testing word, delete is not allow)"],
    [89, 3, "じ/ジ", "di", "(Testing word, delete is not allow)"],
    [90, 3, "ず/ズ", "du", "(Testing word, delete is not allow)"],
    [91, 3, "で/デ", "de", "(Testing word, delete is not allow)"],
    [92, 3, "ど/ド", "do", "(Testing word, delete is not allow)"],
    [93, 3, "ば/バ", "ba", "(Testing word, delete is not allow)"],
    [94, 3, "び/ビ", "be", "(Testing word, delete is not allow)"],
    [95, 3, "ぶ/ブ", "bu", "(Testing word, delete is not allow)"],
    [96, 3, "べ/ベ", "be", "(Testing word, delete is not allow)"],
    [97, 3, "ぼ/ボ", "bo", "(Testing word, delete is not allow)"],
    [98, 3, "ぱ/パ", "pa", "(Testing word, delete is not allow)"],
    [99, 3, "ぴ/ピ", "pi", "(Testing word, delete is not allow)"],
    [100, 3, "ぷ/プ", "pu", "(Testing word, delete is not allow)"],
    [101, 3, "ぺ/ペ", "pe", "(Testing word, delete is not allow)"],
    [102, 3, "ぽ/ポ", "po", "(Testing word, delete is not allow)"],
    [103, 3, "ぎゃ/ギャ", "gya", "(Testing word, delete is not allow)"],
    [104, 3, "ぎゅ/ギュ", "gyu", "(Testing word, delete is not allow)"],
    [105, 3, "ぎょ/ギョ", "gyo", "(Testing word, delete is not allow)"],
    [106, 3, "じゃ/ジャ", "ja", "(Testing word, delete is not allow)"],
    [107, 3, "じゅ/ジュ", "ju", "(Testing word, delete is not allow)"],
    [108, 3, "じょ/ジョ", "jo", "(Testing word, delete is not allow)"],
    [109, 3, "びゃ/ビャ", "bya", "(Testing word, delete is not allow)"],
    [110, 3, "びゅ/ビュ", "byu", "(Testing word, delete is not allow)"],
    [111, 3, "びょ/ビョ", "byo", "(Testing word, delete is not allow)"],
    [112, 3, "ぴゃ/ピャ", "pya", "(Testing word, delete is not allow)"],
    [113, 3, "ぴゅ/ピュ", "pyu", "(Testing word, delete is not allow)"],
    [114, 3, "ぴょ/ピョ", "pyo", "(Testing word, delete is not allow)"],
  ];
  const wordsInsert =
    `INSERT OR REPLACE INTO WORDS (ID, WORDSBOOK_ID, WORDS_TEXT, WORDS_TEXT_TRANSLATED, DES)` +
    ` VALUES ${wordsRows.map(() => "(?,?,?,?,?)").join(",")}`;
  try {
    await db.executeSql(WordsCreate, []);
    await db.executeSql(WordsBooksCreate, []);
    await db.executeSql(LangCreate, []);
    await db.executeSql(ScoreboardCreate, []);
    await db.executeSql(langInsert, langRows.flat());
    await db.executeSql(wordsbookInsert, wordsbookRows.flat());
    await db.executeSql(wordsInsert, wordsRows.flat());
    console.log("all done");
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};
// const db = await connectToDatabase();
//getBookList(db)<any[]>, bookListQuery
export const getBookList = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const bookList: any[] = [];
    const results = await db.executeSql(db_command.bookListQuery);
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        bookList.push(result.rows.item(index));
      }
    });
    return bookList;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//getBookDetails(db, bookId)<any>, bookQuery
export const getBookDetails = async (
  db: SQLiteDatabase,
  bookId: number,
): Promise<any> => {
  try {
    const wordList: any[] = [];
    const results = await db.executeSql(db_command.bookQuery(bookId));
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        wordList.push(result.rows.item(index));
      }
    });
    return wordList[0];
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//getLangList(db)<any[]>, langListQuery
export const getLangList = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const langList: any[] = [];
    const results = await db.executeSql(db_command.langListQuery);
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        langList.push(result.rows.item(index));
      }
    });
    return langList;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//updateBooks(db, id, name, lang), wordsBookUpdate
export const updateBooks = async (
  db: SQLiteDatabase,
  id: number,
  name: string,
  lang: number,
): Promise<any[]> => {
  try {
    const results = await db.executeSql(
      db_command.wordsBookUpdate(id, name, lang),
    );
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//createBook(db, name, lang), bookListCreate
export const createBook = async (
  db: SQLiteDatabase,
  name: string,
  lang: number,
): Promise<any[]> => {
  try {
    const results = await db.executeSql(db_command.bookListCreate(name, lang));
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//deleteBookList(db, itemId), bookListDelete
export const deleteBookList = async (
  db: SQLiteDatabase,
  itemId: number,
): Promise<any> => {
  try {
    const results = await db.executeSql(db_command.bookListDelete(itemId));
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//getBookWords(db, id)<any[]>, wordsListQuery
export const getBookWords = async (
  db: SQLiteDatabase,
  bookId: number,
): Promise<any> => {
  try {
    const wordList: any[] = [];
    const results = await db.executeSql(db_command.wordsListQuery(bookId));
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        wordList.push(result.rows.item(index));
      }
    });
    return wordList;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//createWords(db, book_id, text, text_trans, des), wordsListInsert
export const createWords = async (
  db: SQLiteDatabase,
  book_id: number,
  text: string,
  text_trans: string,
  des: string,
): Promise<any> => {
  try {
    const results = await db.executeSql(
      db_command.wordsListInsert(book_id, text, text_trans, des),
    );
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//updateWords(db, word_id, text, text_trans, des), wordsListUpdate
export const updateWords = async (
  db: SQLiteDatabase,
  word_id: number,
  text: string,
  text_trans: string,
  des: string,
): Promise<any> => {
  try {
    const results = await db.executeSql(
      db_command.wordsListUpdate(word_id, text, text_trans, des),
    );
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
//deleteWords(db, word_id), wordsListDelete
export const deleteWords = async (
  db: SQLiteDatabase,
  word_id: number,
): Promise<any> => {
  try {
    const results = await db.executeSql(db_command.wordsListDelete(word_id));
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get table names from database");
  }
};
