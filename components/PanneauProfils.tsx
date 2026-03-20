import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  BackHandler,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfils } from "../contexts/ProfilsContext";
import { ProfilIntermittent } from "../types/profil";
import FormulaireProfil from "./FormulaireProfil";
import { colors } from "../theme/colors";
import {
  styles,
  PANEL_WIDTH,
  ANIMATION_DURATION,
} from "../styles/components/panneau-profils.styles";

interface PanneauProfilsProps {
  visible: boolean;
  onFermer: () => void;
}

export default function PanneauProfils({ visible, onFermer }: PanneauProfilsProps) {
  const { profils, profilActifId, changerProfilActif, ajouterProfil } = useProfils();
  const [modeFormulaire, setModeFormulaire] = useState(false);
  const [estMonte, setEstMonte] = useState(false);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const panelWidth = Math.min(PANEL_WIDTH, screenWidth * 0.75);
  const slideAnim = useRef(new Animated.Value(panelWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setEstMonte(true);
      setModeFormulaire(false);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (estMonte) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: panelWidth,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setEstMonte(false));
    }
  }, [visible, panelWidth, slideAnim, overlayAnim, estMonte]);

  useEffect(() => {
    if (!visible) return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      onFermer();
      return true;
    });

    return () => handler.remove();
  }, [visible, onFermer]);

  const handleSelectionProfil = (id: string) => {
    changerProfilActif(id);
    onFermer();
  };

  const handleValiderCreation = (profil: Omit<ProfilIntermittent, "id">) => {
    const id = ajouterProfil(profil);
    changerProfilActif(id);
    onFermer();
  };

  if (!estMonte && !visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} testID="panneau-profils">
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <Pressable
          testID="panneau-overlay"
          style={StyleSheet.absoluteFillObject}
          onPress={onFermer}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { width: panelWidth, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View
          style={[
            styles.panelContent,
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
          ]}
        >
          {modeFormulaire ? (
            <ScrollView
              style={styles.formulaireScroll}
              keyboardShouldPersistTaps="handled"
            >
              <FormulaireProfil
                onValider={handleValiderCreation}
                onAnnuler={() => setModeFormulaire(false)}
              />
            </ScrollView>
          ) : (
            <>
              <Text style={styles.titre}>Mes profils</Text>

              <ScrollView>
                {profils.map((profil) => {
                  const estActif = profil.id === profilActifId;
                  return (
                    <Pressable
                      key={profil.id}
                      testID={`profil-item-${profil.id}`}
                      style={[
                        styles.profilItem,
                        estActif && styles.profilItemActif,
                      ]}
                      onPress={() => handleSelectionProfil(profil.id)}
                    >
                      <View
                        style={[
                          styles.profilInitiale,
                          estActif && styles.profilInitialeActif,
                        ]}
                      >
                        <Text
                          style={[
                            styles.profilInitialeTexte,
                            estActif && styles.profilInitialeTexteActif,
                          ]}
                        >
                          {profil.nom.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.profilInfo}>
                        <Text style={styles.profilNom}>{profil.nom}</Text>
                        <Text style={styles.profilAnnexe}>
                          Annexe {profil.annexe}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Pressable
                testID="btn-ajouter-profil"
                style={styles.btnAjouter}
                onPress={() => setModeFormulaire(true)}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
                <Text style={styles.btnAjouterTexte}>Ajouter un profil</Text>
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
