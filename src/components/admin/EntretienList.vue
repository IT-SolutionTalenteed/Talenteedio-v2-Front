<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-calendar-check" class="mr-2" />
      <v-toolbar-title>Entretiens par stand</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-select
        v-model="selectedEvenementId"
        :items="evenements"
        item-title="titre"
        item-value="id"
        label="Sélectionner un événement"
        variant="outlined"
        density="compact"
        clearable
        class="mb-4"
        @update:model-value="load"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="`${item.raw.titre} (${item.raw.date_debut})`" />
        </template>
        <template #selection="{ item }">
          {{ item.raw.titre }} ({{ item.raw.date_debut }})
        </template>
      </v-select>

      <div v-if="stands.length > 0">
        <v-card
          v-for="stand in stands"
          :key="stand.entreprise.id"
          variant="outlined"
          rounded="lg"
          class="mb-4"
        >
          <v-toolbar color="transparent" border="b" density="compact" class="px-3">
            <v-icon icon="mdi-domain" class="mr-2" />
            <v-toolbar-title class="text-body-1 font-weight-bold">
              Stand : {{ stand.entreprise.nom }}
            </v-toolbar-title>
          </v-toolbar>

          <v-data-table
            :headers="standHeaders"
            :items="stand.entretiens"
            density="comfortable"
            hide-default-footer
            :items-per-page="-1"
          >
            <template #item.talent="{ item }">
              <div class="font-weight-bold">{{ item.talent?.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.talent?.email }}</div>
            </template>
            <template #item.heure="{ item }">
              {{ item.heure_debut }} – {{ item.heure_fin }}
            </template>
            <template #item.statut="{ item }">
              <v-chip
                size="small"
                :color="statutColor(item.statut)"
              >
                {{ statutLabel(item.statut) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </div>

      <v-alert
        v-else-if="selectedEvenementId && !loading"
        type="info"
        variant="tonal"
        density="compact"
      >
        Aucun entretien pour cet événement.
      </v-alert>

      <v-alert
        v-else-if="!selectedEvenementId"
        type="info"
        variant="tonal"
        density="compact"
      >
        Sélectionnez un événement pour voir les entretiens.
      </v-alert>
    </v-card-text>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">
      {{ snackMsg }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const evenements = ref([])
const stands = ref([])
const selectedEvenementId = ref('')
const loading = ref(false)
const error = ref('')

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const standHeaders = [
  { title: 'Talent', key: 'talent', sortable: false },
  { title: 'Date', key: 'date', width: '130px' },
  { title: 'Heure', key: 'heure', sortable: false, width: '150px' },
  { title: 'Statut', key: 'statut', width: '130px' },
]

const statutColor = (statut) => {
  if (statut === 'confirme') return 'success'
  if (statut === 'refuse') return 'error'
  if (statut === 'en_attente') return 'secondary'
  return 'default'
}

const statutLabel = (statut) => {
  if (statut === 'en_attente') return 'En attente'
  if (statut === 'confirme') return 'Confirmé'
  if (statut === 'refuse') return 'Refusé'
  if (statut === 'annule') return 'Annulé'
  return statut
}

const loadEvenements = async () => {
  try {
    const res = await api.get('/admin/entretiens-evenements')
    evenements.value = res.data
  } catch { showSnack('Erreur chargement événements', 'error') }
}

const load = async () => {
  if (!selectedEvenementId.value) return
  loading.value = true; error.value = ''
  try {
    const res = await api.get('/admin/entretiens', { params: { evenement_id: selectedEvenementId.value } })
    stands.value = res.data
  } catch { showSnack('Erreur chargement entretiens', 'error') }
  finally { loading.value = false }
}

onMounted(loadEvenements)
</script>
