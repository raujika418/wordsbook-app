export type RootStackParamList = {
  Home: undefined;
  Words: undefined;
  Training: undefined;
  CreateBook: undefined;
  About: undefined;
  EditWords: { bookID: number };
  TrainingMain: { bookID: number };
  // test :  { count: number }
};