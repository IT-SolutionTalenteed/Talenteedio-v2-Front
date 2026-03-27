<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes candidatures</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.statut="{ item }">
        <v-chip
          size="small"
          :color="item.statut === 'acceptee' ? 'success' : item.statut === 'refusee' ? 'error' : 'warning'"
        >
          {{ item.statut === 'acceptee' ? 'Acceptée' : item.statut === 'refusee' ? 'Refusée' : 'En attente' }}
        </v-chip>
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
        <div class="text-center py-6 text-medium-emphasis">Vous n'avez pas encore postulé à une offre.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/talent/offreService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Offre', key: 'offre.titre' },
  { title: 'Entreprise', key: 'offre.entreprise.nom' },
  { title: 'Statut', key: 'statut' },
  { title: 'CV', key: 'cv_url', sortable: false },
  { title: 'Date', key: 'created_at' },
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await offreService.mesCandidatures()
    items.value = res.data
  } catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
})
</script>
