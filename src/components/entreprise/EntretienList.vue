<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Entretiens sur mon stand</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.heure="{ item }">
        {{ item.heure_debut }} – {{ item.heure_fin }}
      </template>

      <template #item.statut="{ item }">
        <v-chip
          size="small"
          :color="item.statut === 'confirme' ? 'success' : item.statut === 'refuse' ? 'error' : item.statut === 'annule' ? 'default' : 'warning'"
        >
          {{ item.statut === 'confirme' ? 'Confirmé' : item.statut === 'refuse' ? 'Refusé' : item.statut === 'annule' ? 'Annulé' : 'En attente' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <template v-if="item.statut === 'en_attente'">
          <v-btn
            size="small"
            color="success"
            variant="tonal"
            class="mr-1"
            @click="updateStatut(item, 'confirme')"
          >Confirmer</v-btn>
          <v-btn
            size="small"
            color="error"
            variant="tonal"
            @click="updateStatut(item, 'refuse')"
          >Refuser</v-btn>
        </template>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun entretien sur votre stand.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const items = ref([])
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
  { title: 'Événement', key: 'evenement.titre' },
  { title: 'Date', key: 'date' },
  { title: 'Heure', key: 'heure', sortable: false },
  { title: 'Statut', key: 'statut' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try { const res = await api.get('/entreprise/entretiens'); items.value = res.data }
  catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const updateStatut = async (item, statut) => {
  error.value = ''; success.value = ''
  try {
    const res = await api.patch(`/entreprise/entretiens/${item.id}/statut`, { statut })
    item.statut = res.data.statut
    success.value = statut === 'confirme' ? 'Entretien confirmé' : 'Entretien refusé'
    showSnack(success.value)
  } catch { error.value = 'Erreur mise à jour'; showSnack('Erreur mise à jour', 'error') }
}

onMounted(load)
</script>
