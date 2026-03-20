import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  fraction: {
    alignItems: "center",
    marginHorizontal: 3,
    flexShrink: 1,
  },
  fractionNum: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  fractionBarre: {
    height: 1,
    width: "100%",
    marginVertical: 1,
  },
  fractionDen: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  colorDark: {
    color: colors.textDark,
  },
  colorMuted: {
    color: colors.textMuted,
  },
  bgDark: {
    backgroundColor: colors.textDark,
  },
  bgMuted: {
    backgroundColor: colors.textMuted,
  },
  italic: {
    fontStyle: "italic",
  },
  smallText: {
    fontSize: 11,
    paddingHorizontal: 2,
  },
});
