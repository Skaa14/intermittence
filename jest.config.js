const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  setupFiles: expoPreset.setupFiles?.filter(
    (f) => !f.replace(/\\/g, "/").includes("jest-expo/src/preset/setup")
  ),
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@cucumber|jest-cucumber|uuid))",
  ],
};
