import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgBase, padding: 24, paddingTop: 80 },
  title: { fontSize: 22, fontWeight: "bold", color: colors.error, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: colors.textDark, marginTop: 12, marginBottom: 4 },
  scroll: { flex: 1, backgroundColor: colors.bgSubtle, borderRadius: 8, padding: 12 },
  code: { fontSize: 12, color: colors.textDark, fontFamily: "monospace" },
  btn: { marginTop: 16, backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: "center" as const },
  btnText: { color: colors.textOnPrimary, fontWeight: "bold", fontSize: 16 },
});
