<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2" color="primary">mdi-crown-outline</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">{{ t('admin.plans.title') }}</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="router.push({ name: 'AdminPlanCreate' })">
          {{ t('admin.plans.addPlan') }}
        </v-btn>
      </template>
    </v-toolbar>

    <v-data-table :headers="headers" :items="items" :loading="loading" hover density="comfortable">
      <template #item.price="{ item }">
        <v-chip size="small" color="success" variant="tonal">{{ formatPrice(item.price) }}</v-chip>
      </template>

      <template #item.max_offres="{ item }">
        <span v-if="item.max_offres !== null">{{ item.max_offres }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">{{ t('admin.plans.unlimited') }}</v-chip>
      </template>

      <template #item.max_articles="{ item }">
        <span v-if="item.max_articles !== null">{{ item.max_articles }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">{{ t('admin.plans.unlimited') }}</v-chip>
      </template>

      <template #item.max_evenements="{ item }">
        <span v-if="item.max_evenements !== null">{{ item.max_evenements }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">{{ t('admin.plans.unlimited') }}</v-chip>
      </template>

      <template #item.max_entretiens_par_evenement="{ item }">
        <span v-if="item.max_entretiens_par_evenement !== null">{{ item.max_entretiens_par_evenement }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">{{ t('admin.plans.unlimited') }}</v-chip>
      </template>

      <template #item.max_candidatures_par_offre="{ item }">
        <span v-if="item.max_candidatures_par_offre !== null">{{ item.max_candidatures_par_offre }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">{{ t('admin.plans.unlimited') }}</v-chip>
      </template>

      <template #item.is_active="{ item }">
        <v-chip :color="item.is_active ? 'success' : 'error'" size="small" variant="tonal">
          {{ item.is_active ? t('admin.plans.active') : t('admin.plans.inactive') }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text"
          @click="router.push({ name: 'AdminPlanEdit', params: { id: item.id } })" />
        <v-btn icon="mdi-delete" size="small" color="error" variant="text"
          @click="deleteItem(item.id)" />
      </template>
    </v-data-table>
  </v-card>

  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
  <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import planService from '../../services/planService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()

const headers = computed(() => [
  { title: t('admin.plans.name'), key: 'name' },
  { title: t('admin.plans.pricePerMonth'), key: 'price', width: '110px' },
  { title: t('admin.plans.offers'), key: 'max_offres', width: '90px' },
  { title: t('admin.plans.articles'), key: 'max_articles', width: '90px' },
  { title: t('admin.plans.events'), key: 'max_evenements', width: '110px' },
  { title: t('admin.plans.interviewsPerEvent'), key: 'max_entretiens_par_evenement', width: '170px' },
  { title: t('admin.plans.applicationsPerOffer'), key: 'max_candidatures_par_offre', width: '160px' },
  { title: t('admin.plans.status'), key: 'is_active', width: '90px' },
  { title: '', key: 'actions', sortable: false, align: 'end', width: '100px' },
])

const items = ref([])
const loading = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const confirmRef = ref(null)

const formatPrice = (price) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const load = async () => {
  loading.value = true
  try {
    const res = await planService.getAll()
    items.value = res.data
  } catch {
    showSnack(t('admin.plans.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.plans.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await planService.delete(id)
    showSnack(t('admin.plans.planDeleted'))
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.plans.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
