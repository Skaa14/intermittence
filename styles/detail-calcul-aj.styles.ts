import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: 20,
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
  etape: {
    marginBottom: 14,
  },
  etapeLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: 2,
  },
  etapeFormule: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontStyle: "italic",
    marginBottom: 2,
  },
  etapeValeur: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  separateur: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginVertical: 10,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  ligneFormule: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontStyle: "italic",
    marginBottom: 4,
  },
  cotisation: {
    marginBottom: 10,
  },
  cotisationLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  cotisationFormule: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textFaint,
    fontStyle: "italic",
  },
  cotisationMontant: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.error,
  },
  resultatSection: {
    backgroundColor: colors.bgDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultatLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  resultatRow: {
    flexDirection: "row",
  },
  resultatCol: {
    flex: 1,
  },
  resultatColLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  resultatBrut: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
  },
  resultatNet: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.bgCard,
  },
  exoneration: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.successText,
    fontStyle: "italic",
    marginTop: 8,
  },
  plafonnement: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.warning,
    fontStyle: "italic",
  },
  resultatFinal: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  resultatFinalLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginBottom: 4,
  },
  resultatFinalMontant: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.bgCard,
  },
  resultatFinalSous: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginTop: 4,
  },
});
