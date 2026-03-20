import { View, Text, StyleSheet } from "react-native";
import { FormuleSegment } from "../utils/calculerAJDetaille";
import { Fraction } from "./Fraction";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

export function FormuleRendu({
  segments,
  small,
}: {
  segments: FormuleSegment[];
  small?: boolean;
}) {
  return (
    <View style={formuleStyles.row}>
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <Text key={i} style={formuleStyles.text}>
            {seg}
          </Text>
        ) : (
          <Fraction key={i} num={seg.num} den={seg.den} variant="muted" small={small} />
        )
      )}
    </View>
  );
}

const formuleStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontStyle: "italic",
  },
});
