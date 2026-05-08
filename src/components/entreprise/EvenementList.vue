<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('companyDashboard.events.title') }}</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Dialog demande de participation -->
    <v-dialog v-model="showDemande" max-width="480" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          {{ t('companyDashboard.events.requestTitle', { title: selectedEvenement?.titre || '' }) }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="demandeMessage"
            :label="t('companyDashboard.events.message')"
            rows="4"
            :placeholder="t('companyDashboard.events.messagePlaceholder')"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showDemande = false">{{ t('companyDashboard.events.cancel') }}</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="loading" :loading="loading" @click="soumettreDemande">
            {{ t('companyDashboard.events.sendRequest') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.demande_statut="{ item }">
        <v-chip
          v-if="item.demande_statut"
          size="small"
          :color="item.demande_statut === 'acceptee' ? 'success' : item.demande_statut === 'refusee' ? 'error' : 'warning'"
        >
          {{ item.demande_statut === 'acceptee' ? t('companyDashboard.events.statusAccepted') : item.demande_statut === 'refusee' ? t('companyDashboard.events.statusRejected') : t('companyDashboard.events.statusPending') }}
        </v-chip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="!item.demande_statut || item.demande_statut === 'refusee'"
          size="small"
          color="primary"
          variant="tonal"
          @click="openDemande(item)"
        >{{ t('companyDashboard.events.requestParticipation') }}</v-btn>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('companyDashboard.events.noEvents') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import evenementService from '../../services/entreprise/evenementService.js'

const { t } = useI18n()
const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showDemande = ref(false)
const selectedEvenement = ref(null)
const demandeMessage = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: t('companyDashboard.events.name'), key: 'titre' },
  { title: t('companyDashboard.events.startDate'), key: 'date_debut' },
  { title: t('companyDashboard.events.endDate'), key: 'date_fin' },
  { title: t('companyDashboard.events.myStatus'), key: 'demande_statut' },
  { title: t('companyDashboard.events.actions'), key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try {
    const res = await evenementService.getAll()
    items.value = res.data
  } catch { error.value = t('companyDashboard.events.errorLoading'); showSnack(t('companyDashboard.events.errorLoading'), 'error') }
  finally { loading.value = false }
}

const openDemande = (evenement) => {
  selectedEvenement.value = evenement
  demandeMessage.value = ''
  showDemande.value = true
}

const soumettreDemande = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    await evenementService.demandeParticipation(selectedEvenement.value.id, { message: demandeMessage.value })
    success.value = t('companyDashboard.events.requestSent')
    showSnack(t('companyDashboard.events.requestSent'))
    showDemande.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || t('companyDashboard.events.errorSending')
    showSnack(error.value, 'error')
  } finally { loading.value = false }
}

onMounted(load)
</script>
