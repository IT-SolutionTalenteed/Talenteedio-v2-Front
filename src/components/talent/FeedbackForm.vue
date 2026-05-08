<template>
  <VerticalLayout>
    <div class="d-flex align-center mb-5">
      <div class="d-flex align-center ga-2">
        <v-btn icon="mdi-arrow-left" variant="text" density="comfortable" @click="goBack" />
        <span class="text-h6 font-weight-bold">{{ $t('talent.feedbacks.editFeedback') }}</span>
      </div>
    </div>
    <v-card rounded="xl" border elevation="0">
      <v-card-text class="pa-6">
        <div class="mb-4">
          <div class="text-body-2 font-weight-medium mb-2">{{ $t('talent.interviews.feedbackRating') }} *</div>
          <v-rating v-model="form.note" color="warning" hover />
        </div>

        <v-textarea
          v-model="form.commentaire"
          :label="$t('talent.interviews.feedbackComment')"
          variant="outlined"
          density="compact"
          rows="5"
          class="mb-4"
        />
      </v-card-text>
      <v-card-actions class="pa-4 pt-2 justify-end">
        <v-btn color="primary" :loading="saving" @click="save" prepend-icon="mdi-content-save-outline" size="large">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  </VerticalLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VerticalLayout from '../layout/VerticalLayout.vue'
import feedbackService from '../../services/talent/feedbackService.js'
import { useDashboardStore } from '@/stores/dashboard.store'

const { t: $t } = useI18n()

const route = useRoute()
const router = useRouter()
const dashboardStore = useDashboardStore()

const form = ref({ note: 0, commentaire: '' })
const saving = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const goBack = () => {
  dashboardStore.setActiveTab('feedbacks')
  router.push('/talent')
}

onMounted(async () => {
  try {
    const res = await feedbackService.mesFeedbacks()
    const item = res.data.find(f => f.id == route.params.id)
    if (item) {
      form.value = { note: item.note, commentaire: item.commentaire || '' }
    }
  } catch {
    showSnack($t('talent.feedbacks.errorLoading'), 'error')
  }
})

const save = async () => {
  saving.value = true
  try {
    await feedbackService.update(route.params.id, form.value)
    showSnack($t('talent.interviews.feedbackSuccess'))
    setTimeout(goBack, 800)
  } catch (err) {
    const errs = err.response?.data?.errors
    showSnack(errs ? Object.values(errs).flat().join(' | ') : $t('talent.interviews.feedbackError'), 'error')
  } finally {
    saving.value = false
  }
}
</script>
