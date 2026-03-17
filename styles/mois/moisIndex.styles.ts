import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const backIconColor = colors.textOnPrimary;

export const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 8,
  },
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
  pageContent: {
    padding: 20,
    backgroundColor: colors.bgBase,
  },
  titreMois: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.textDark,
    marginBottom: 20,
  },
  section: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  titreSection: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  vide: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontStyle: "italic",
  },
  contratItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgSubtle,
  },
  employeur: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textDark,
    marginBottom: 4,
  },
  contratDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailVal: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMedium,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
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
  bold: {
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  boldValeur: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  separateur: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginVertical: 8,
  },
  ligneFormule: {
    paddingVertical: 4,
    alignItems: "flex-end",
  },
  texteFormule: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  texteFormuleNet: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.successText,
    fontStyle: "italic",
  },
  texteFormulePlafond: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.warning,
    fontStyle: "italic",
  },
});

export const pageScrollStyle = (width: number, height: number) =>
  StyleSheet.create({ page: { width, height } });
