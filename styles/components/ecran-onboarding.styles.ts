import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
    padding: 20,
  },
  titre: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
});
