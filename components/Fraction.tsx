import { View, Text } from "react-native";
import { styles } from "./Fraction.styles";

type FractionVariant = "dark" | "muted";

export function Fraction({
  num,
  den,
  variant = "dark",
  small,
}: {
  num: string;
  den: string;
  variant?: FractionVariant;
  small?: boolean;
}) {
  const textColor = variant === "dark" ? styles.colorDark : styles.colorMuted;
  const barreColor = variant === "dark" ? styles.bgDark : styles.bgMuted;
  const italicStyle = variant === "muted" ? styles.italic : undefined;
  const sizeStyle = small ? styles.smallText : undefined;

  return (
    <View style={styles.fraction}>
      <Text style={[styles.fractionNum, textColor, italicStyle, sizeStyle]}>
        {num}
      </Text>
      <View style={[styles.fractionBarre, barreColor]} />
      <Text style={[styles.fractionDen, textColor, italicStyle, sizeStyle]}>
        {den}
      </Text>
    </View>
  );
}
