<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">{{ t('admin.applications.title') }}</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Filtres -->
    <v-row dense class="mb-4">
      <v-col cols="12" sm="5">
        <v-text-field
          v-model="search"
          :label="t('admin.applications.searchPlaceholder')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="load"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          v-model="filtreStatut"
          :items="statutOptions"
          item-title="label"
          item-value="value"
          :label="t('admin.applications.status')"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="load"
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.talent.name="{ item }">
        <div class="d-flex align-center ga-2">
          <v-avatar size="32">
            <v-img v-if="item.talent?.avatar_google" :src="item.talent.avatar_google" />
            <span v-else class="text-caption font-weight-bold">
              {{ item.talent?.name?.charAt(0)?.toUpperCase() ?? '?' }}
            </span>
          </v-avatar>
          <span>{{ item.talent?.name ?? '—' }}</span>
        </div>
      </template>

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
        <span v-else>—</span>
      </template>

      <template #item.created_at="{ item }">
        {{ item.created_at?.substring(0, 10) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          @click="confirmDelete(item)"
        />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">{{ t('admin.applications.noApplications') }}</div>
      </template>
    </v-data-table>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="d-flex justify-center mt-4">
      <v-pagination
        v-model="pagination.current_page"
        :length="pagination.last_page"
        @update:model-value="load"
      />
    </div>

    <!-- Dialog suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">{{ t('admin.applications.confirmDelete') }}</v-card-title>
        <v-card-text>{{ t('admin.applications.deleteMessage') }}</v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">{{ t('admin.applications.cancel') }}</v-btn>
          <v-btn color="error" variant="tonal" :loading="loading" @click="doDelete">{{ t('admin.applications.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import candidatureService from '../../services/admin/candidatureService.js'

const { t } = useI18n()

const items = ref([])
const loading = ref(false)
const search = ref('')
const filtreStatut = ref(null)
const pagination = ref({ current_page: 1, last_page: 1 })
const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const deleteDialog = ref(false)
const toDelete = ref(null)

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = computed(() => [
  { title: t('admin.applications.talent'), key: 'talent.name' },
  { title: t('admin.applications.offer'), key: 'offre.titre' },
  { title: t('admin.applications.company'), key: 'offre.entreprise.nom' },
  { title: t('admin.applications.status'), key: 'statut', sortable: false },
  { title: t('admin.applications.cv'), key: 'cv_url', sortable: false },
  { title: t('admin.applications.message'), key: 'message', sortable: false },
  { title: t('admin.applications.date'), key: 'created_at' },
  { title: '', key: 'actions', sortable: false },
])

const statutOptions = computed(() => [
  { label: t('admin.applications.statusPending'), value: 'en_attente' },
  { label: t('admin.applications.statusAccepted'), value: 'acceptee' },
  { label: t('admin.applications.statusRejected'), value: 'refusee' },
])

const load = async () => {
  loading.value = true
  try {
    const params = { page: pagination.value.current_page }
    if (filtreStatut.value) params.statut = filtreStatut.value
    const res = await candidatureService.getAll(params)
    items.value = res.data.data ?? res.data
    if (res.data.last_page) {
      pagination.value.last_page = res.data.last_page
    }
  } catch {
    showSnack(t('admin.applications.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const updateStatut = async (item) => {
  try {
    await candidatureService.updateStatut(item.id, item.statut)
    showSnack(t('admin.applications.statusUpdated'))
  } catch {
    showSnack(t('admin.applications.errorUpdate'), 'error')
  }
}

const confirmDelete = (item) => {
  toDelete.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  loading.value = true
  try {
    await candidatureService.destroy(toDelete.value.id)
    items.value = items.value.filter(i => i.id !== toDelete.value.id)
    deleteDialog.value = false
    showSnack(t('admin.applications.applicationDeleted'))
  } catch {
    showSnack(t('admin.applications.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
