import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { IndemnisationMensuelle } from "../../utils/calculerIndemnisationMensuelle";

export const BADGE_STYLES: Record<
  IndemnisationMensuelle["etat"],
  { bg: string; text: string; label: string }
> = {
  passé: { bg: colors.borderLight, text: colors.textMedium, label: "Passé" },
  "en cours": { bg: colors.primaryBg, text: colors.primaryDark, label: "En cours" },
  "à venir": { bg: colors.successBg, text: colors.successText, label: "À venir" },
};

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
  carteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  carteTitre: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  carteBody: {
    gap: 6,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ligneTotal: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
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
  libelleTotal: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
  },
  valeurTotal: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});
