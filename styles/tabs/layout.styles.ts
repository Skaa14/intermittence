import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    minHeight: 56,
    backgroundColor: colors.bgSubtle,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
});
