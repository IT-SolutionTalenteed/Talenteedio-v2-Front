<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Candidatures reçues</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Filtre par offre -->
    <v-select
      v-model="filtreOffreId"
      :items="offres"
      item-title="titre"
      item-value="id"
      label="Filtrer par offre"
      placeholder="Toutes les offres"
      variant="outlined"
      density="comfortable"
      clearable
      class="mb-4"
      style="max-width:360px;"
      @update:model-value="load"
    />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.statut="{ item }">
        <v-select
          v-model="item.statut"
          :items="statutOptions"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width:140px;"
          @update:model-value="updateStatut(item)"
        />
      </template>

      <template #item.cv_url="{ item }">
        <v-btn
          v-if="item.cv_url"
          :href="item.cv_url"
          target="_blank"
          size="small"
          variant="text"
          icon="mdi-file-pdf-box"
          color="error"
        />
        <span v-else>-</span>
      </template>

      <template #item.created_at="{ item }">
        {{ item.created_at?.substring(0, 10) }}
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucune candidature.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import candidatureService from '../../services/entreprise/candidatureService.js'
import offreService from '../../services/entreprise/offreService.js'

const items = ref([])
const offres = ref([])
const filtreOffreId = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Talent', key: 'talent.name' },
  { title: 'Offre', key: 'offre.titre' },
  { title: 'Statut', key: 'statut', sortable: false },
  { title: 'CV', key: 'cv_url', sortable: false },
  { title: 'Message', key: 'message' },
  { title: 'Date', key: 'created_at' },
]

const statutOptions = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'Acceptée', value: 'acceptee' },
  { label: 'Refusée', value: 'refusee' },
]

const load = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await candidatureService.getAll(filtreOffreId.value || null)
    items.value = res.data
  } catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const updateStatut = async (item) => {
  error.value = ''; success.value = ''
  try {
    await candidatureService.updateStatut(item.id, item.statut)
    success.value = 'Statut mis à jour'
    showSnack('Statut mis à jour')
  } catch { error.value = 'Erreur mise à jour'; showSnack('Erreur mise à jour', 'error'); await load() }
}

onMounted(async () => {
  const res = await offreService.getAll()
  offres.value = res.data
  await load()
})
</script>
