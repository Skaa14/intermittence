import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

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
    color: colors.textMuted,
    textAlign: "center",
  },
  pageContent: {
    padding: 20,
    backgroundColor: colors.bgBase,
  },
  titreMois: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 20,
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
    fontWeight: "600",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  vide: {
    fontSize: 14,
    color: colors.textFaint,
    fontStyle: "italic",
  },
  contratItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgSubtle,
  },
  employeur: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textDark,
    marginBottom: 4,
  },
  contratDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailVal: {
    fontSize: 14,
    color: colors.textMedium,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  libelleValeur: {
    fontSize: 14,
    color: colors.textMuted,
  },
  valeur: {
    fontSize: 14,
    color: colors.textDark,
  },
  bold: {
    fontWeight: "600",
    color: colors.textDark,
  },
  boldValeur: {
    fontWeight: "600",
    color: colors.primary,
  },
});

export const pageScrollStyle = (width: number) =>
  StyleSheet.create({ page: { width } });
