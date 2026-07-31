import { View, Text, FlatList } from "react-native";
import { useMemo } from "react";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfils } from "../../contexts/ProfilsContext";
import { useFormations } from "../../contexts/FormationsContext";
import { useEnseignements } from "../../contexts/EnseignementsContext";
import { calculerRecapAnnuel, RecapMois } from "../../utils/calculerRecapAnnuel";
import { formatMois } from "../../utils/formatMois";
import { styles } from "../../styles/tabs/vue-mensuelle.styles";

function CarteRecapMois({ recap }: { recap: RecapMois }) {
  return (
    <View testID={`carte-recap-${recap.index}`} style={styles.carte}>
      <Text style={styles.carteTitre}>
        {formatMois(recap.mois)}
        {recap.enCours ? " (en cours)" : ""}
      </Text>
      <View style={styles.carteBody}>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Heures travaillées</Text>
          <Text style={styles.valeur}>{recap.heures} h</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Salaire brut</Text>
          <Text style={styles.valeur}>{recap.salaire} €</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Contrats</Text>
          <Text style={styles.valeur}>{recap.nombreContrats}</Text>
        </View>
      </View>
    </View>
  );
}

export default function VueMensuelleScreen() {
  const { contrats } = useContrats();
  const { profilActif: profil } = useProfils();
  const { formations } = useFormations();
  const { enseignements } = useEnseignements();

  const recap = useMemo(
    () => (profil?.aOuvertDroits ? calculerRecapAnnuel(profil, contrats, formations, enseignements) : []),
    [profil, contrats, formations, enseignements]
  );

  if (!profil || !profil.aOuvertDroits) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty} testID="message-profil-manquant">
          {!profil
            ? "Configurez votre profil pour voir le récap"
            : "Ouvrez vos droits ARE pour voir le récap"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recap}
      keyExtractor={(item) => String(item.index)}
      contentContainerStyle={styles.liste}
      renderItem={({ item }) => <CarteRecapMois recap={item} />}
      ListEmptyComponent={
        <View style={styles.container}>
          <Text style={styles.empty} testID="message-recap-vide">
            Aucun mois à afficher pour l'instant
          </Text>
        </View>
      }
    />
  );
}
