import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const styles = StyleSheet.create({
  bouton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  initiale: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});
