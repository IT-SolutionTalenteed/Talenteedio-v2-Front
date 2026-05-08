<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('companyDashboard.applications.title') }}</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Filtre par offre -->
    <v-select
      v-model="filtreOffreId"
      :items="offres"
      item-title="titre"
      item-value="id"
      :label="t('companyDashboard.applications.filterByOffer')"
      :placeholder="t('companyDashboard.applications.allOffers')"
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
        <div class="text-center py-6 text-medium-emphasis">{{ t('companyDashboard.applications.noApplications') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import candidatureService from '../../services/entreprise/candidatureService.js'
import offreService from '../../services/entreprise/offreService.js'

const { t } = useI18n()

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
  { title: t('companyDashboard.applications.talent'), key: 'talent.name' },
  { title: t('companyDashboard.applications.offer'), key: 'offre.titre' },
  { title: t('companyDashboard.applications.status'), key: 'statut', sortable: false },
  { title: t('companyDashboard.applications.cv'), key: 'cv_url', sortable: false },
  { title: t('companyDashboard.applications.message'), key: 'message' },
  { title: t('companyDashboard.applications.date'), key: 'created_at' },
]

const statutOptions = [
  { label: t('companyDashboard.applications.statusPending'), value: 'en_attente' },
  { label: t('companyDashboard.applications.statusAccepted'), value: 'acceptee' },
  { label: t('companyDashboard.applications.statusRejected'), value: 'refusee' },
]

const load = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await candidatureService.getAll(filtreOffreId.value || null)
    items.value = res.data
  } catch { error.value = t('companyDashboard.applications.errorLoading'); showSnack(t('companyDashboard.applications.errorLoading'), 'error') }
  finally { loading.value = false }
}

const updateStatut = async (item) => {
  error.value = ''; success.value = ''
  try {
    await candidatureService.updateStatut(item.id, item.statut)
    success.value = t('companyDashboard.applications.statusUpdated')
    showSnack(t('companyDashboard.applications.statusUpdated'))
  } catch { error.value = t('companyDashboard.applications.errorUpdate'); showSnack(t('companyDashboard.applications.errorUpdate'), 'error'); await load() }
}

onMounted(async () => {
  const res = await offreService.getAll()
  offres.value = res.data
  await load()
})
</script>
