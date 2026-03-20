import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfils } from "../contexts/ProfilsContext";
import { colors } from "../theme/colors";
import { styles } from "../styles/components/bouton-profil.styles";

interface BoutonProfilProps {
  onPress: () => void;
}

export default function BoutonProfil({ onPress }: BoutonProfilProps) {
  const { profilActif } = useProfils();

  return (
    <Pressable testID="btn-profil" style={styles.bouton} onPress={onPress}>
      {profilActif?.nom ? (
        <Text style={styles.initiale}>
          {profilActif.nom.charAt(0).toUpperCase()}
        </Text>
      ) : (
        <Ionicons name="person-circle-outline" size={24} color={colors.textOnPrimary} />
      )}
    </Pressable>
  );
}
