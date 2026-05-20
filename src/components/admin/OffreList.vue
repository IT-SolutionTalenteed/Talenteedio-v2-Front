<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-briefcase</v-icon>
      <v-toolbar-title>{{ t('admin.offers.title') }}</v-toolbar-title>
      <template #append>
        <span class="text-caption text-medium-emphasis mr-4">{{ total }} {{ total > 1 ? t('dashboard.common.resultsPlural') : t('dashboard.common.results') }}</span>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminOffreCreate' })">{{ t('admin.offers.addOffer') }}</v-btn>
      </template>
    </v-toolbar>

    <!-- Barre de recherche et filtres -->
    <div class="pa-3 pb-0 d-flex gap-3 align-center flex-wrap">
      <v-text-field
        v-model="searchInput"
        prepend-inner-icon="mdi-magnify"
        :placeholder="t('admin.offers.searchPlaceholder')"
        density="compact"
        variant="outlined"
        clearable
        hide-details
        style="max-width: 420px"
        @update:model-value="onSearchChange"
        @click:clear="onClear"
      />
      
      <v-select
        v-model="showArchived"
        :items="filterOptions"
        item-title="text"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 200px"
        @update:model-value="onFilterChange"
      />

      <v-spacer />
      <v-btn
        v-if="!showArchived && total > 0"
        variant="text"
        size="small"
        color="medium-emphasis"
        prepend-icon="mdi-archive-outline"
        class="text-caption archive-all-btn"
        @click="archiveAllDialog = true"
      >
        {{ t('admin.offers.archiveAll') }}
      </v-btn>
    </div>

    <v-data-table-server
      :headers="headers"
      :items="offres"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="perPage"
      :items-per-page-options="[10, 25, 50, 100]"
      hover
      density="comfortable"
      @update:options="onOptions"
    >
      <template #item.titre="{ item }">
        <div class="d-flex align-center gap-2">
          <div>
            <div class="font-weight-bold">{{ item.titre }}</div>
            <div v-if="item.fourchette_salariale" class="text-caption text-medium-emphasis">{{ item.fourchette_salariale }}</div>
          </div>
          <v-chip v-if="item.archived_at" color="warning" size="x-small" prepend-icon="mdi-archive">
            {{ t('admin.offers.archived') }}
          </v-chip>
        </div>
      </template>

      <template #item.date_limite="{ item }">
        {{ item.date_limite ? formatDate(item.date_limite) : '—' }}
      </template>

      <template #item.job_contracts="{ item }">
        <template v-if="item.job_contracts?.length">
          <v-chip v-for="c in item.job_contracts" :key="c.id" size="x-small" class="mr-1">{{ c.name }}</v-chip>
        </template>
        <span v-else class="text-medium-emphasis">—</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn 
            v-if="item.archived_at"
            icon="mdi-archive-arrow-up" 
            size="small" 
            color="success" 
            variant="tonal" 
            @click="unarchiveItem(item.id)"
            :title="t('admin.offers.unarchive')"
          />
          <v-btn 
            v-else
            icon="mdi-archive-arrow-down" 
            size="small" 
            color="warning" 
            variant="tonal" 
            @click="archiveItem(item.id)"
            :title="t('admin.offers.archive')"
          />
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminOffreEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table-server>

    <ConfirmDialog ref="confirmRef" />

    <v-dialog v-model="archiveAllDialog" max-width="480" persistent>
      <v-card rounded="xl" elevation="8">
        <v-card-text class="pa-6 text-center">
          <v-avatar color="warning" variant="tonal" size="64" class="mb-4">
            <v-icon size="32" color="warning">mdi-archive-alert-outline</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-semibold mb-2">{{ t('admin.offers.confirmArchiveAllTitle') }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ t('admin.offers.confirmArchiveAll') }}</div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 d-flex ga-2">
          <v-btn variant="tonal" class="flex-1-1" :disabled="archiveAllLoading" @click="archiveAllDialog = false">
            {{ t('commonDashboard.confirm.cancel') }}
          </v-btn>
          <v-btn color="warning" variant="flat" class="flex-1-1" :loading="archiveAllLoading" @click="confirmArchiveAll">
            <v-icon start>mdi-archive</v-icon>
            {{ t('admin.offers.confirmArchiveAllBtn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import offreService from '../../services/offreService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const { t } = useI18n()
const router = useRouter()
const offres      = ref([])
const total       = ref(0)
const loading     = ref(false)
const page        = ref(1)
const perPage     = ref(25)
const searchInput = ref('')
const showArchived = ref(false)
const confirmRef  = ref(null)
const archiveAllDialog = ref(false)
const archiveAllLoading = ref(false)

let searchTimer = null

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const filterOptions = [
  { text: t('admin.offers.activeOffers'), value: false },
  { text: t('admin.offers.archivedOffers'), value: true }
]

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '60px' },
  { title: t('admin.offers.title_field'), key: 'titre', sortable: false },
  { title: t('admin.offers.client'), key: 'client', sortable: false },
  { title: t('admin.offers.location'), key: 'localisation', sortable: false },
  { title: t('admin.offers.deadline'), key: 'date_limite', sortable: false },
  { title: t('admin.offers.contracts'), key: 'job_contracts', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loadPage = async () => {
  loading.value = true
  try {
    const res = await offreService.getAll(page.value, perPage.value, searchInput.value, showArchived.value)
    offres.value = res.data.data
    total.value  = res.data.total
  } catch {
    showSnack(t('admin.offers.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

const onOptions = ({ page: p, itemsPerPage: ipp }) => {
  page.value    = p
  perPage.value = ipp
  loadPage()
}

const onSearchChange = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    loadPage()
  }, 400)
}

const onClear = () => {
  searchInput.value = ''
  page.value = 1
  loadPage()
}

const onFilterChange = () => {
  page.value = 1
  loadPage()
}

const archiveItem = async (id) => {
  const ok = await confirmRef.value.open({ 
    message: t('admin.offers.confirmArchive')
  })
  if (!ok) return
  loading.value = true
  try {
    await offreService.archive(id)
    showSnack(t('admin.offers.offerArchived'))
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.offers.errorArchive'), 'error')
  } finally {
    loading.value = false
  }
}

const unarchiveItem = async (id) => {
  const ok = await confirmRef.value.open({ 
    message: t('admin.offers.confirmUnarchive')
  })
  if (!ok) return
  loading.value = true
  try {
    await offreService.unarchive(id)
    showSnack(t('admin.offers.offerUnarchived'), 'success')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.offers.errorUnarchive'), 'error')
  } finally {
    loading.value = false
  }
}

const confirmArchiveAll = async () => {
  archiveAllLoading.value = true
  try {
    const res = await offreService.archiveAll()
    archiveAllDialog.value = false
    showSnack(res.data.message || t('admin.offers.allOffersArchived'), 'success')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.offers.errorArchive'), 'error')
  } finally {
    archiveAllLoading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.offers.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await offreService.delete(id)
    showSnack(t('admin.offers.offerDeleted'))
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.offers.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR')
</script>

<style scoped>
.archive-all-btn {
  opacity: 0.75;
  letter-spacing: 0;
}
.archive-all-btn:hover {
  opacity: 1;
}
</style>
