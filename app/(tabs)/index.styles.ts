import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { webDateInputBase } from "../../theme/webStyles";

export const webDateInputStyle: React.CSSProperties = {
  ...webDateInputBase,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.bgBase,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 24,
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
    color: colors.textMuted,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textDark,
  },
  cardHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
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
    color: colors.primaryLight,
    marginBottom: 4,
  },
  ajValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.bgCard,
  },
  ajDetail: {
    fontSize: 13,
    color: colors.primaryLight,
    marginTop: 8,
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
    color: colors.textMuted,
  },
  label: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: "600",
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
    color: colors.textMuted,
    fontWeight: "600",
  },
  annexeBtnTextActive: {
    color: colors.bgCard,
  },
  dateText: {
    fontSize: 16,
    color: colors.textDark,
  },
  datePlaceholder: {
    fontSize: 16,
    color: colors.textFaint,
  },
  btnValider: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnValiderText: {
    color: colors.bgCard,
    fontWeight: "bold",
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
    color: colors.textMuted,
    fontWeight: "bold",
    fontSize: 16,
  },
  demoHint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
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
    fontWeight: "700",
    color: colors.textDark,
  },
  demoBtnSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
