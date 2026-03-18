import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const addIconColor = colors.warning;
export const placeholderColor = colors.textFaint;
export const contratIconColor = colors.textMuted;
export const formationIconColor = colors.primary;
export const enseignementIconColor = colors.enseignement;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    gap: 8,
  },
  formulaire: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  formulaireContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formulaireActions: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.bgCard,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    backgroundColor: colors.bgCard,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  inputHalf: {
    flex: 1,
    minWidth: 0,
  },
  dateText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textDark,
  },
  datePlaceholder: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textFaint,
  },
  btnAjouter: {
    flex: 1,
    backgroundColor: colors.warning,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAjouterText: {
    fontFamily: fonts.bold,
    color: colors.bgCard,
    fontSize: 16,
  },
  btnAnnuler: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAnnulerText: {
    fontFamily: fonts.medium,
    color: colors.textMuted,
    fontSize: 14,
  },
  btnOuvrir: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  liste: {
    padding: 16,
  },
  vide: {
    textAlign: "center",
    fontFamily: fonts.regular,
    color: colors.textFaint,
    marginTop: 40,
    fontSize: 16,
  },
  contratCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  contratHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contratEmployeur: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
  supprimer: {
    fontSize: 18,
    color: colors.error,
    padding: 4,
  },
  contratDates: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  contratDetails: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  contratDetail: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  btnTogglePasses: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTogglePassesText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  contratCardPasse: {
    opacity: 0.6,
    borderLeftWidth: 3,
    borderLeftColor: colors.textFaint,
  },
  contratTitre: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  contratTextPasse: {
    color: colors.textFaint,
  },
  badgePasse: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePasseText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  contratDetailPasse: {
    color: colors.textFaint,
  },
  contratActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  modifier: {
    fontSize: 18,
    color: colors.primary,
    padding: 4,
  },
  inputErreur: {
    borderColor: colors.error,
  },
  erreurMois: {
    fontFamily: fonts.regular,
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: colors.bgBase,
  },
  toggleBtnActif: {
    backgroundColor: colors.primaryBg,
  },
  toggleBtnText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  toggleBtnTextActif: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  stepperRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "stretch",
  },
  stepperBtn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtnLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0,
  },
  stepperBtnRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0,
  },
  stepperBtnText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  inputStepper: {
    flex: 1,
    minWidth: 0,
    borderRadius: 0,
    textAlign: "center",
  },
  toggleTypeSaisie: {
    marginBottom: 16,
  },
  formationCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  badgeFormation: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeFormationText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  badgeFormationPasse: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeFormationPasseText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textFaint,
  },
  formationOption: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  optionHint: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  enseignementCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.enseignement,
  },
  badgeEnseignement: {
    backgroundColor: colors.enseignementBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEnseignementText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.enseignement,
  },
  badgeEnseignementPasse: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEnseignementPasseText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textFaint,
  },
});
