<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2" color="primary">mdi-laptop</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">{{ t('admin.referential.jobModes.title') }}</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="router.push({ name: 'AdminJobModeCreate' })">{{ t('admin.referential.add') }}</v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="router.push({ name: 'AdminJobModeEdit', params: { id: item.id } })" />
        <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
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
import jobModeService from '../../services/jobModeService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const { t } = useI18n()

const headers = computed(() => [
  { title: 'ID', key: 'id', width: '80px' },
  { title: t('admin.referential.name'), key: 'name' },
  { title: t('commonDashboard.actions.actions'), key: 'actions', sortable: false, align: 'end', width: '120px' },
])

const items = ref([])
const loading = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const confirmRef = ref(null)

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const load = async () => {
  loading.value = true
  try {
    const res = await jobModeService.getAll()
    items.value = res.data
  } catch {
    showSnack(t('admin.referential.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.referential.jobModes.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await jobModeService.delete(id)
    showSnack(t('admin.referential.deleted'))
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.referential.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
