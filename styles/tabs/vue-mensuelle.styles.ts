import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.bgBase,
  },
  empty: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: "center",
  },
  liste: {
    padding: 16,
    backgroundColor: colors.bgBase,
    gap: 12,
  },
  carte: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  carteTitre: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: 12,
  },
  carteBody: {
    gap: 6,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  libelleValeur: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  valeur: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textDark,
  },
});
