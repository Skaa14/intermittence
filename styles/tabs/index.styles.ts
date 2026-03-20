import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
  cardHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 8,
  },
  cardPeriode: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textFaint,
    marginTop: 4,
  },
  barreContainer: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  barre: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  ajCard: {
    backgroundColor: colors.bgDark,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  ajLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginBottom: 8,
  },
  ajRow: {
    flexDirection: "row",
  },
  ajCol: {
    flex: 1,
  },
  ajColLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  ajValue: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
  },
  ajNetteValue: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.bgCard,
  },
  ajDetail: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primaryLight,
    marginTop: 8,
  },
  btnDetailCalcul: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: "center",
  },
  btnDetailCalculText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primaryLight,
  },
  configurerBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    borderStyle: "dashed",
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  configurerBtnText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  simulationSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  simulationTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: 8,
  },
  simulationHint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textFaint,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgBase,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.bgCard,
    fontFamily: fonts.semiBold,
  },
  simulationResultats: {
    backgroundColor: colors.successBg,
    borderRadius: 10,
    padding: 16,
  },
  simulationPeriode: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.successText,
    marginBottom: 12,
  },
  simulationAjRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  simulationAjCol: {
    flex: 1,
  },
  simulationAjLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.successText,
    marginBottom: 2,
  },
  simulationAjValue: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.successText,
  },
  simulationDetail: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.successText,
  },
  simulationProfilHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 12,
    fontStyle: "italic",
  },
});
