import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.bgBase,
  },
  banner: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerText: {
    color: colors.textDark,
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  bannerBtn: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bannerBtnText: {
    color: colors.bgCard,
    fontWeight: "bold",
    fontSize: 12,
  },
});
