<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-chat-processing-outline" class="mr-2" />
      <v-toolbar-title>{{ t('admin.feedbacks.title') }}</v-toolbar-title>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.talent="{ item }">
        {{ item.talent?.name }}
      </template>
      <template #item.entreprise="{ item }">
        {{ item.entretien?.entreprise?.nom }}
      </template>
      <template #item.evenement="{ item }">
        {{ item.entretien?.evenement?.titre }}
      </template>
      <template #item.date_entretien="{ item }">
        {{ item.entretien?.date }}
      </template>
      <template #item.note="{ item }">
        <v-chip size="small" color="primary">{{ item.note }}/5</v-chip>
      </template>
      <template #item.commentaire="{ item }">
        {{ item.commentaire || '—' }}
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../services/api.js'

const { t } = useI18n()

const items = ref([])
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

const headers = computed(() => [
  { title: t('admin.feedbacks.talent'), key: 'talent', sortable: false },
  { title: t('admin.feedbacks.company'), key: 'entreprise', sortable: false },
  { title: t('admin.feedbacks.event'), key: 'evenement', sortable: false },
  { title: t('admin.feedbacks.interviewDate'), key: 'date_entretien', sortable: false },
  { title: t('admin.feedbacks.rating'), key: 'note', sortable: false, width: '100px' },
  { title: t('admin.feedbacks.comment'), key: 'commentaire', sortable: false },
  { title: t('admin.feedbacks.submittedOn'), key: 'created_at', width: '130px' },
])

const formatDate = (str) => str ? new Date(str).toLocaleDateString('fr-FR') : '—'

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/feedbacks')
    items.value = res.data
  } catch {
    showSnack(t('admin.feedbacks.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
