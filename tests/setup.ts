import AsyncStorage from "@react-native-async-storage/async-storage";

beforeEach(async () => {
  await AsyncStorage.clear();
});
