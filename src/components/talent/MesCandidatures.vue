<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('talentDashboard.applications.title') }}</v-card-title>

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
          {{ item.statut === 'acceptee' ? t('talentDashboard.applications.statusAccepted') : item.statut === 'refusee' ? t('talentDashboard.applications.statusRejected') : t('talentDashboard.applications.statusPending') }}
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
        <div class="text-center py-6 text-medium-emphasis">{{ t('talentDashboard.applications.noApplications') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import offreService from '../../services/talent/offreService.js'

const { t } = useI18n()

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
  { title: t('talentDashboard.applications.offer'), key: 'offre.titre' },
  { title: t('talentDashboard.applications.company'), key: 'offre.entreprise.nom' },
  { title: t('talentDashboard.applications.status'), key: 'statut' },
  { title: t('talentDashboard.applications.cv'), key: 'cv_url', sortable: false },
  { title: t('talentDashboard.applications.date'), key: 'created_at' },
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await offreService.mesCandidatures()
    items.value = res.data
  } catch { error.value = t('talentDashboard.applications.errorLoading'); showSnack(t('talentDashboard.applications.errorLoading'), 'error') }
  finally { loading.value = false }
})
</script>
