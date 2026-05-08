<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('talentDashboard.feedbacks.title') }}</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.note="{ item }">
        <v-rating
          :model-value="item.note"
          readonly
          density="compact"
          size="small"
          color="warning"
        />
      </template>

      <template #item.commentaire="{ item }">
        <span>{{ item.commentaire || '—' }}</span>
      </template>

      <template #item.entretien.date="{ item }">
        {{ item.entretien?.date }}
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="router.push('/talent/feedbacks/' + item.id + '/edit')" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="supprimer(item)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('talentDashboard.feedbacks.noFeedbacks') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import feedbackService from '../../services/talent/feedbackService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: t('talentDashboard.feedbacks.company'), key: 'entretien.entreprise.nom' },
  { title: t('talentDashboard.feedbacks.event'), key: 'entretien.evenement.titre' },
  { title: t('talentDashboard.feedbacks.interviewDate'), key: 'entretien.date' },
  { title: t('talentDashboard.feedbacks.rating'), key: 'note', sortable: false },
  { title: t('talentDashboard.feedbacks.comment'), key: 'commentaire', sortable: false },
  { title: t('talentDashboard.feedbacks.actions'), key: 'actions', sortable: false, align: 'end' },
])

const load = async () => {
  loading.value = true
  try {
    const res = await feedbackService.mesFeedbacks()
    items.value = res.data
  } catch {
    showSnack(t('talentDashboard.feedbacks.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const supprimer = async (fb) => {
  const ok = await confirmRef.value.open({ message: t('talentDashboard.feedbacks.confirmDelete') })
  if (!ok) return
  try {
    await feedbackService.destroy(fb.id)
    items.value = items.value.filter(f => f.id !== fb.id)
    showSnack(t('talentDashboard.feedbacks.feedbackDeleted'))
  } catch {
    showSnack(t('talentDashboard.feedbacks.errorDelete'), 'error')
  }
}

onMounted(load)
</script>
