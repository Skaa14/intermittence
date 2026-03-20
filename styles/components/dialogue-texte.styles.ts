import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  container: {
    backgroundColor: colors.bgBase,
    borderRadius: 14,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  titre: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textDark,
    marginBottom: 20,
  },
  boutons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  btnAnnuler: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnAnnulerTexte: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  btnValider: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnValiderDisabled: {
    opacity: 0.5,
  },
  btnValiderTexte: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textOnPrimary,
  },
});
