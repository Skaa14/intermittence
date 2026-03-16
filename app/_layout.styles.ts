import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    backgroundColor: colors.warning,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 48,
  },
  bannerText: {
    color: colors.warningDark,
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  bannerBtn: {
    backgroundColor: colors.warningDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bannerBtnText: {
    color: colors.warningLight,
    fontWeight: "bold",
    fontSize: 12,
  },
});
