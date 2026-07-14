<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-earth" class="mr-2" />
      <v-toolbar-title>Africa Talent Observatory — Soumissions</v-toolbar-title>
      <v-spacer />
      <v-chip size="small" color="primary" variant="tonal">{{ items.length }}</v-chip>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.consent_data="{ item }">
        <v-icon :icon="item.consent_data ? 'mdi-check-circle' : 'mdi-close-circle'"
                :color="item.consent_data ? 'success' : 'error'" size="small" />
      </template>
      <template #item.consent_communications="{ item }">
        <v-icon :icon="item.consent_communications ? 'mdi-check-circle' : 'mdi-minus-circle-outline'"
                :color="item.consent_communications ? 'success' : 'grey'" size="small" />
      </template>
      <template #item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">
      {{ snackMsg }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import observatoryService from '../../services/observatoryService.js'

const items = ref([])
const loading = ref(false)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const headers = [
  { title: 'Prénom', key: 'prenom' },
  { title: 'Email', key: 'email' },
  { title: 'Pays de résidence', key: 'pays_residence' },
  { title: "Pays d'origine", key: 'pays_origine' },
  { title: "Secteur d'activité", key: 'secteur_activite' },
  { title: 'Lien diaspora', key: 'lien_diaspora' },
  { title: 'Consent. données', key: 'consent_data', sortable: false, width: '120px' },
  { title: 'Consent. comm.', key: 'consent_communications', sortable: false, width: '120px' },
  { title: 'Date', key: 'created_at', width: '130px' },
]

const formatDate = (str) => str ? new Date(str).toLocaleDateString('fr-FR') : '—'

const load = async () => {
  loading.value = true
  try {
    const res = await observatoryService.getAll()
    items.value = res.data
  } catch {
    showSnack('Erreur lors du chargement des soumissions', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
