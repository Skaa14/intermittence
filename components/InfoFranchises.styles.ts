import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export const styles = StyleSheet.create({
  formuleLigne: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 3,
  },
  formuleText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textDark,
  },
  formuleResultat: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    maxWidth: 400,
    maxHeight: "80%",
    width: "100%",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMedium,
    lineHeight: 22,
    marginBottom: 12,
  },
  modalCalcul: {
    backgroundColor: colors.primaryBg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalCloseText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});
