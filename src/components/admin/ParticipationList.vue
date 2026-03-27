<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Demandes de participation</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Filtres -->
    <v-row dense class="mb-4">
      <v-col cols="12" sm="5">
        <v-select
          v-model="filtreEvenementId"
          :items="evenements"
          item-title="titre"
          item-value="id"
          label="Filtrer par événement"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="load"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filtreStatut"
          :items="statutOptions"
          item-title="label"
          item-value="value"
          label="Statut"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="load"
        />
      </v-col>
    </v-row>

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

      <template #item.message="{ item }">
        <span v-if="item.message" class="text-truncate d-inline-block" style="max-width:200px;" :title="item.message">
          {{ item.message }}
        </span>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.created_at="{ item }">
        {{ item.created_at?.substring(0, 10) }}
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucune demande de participation.</div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="d-flex justify-center mt-4">
      <v-pagination
        v-model="pagination.current_page"
        :length="pagination.last_page"
        @update:model-value="load"
      />
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import participationService from '../../services/admin/participationService.js'
import api from '../../services/api.js'

const items = ref([])
const evenements = ref([])
const filtreEvenementId = ref(null)
const filtreStatut = ref(null)
const loading = ref(false)
const pagination = ref({ current_page: 1, last_page: 1 })
const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Entreprise', key: 'entreprise.nom' },
  { title: 'Événement', key: 'evenement.titre' },
  { title: 'Statut', key: 'statut', sortable: false },
  { title: 'Message', key: 'message', sortable: false },
  { title: 'Date', key: 'created_at' },
]

const statutOptions = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'Acceptée', value: 'acceptee' },
  { label: 'Refusée', value: 'refusee' },
]

const load = async () => {
  loading.value = true
  try {
    const params = { page: pagination.value.current_page }
    if (filtreEvenementId.value) params.evenement_id = filtreEvenementId.value
    if (filtreStatut.value) params.statut = filtreStatut.value
    const res = await participationService.getAll(params)
    items.value = res.data.data ?? res.data
    if (res.data.last_page) pagination.value.last_page = res.data.last_page
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const updateStatut = async (item) => {
  try {
    await participationService.updateStatut(item.id, item.statut)
    showSnack('Statut mis à jour')
  } catch {
    showSnack('Erreur mise à jour statut', 'error')
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/admin/evenements')
    evenements.value = res.data.data ?? res.data
  } catch {}
  load()
})
</script>
