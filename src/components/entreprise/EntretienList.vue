<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('companyDashboard.interviews.title') }}</v-card-title>

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
          {{ item.statut === 'confirme' ? t('companyDashboard.interviews.statusConfirmed') : item.statut === 'refuse' ? t('companyDashboard.interviews.statusRejected') : item.statut === 'annule' ? t('companyDashboard.interviews.statusCancelled') : t('companyDashboard.interviews.statusPending') }}
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
          >{{ t('companyDashboard.interviews.confirm') }}</v-btn>
          <v-btn
            size="small"
            color="error"
            variant="tonal"
            @click="updateStatut(item, 'refuse')"
          >{{ t('companyDashboard.interviews.reject') }}</v-btn>
        </template>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('companyDashboard.interviews.noInterviews') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../services/api.js'

const { t } = useI18n()
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

const headers = computed(() => [
  { title: t('companyDashboard.interviews.talent'), key: 'talent.name' },
  { title: t('companyDashboard.interviews.event'), key: 'evenement.titre' },
  { title: t('companyDashboard.interviews.date'), key: 'date' },
  { title: t('companyDashboard.interviews.time'), key: 'heure', sortable: false },
  { title: t('companyDashboard.interviews.status'), key: 'statut' },
  { title: t('companyDashboard.interviews.actions'), key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try { const res = await api.get('/entreprise/entretiens'); items.value = res.data }
  catch { error.value = t('companyDashboard.interviews.errorLoading'); showSnack(t('companyDashboard.interviews.errorLoading'), 'error') }
  finally { loading.value = false }
}

const updateStatut = async (item, statut) => {
  error.value = ''; success.value = ''
  try {
    const res = await api.patch(`/entreprise/entretiens/${item.id}/statut`, { statut })
    item.statut = res.data.statut
    success.value = statut === 'confirme' ? t('companyDashboard.interviews.interviewConfirmed') : t('companyDashboard.interviews.interviewRejected')
    showSnack(success.value)
  } catch { error.value = t('companyDashboard.interviews.errorUpdate'); showSnack(t('companyDashboard.interviews.errorUpdate'), 'error') }
}

onMounted(load)
</script>
