import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  BackHandler,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfils } from "../contexts/ProfilsContext";
import { ProfilIntermittent } from "../types/profil";
import FormulaireProfil from "./FormulaireProfil";
import DialogueTexte from "./DialogueTexte";
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

type ModePanel = "liste" | "creation" | "edition";

interface MenuState {
  profilId: string;
  top: number;
}

interface DialogueState {
  type: "renommer" | "dupliquer";
  profilId: string;
  valeurInitiale: string;
}

export default function PanneauProfils({ visible, onFermer }: PanneauProfilsProps) {
  const { profils, profilActifId, changerProfilActif, ajouterProfil, modifierProfil, supprimerProfil, dupliquerProfil } = useProfils();
  const [mode, setMode] = useState<ModePanel>("liste");
  const [profilEdite, setProfilEdite] = useState<ProfilIntermittent | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [estMonte, setEstMonte] = useState(false);
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const panelWidth = Math.min(PANEL_WIDTH, screenWidth * 0.75);
  const slideAnim = useRef(new Animated.Value(panelWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const itemLayouts = useRef<Record<string, { y: number; height: number }>>({});

  useEffect(() => {
    if (visible) {
      setEstMonte(true);
      setMode("liste");
      setProfilEdite(null);
      setMenu(null);
      setDialogue(null);
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

  const handleValiderEdition = (donnees: Omit<ProfilIntermittent, "id">) => {
    if (!profilEdite) return;
    modifierProfil(profilEdite.id, donnees);
    setMode("liste");
    setProfilEdite(null);
  };

  const handleOuvrirMenu = useCallback((profilId: string) => {
    const layout = itemLayouts.current[profilId];
    const top = layout ? layout.y + layout.height : 0;
    setMenu({ profilId, top });
  }, []);

  const handleFermerMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const handleModifier = useCallback(() => {
    if (!menu) return;
    const profil = profils.find((p) => p.id === menu.profilId);
    if (!profil) return;
    setMenu(null);
    setProfilEdite(profil);
    setMode("edition");
  }, [menu, profils]);

  const handleRenommer = useCallback(() => {
    if (!menu) return;
    const profil = profils.find((p) => p.id === menu.profilId);
    if (!profil) return;
    setMenu(null);
    setDialogue({ type: "renommer", profilId: profil.id, valeurInitiale: profil.nom });
  }, [menu, profils]);

  const handleDupliquer = useCallback(() => {
    if (!menu) return;
    const profil = profils.find((p) => p.id === menu.profilId);
    if (!profil) return;
    setMenu(null);
    setDialogue({ type: "dupliquer", profilId: profil.id, valeurInitiale: `${profil.nom} (copie)` });
  }, [menu, profils]);

  const handleSupprimer = useCallback(() => {
    if (!menu) return;
    const profilId = menu.profilId;
    const profil = profils.find((p) => p.id === profilId);
    if (!profil) return;
    setMenu(null);
    const message = `Supprimer "${profil.nom}" et toutes ses données ? Cette action est irréversible.`;
    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        supprimerProfil(profilId);
      }
    } else {
      Alert.alert("Supprimer le profil", message, [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => supprimerProfil(profilId) },
      ]);
    }
  }, [menu, profils, supprimerProfil]);

  const handleValiderDialogue = useCallback((valeur: string) => {
    if (!dialogue) return;
    if (dialogue.type === "renommer") {
      const profil = profils.find((p) => p.id === dialogue.profilId);
      if (profil) {
        const { id, ...donnees } = profil;
        modifierProfil(id, { ...donnees, nom: valeur });
      }
    } else {
      dupliquerProfil(dialogue.profilId, valeur);
    }
    setDialogue(null);
  }, [dialogue, profils, modifierProfil, dupliquerProfil]);

  const handleItemLayout = useCallback((profilId: string, event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    itemLayouts.current[profilId] = { y, height };
  }, []);

  if (!estMonte && !visible) return null;

  const renderFormulaire = (
    profilInitial: ProfilIntermittent | undefined,
    onValider: (profil: Omit<ProfilIntermittent, "id">) => void,
    onAnnuler: () => void,
  ) => (
    <ScrollView style={styles.formulaireScroll} keyboardShouldPersistTaps="handled">
      <FormulaireProfil
        profilInitial={profilInitial}
        onValider={onValider}
        onAnnuler={onAnnuler}
      />
    </ScrollView>
  );

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
          {mode === "creation" &&
            renderFormulaire(undefined, handleValiderCreation, () => setMode("liste"))}

          {mode === "edition" &&
            renderFormulaire(profilEdite ?? undefined, handleValiderEdition, () => {
              setMode("liste");
              setProfilEdite(null);
            })}

          {mode === "liste" && (
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
                      onLayout={(e) => handleItemLayout(profil.id, e)}
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
                      <Pressable
                        testID={`btn-menu-${profil.id}`}
                        style={styles.btnMenu}
                        onPress={() => handleOuvrirMenu(profil.id)}
                        hitSlop={8}
                      >
                        <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Pressable
                testID="btn-ajouter-profil"
                style={styles.btnAjouter}
                onPress={() => setMode("creation")}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
                <Text style={styles.btnAjouterTexte}>Ajouter un profil</Text>
              </Pressable>

              {menu && (
                <>
                  <Pressable
                    testID="menu-overlay"
                    style={styles.menuOverlay}
                    onPress={handleFermerMenu}
                  />
                  <View
                    testID="menu-actions"
                    style={[styles.menu, { top: menu.top }]}
                  >
                    <Pressable testID="menu-modifier" style={styles.menuItem} onPress={handleModifier}>
                      <Ionicons name="create-outline" size={18} color={colors.textDark} />
                      <Text style={styles.menuItemTexte}>Modifier</Text>
                    </Pressable>
                    <Pressable testID="menu-renommer" style={styles.menuItem} onPress={handleRenommer}>
                      <Ionicons name="pencil-outline" size={18} color={colors.textDark} />
                      <Text style={styles.menuItemTexte}>Renommer</Text>
                    </Pressable>
                    <Pressable testID="menu-dupliquer" style={styles.menuItem} onPress={handleDupliquer}>
                      <Ionicons name="copy-outline" size={18} color={colors.textDark} />
                      <Text style={styles.menuItemTexte}>Dupliquer</Text>
                    </Pressable>
                    <Pressable testID="menu-supprimer" style={styles.menuItem} onPress={handleSupprimer}>
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                      <Text style={[styles.menuItemTexte, styles.menuItemDanger]}>Supprimer</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Animated.View>

      <DialogueTexte
        visible={dialogue !== null}
        titre={dialogue?.type === "renommer" ? "Renommer le profil" : "Dupliquer le profil"}
        valeurInitiale={dialogue?.valeurInitiale ?? ""}
        placeholder="Nom du profil"
        labelValider={dialogue?.type === "renommer" ? "Renommer" : "Dupliquer"}
        onValider={handleValiderDialogue}
        onAnnuler={() => setDialogue(null)}
      />
    </View>
  );
}
