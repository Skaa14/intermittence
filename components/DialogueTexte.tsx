import { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { styles } from "../styles/components/dialogue-texte.styles";

interface DialogueTexteProps {
  visible: boolean;
  titre: string;
  valeurInitiale: string;
  placeholder?: string;
  labelValider?: string;
  onValider: (valeur: string) => void;
  onAnnuler: () => void;
}

export default function DialogueTexte({
  visible,
  titre,
  valeurInitiale,
  placeholder,
  labelValider = "Valider",
  onValider,
  onAnnuler,
}: DialogueTexteProps) {
  const [valeur, setValeur] = useState(valeurInitiale);

  useEffect(() => {
    if (visible) setValeur(valeurInitiale);
  }, [visible, valeurInitiale]);

  const valide = valeur.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onAnnuler}
    >
      <Pressable style={styles.overlay} onPress={onAnnuler}>
        <Pressable style={styles.container} onPress={() => {}}>
          <Text style={styles.titre}>{titre}</Text>
          <TextInput
            testID="dialogue-texte-input"
            style={styles.input}
            value={valeur}
            onChangeText={setValeur}
            placeholder={placeholder}
            autoFocus
            selectTextOnFocus
          />
          <View style={styles.boutons}>
            <Pressable style={styles.btnAnnuler} onPress={onAnnuler}>
              <Text style={styles.btnAnnulerTexte}>Annuler</Text>
            </Pressable>
            <Pressable
              testID="dialogue-texte-valider"
              style={[styles.btnValider, !valide && styles.btnValiderDisabled]}
              onPress={() => valide && onValider(valeur.trim())}
              disabled={!valide}
            >
              <Text style={styles.btnValiderTexte}>{labelValider}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
