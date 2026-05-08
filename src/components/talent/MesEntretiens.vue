<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('talentDashboard.interviews.title') }}</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <ConfirmDialog ref="confirmRef" />

    <!-- Dialog feedback -->
    <v-dialog v-model="feedbackDialog" max-width="480" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          {{ t('talentDashboard.interviews.feedbackTitle', { company: feedbackEntretien?.entreprise?.nom || '' }) }}
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-2">{{ t('talentDashboard.interviews.feedbackRating') }}</div>
            <v-rating v-model="feedbackForm.note" :length="5" color="warning" hover />
          </div>
          <v-textarea
            v-model="feedbackForm.commentaire"
            :label="t('talentDashboard.interviews.feedbackComment')"
            rows="3"
            variant="outlined"
            density="comfortable"
          />
          <v-alert v-if="feedbackError" type="error" density="compact" class="mt-2">{{ feedbackError }}</v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="feedbackDialog = false; feedbackEntretien = null">{{ t('talentDashboard.interviews.feedbackCancel') }}</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="savingFeedback" :loading="savingFeedback" @click="soumettreFeedback">
            {{ t('talentDashboard.interviews.feedbackSubmit') }}
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
      <template #item.heure="{ item }">
        {{ item.heure_debut }} – {{ item.heure_fin }}
      </template>

      <template #item.statut="{ item }">
        <v-chip
          size="small"
          :color="item.statut === 'confirme' ? 'success' : item.statut === 'refuse' ? 'error' : item.statut === 'annule' ? 'default' : 'warning'"
        >
          {{ item.statut === 'confirme' ? t('talentDashboard.interviews.statusConfirmed') : item.statut === 'refuse' ? t('talentDashboard.interviews.statusRejected') : item.statut === 'annule' ? t('talentDashboard.interviews.statusCancelled') : t('talentDashboard.interviews.statusPending') }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="item.statut === 'en_attente'"
          size="small"
          color="error"
          variant="tonal"
          class="mr-1"
          @click="annuler(item)"
        >{{ t('talentDashboard.interviews.cancel') }}</v-btn>
        <v-btn
          v-if="item.statut === 'confirme' && !item.feedback"
          size="small"
          color="primary"
          variant="tonal"
          @click="ouvrirFeedback(item)"
        >{{ t('talentDashboard.interviews.leaveFeedback') }}</v-btn>
        <span v-if="item.statut === 'confirme' && item.feedback" class="text-caption text-medium-emphasis font-italic">
          {{ t('talentDashboard.interviews.feedbackSent') }}
        </span>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('talentDashboard.interviews.noInterviews') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import entretienService from '../../services/talent/entretienService.js'
import feedbackService from '../../services/talent/feedbackService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const { t } = useI18n()
const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const confirmRef = ref(null)

// Feedback state
const feedbackEntretien = ref(null)
const feedbackDialog = ref(false)
const feedbackForm = ref({ note: 5, commentaire: '' })
const savingFeedback = ref(false)
const feedbackError = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: t('talentDashboard.interviews.company'), key: 'entreprise.nom' },
  { title: t('talentDashboard.interviews.event'), key: 'evenement.titre' },
  { title: t('talentDashboard.interviews.date'), key: 'date' },
  { title: t('talentDashboard.interviews.time'), key: 'heure', sortable: false },
  { title: t('talentDashboard.interviews.status'), key: 'statut' },
  { title: t('talentDashboard.interviews.actions'), key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try {
    const res = await entretienService.mesEntretiens()
    items.value = res.data
  } catch {
    error.value = t('talentDashboard.interviews.errorLoading')
    showSnack(t('talentDashboard.interviews.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const annuler = async (item) => {
  const ok = await confirmRef.value.open({ message: t('talentDashboard.interviews.confirmCancel') })
  if (!ok) return
  try {
    await entretienService.annuler(item.id)
    item.statut = 'annule'
    success.value = t('talentDashboard.interviews.interviewCancelled')
    showSnack(t('talentDashboard.interviews.interviewCancelled'))
  } catch {
    error.value = t('talentDashboard.interviews.errorCancel')
    showSnack(t('talentDashboard.interviews.errorCancel'), 'error')
  }
}

const ouvrirFeedback = (item) => {
  feedbackEntretien.value = item
  feedbackForm.value = { note: 5, commentaire: '' }
  feedbackError.value = ''
  success.value = ''
  feedbackDialog.value = true
}

const soumettreFeedback = async () => {
  savingFeedback.value = true
  feedbackError.value = ''
  try {
    const res = await feedbackService.store(feedbackEntretien.value.id, feedbackForm.value)
    // Marquer l'entretien comme ayant un feedback
    const idx = items.value.findIndex(i => i.id === feedbackEntretien.value.id)
    if (idx !== -1) items.value[idx].feedback = res.data
    feedbackEntretien.value = null
    feedbackDialog.value = false
    success.value = t('talentDashboard.interviews.feedbackSuccess')
    showSnack(t('talentDashboard.interviews.feedbackSuccess'))
  } catch (err) {
    feedbackError.value = err.response?.data?.message || t('talentDashboard.interviews.feedbackError')
  } finally {
    savingFeedback.value = false
  }
}

onMounted(load)
</script>
