import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { webDateInputBase } from "../../theme/webStyles";

export const addIconColor = colors.warning;
export const errorBorderColor = colors.error;

export const webDateInputStyle: React.CSSProperties = {
  ...webDateInputBase,
  flex: 1,
};

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
    padding: 16,
    backgroundColor: colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: colors.bgBase,
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
    color: colors.textDark,
  },
  datePlaceholder: {
    fontSize: 16,
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
    color: colors.bgCard,
    fontWeight: "bold",
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
    color: colors.textMuted,
    fontWeight: "500",
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
    fontWeight: "bold",
    color: colors.textDark,
  },
  supprimer: {
    fontSize: 18,
    color: colors.error,
    padding: 4,
  },
  contratDates: {
    fontSize: 14,
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
    color: colors.primary,
    fontWeight: "600",
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
    color: colors.textMuted,
    fontWeight: "500",
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
    color: colors.textMuted,
    fontWeight: "600",
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
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
  },
});
