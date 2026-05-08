<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <v-card-title class="text-h5 pa-0">{{ t('companyDashboard.offers.title') }}</v-card-title>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="router.push('/entreprise/offres/create')">
        {{ t('dashboard.company.quickActions.publishOffer') }}
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="router.push('/entreprise/offres/' + item.id + '/edit')" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="deleteItem(item.id)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('companyDashboard.offers.noOffers') }}</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import offreService from '../../services/entreprise/offreService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const { t } = useI18n()
const router = useRouter()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: t('companyDashboard.offers.title_field'), key: 'titre' },
  { title: t('companyDashboard.offers.location'), key: 'localisation' },
  { title: t('companyDashboard.offers.deadline'), key: 'date_limite' },
  { title: t('companyDashboard.offers.actions'), key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await offreService.getAll()
    items.value = res.data
  } catch {
    showSnack(t('companyDashboard.offers.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('companyDashboard.offers.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await offreService.delete(id)
    showSnack(t('companyDashboard.offers.offerDeleted'))
    await load()
  } catch {
    showSnack(t('companyDashboard.offers.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
