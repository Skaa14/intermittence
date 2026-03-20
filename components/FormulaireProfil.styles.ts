import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { webDateInputBase } from "../theme/webStyles";

export const webDateInputStyle: React.CSSProperties = {
  ...webDateInputBase,
};

export const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: fonts.regular,
    backgroundColor: colors.bgBase,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  annexeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  annexeBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  annexeBtnText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  annexeBtnTextActive: {
    color: colors.bgCard,
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.bgCard,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textDark,
  },
  demoRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  demoHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
  },
  demoBtns: {
    flexDirection: "row",
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  demoBtnLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
  demoBtnSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  btnValider: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnValiderFull: {
    width: "100%",
  },
  btnValiderDisabled: {
    opacity: 0.5,
  },
  btnValiderText: {
    fontFamily: fonts.bold,
    color: colors.bgCard,
    fontSize: 16,
  },
  btnAnnuler: {
    flex: 1,
    backgroundColor: colors.borderLight,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAnnulerText: {
    fontFamily: fonts.medium,
    color: colors.textMuted,
    fontSize: 16,
  },
});
