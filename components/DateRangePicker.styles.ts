import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.bgCard,
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
  btnConfirmer: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnConfirmerText: {
    fontFamily: fonts.bold,
    color: colors.textOnPrimary,
    fontSize: 16,
  },
  btnDisabled: {
    backgroundColor: colors.borderLight,
  },
  btnDisabledText: {
    color: colors.textFaint,
  },
});
