import { Modal, Pressable, ScrollView } from "react-native";
import { ProfilSansId } from "../types/profil";
import { TypeDonneesTest } from "../utils/donneesTest";
import FormulaireProfil from "./FormulaireProfil";
import { styles } from "../styles/components/dialogue-creation-profil.styles";

interface DialogueCreationProfilProps {
  visible: boolean;
  onValider: (profil: ProfilSansId, donneesTest?: TypeDonneesTest) => void | Promise<void>;
  onAnnuler: () => void;
}

export default function DialogueCreationProfil({
  visible,
  onValider,
  onAnnuler,
}: DialogueCreationProfilProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onAnnuler}
    >
      <Pressable style={styles.overlay} onPress={onAnnuler}>
        <Pressable style={styles.container} onPress={() => {}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <FormulaireProfil
              onValider={onValider}
              onAnnuler={onAnnuler}
            />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
