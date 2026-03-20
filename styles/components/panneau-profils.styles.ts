import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export const PANEL_WIDTH = 300;
export const ANIMATION_DURATION = 300;

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 100,
  },
  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.bgBase,
    zIndex: 101,
    shadowColor: colors.shadow,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titre: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textDark,
    marginBottom: 16,
    marginTop: 16,
  },
  profilItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  profilItemActif: {
    backgroundColor: colors.successBg,
  },
  profilInitiale: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profilInitialeActif: {
    backgroundColor: colors.primary,
  },
  profilInitialeTexte: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
  profilInitialeTexteActif: {
    color: colors.textOnPrimary,
  },
  profilInfo: {
    flex: 1,
  },
  profilNom: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  profilAnnexe: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  btnAjouter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    marginTop: 10,
  },
  btnAjouterTexte: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  formulaireScroll: {
    flex: 1,
  },
});
