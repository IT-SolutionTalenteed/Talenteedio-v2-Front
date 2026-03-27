<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes offres favorites</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <div v-if="loading" class="d-flex justify-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else-if="offres.length > 0">
      <v-row>
        <v-col
          v-for="offre in offres"
          :key="offre.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card rounded="lg" border elevation="0" height="100%">
            <v-card-title class="text-body-1 font-weight-bold">{{ offre.titre }}</v-card-title>
            <v-card-text class="pb-0">
              <div v-if="offre.entreprise" class="d-flex align-center mb-1 text-body-2">
                <v-icon size="16" class="mr-1" color="grey">mdi-domain</v-icon>
                {{ offre.entreprise.nom }}
              </div>
              <div v-if="offre.localisation" class="d-flex align-center mb-1 text-body-2">
                <v-icon size="16" class="mr-1" color="grey">mdi-map-marker-outline</v-icon>
                {{ offre.localisation }}
              </div>
              <div v-if="offre.fourchette_salariale" class="d-flex align-center text-body-2">
                <v-icon size="16" class="mr-1" color="grey">mdi-currency-eur</v-icon>
                {{ offre.fourchette_salariale }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="error"
                variant="text"
                size="small"
                prepend-icon="mdi-star-off-outline"
                @click="retirer(offre)"
              >Retirer des favoris</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <div v-else class="text-center py-10 text-medium-emphasis">
      <v-icon size="48" class="mb-3" color="grey-lighten-1">mdi-star-off-outline</v-icon>
      <div>Aucune offre en favori.</div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/talent/offreService.js'

const offres = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const load = async () => {
  loading.value = true
  try { const res = await offreService.getFavoris(); offres.value = res.data }
  catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const retirer = async (offre) => {
  try {
    await offreService.toggleFavori(offre.id)
    offres.value = offres.value.filter(o => o.id !== offre.id)
    success.value = 'Retiré des favoris'
    showSnack('Retiré des favoris')
  } catch { error.value = 'Erreur'; showSnack('Erreur', 'error') }
}

onMounted(load)
</script>
