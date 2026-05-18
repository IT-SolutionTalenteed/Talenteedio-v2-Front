<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      <v-toolbar-title>{{ t('admin.talents.title') }}</v-toolbar-title>
      <template #append>
        <span class="text-caption text-medium-emphasis mr-4">{{ total }} {{ total > 1 ? t('dashboard.common.resultsPlural') : t('dashboard.common.results') }}</span>
      </template>
    </v-toolbar>

    <!-- Barre de recherche et filtres -->
    <div class="pa-3 pb-0">
      <div class="d-flex flex-wrap gap-3 align-center">
        <v-text-field
          v-model="searchInput"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('admin.talents.searchPlaceholder')"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          style="max-width: 420px"
          @update:model-value="onSearchChange"
          @click:clear="onClear"
        />
        
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="label"
          item-value="value"
          :label="t('admin.talents.sortBy')"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 200px"
          @update:model-value="onSortChange"
        />
        
        <v-select
          v-model="sortOrder"
          :items="sortOrderOptions"
          item-title="label"
          item-value="value"
          :label="t('admin.talents.order')"
          density="compact"
          variant="outlined"
          hide-details
          style="min-width: 150px"
          @update:model-value="onSortChange"
        />
      </div>
    </div>

    <v-data-table-server
      :headers="headers"
      :items="talents"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="perPage"
      :items-per-page-options="[10, 25, 50, 100]"
      hover
      density="comfortable"
      @update:options="onOptions"
    >
      <template #item.name="{ item }">
        <div class="font-weight-bold">{{ item.name }}</div>
      </template>

      <template #item.titre_poste="{ item }">
        <span class="text-medium-emphasis">{{ item.titre_poste || '—' }}</span>
      </template>

      <template #item.role="{ item }">
        <v-chip size="small" :color="item.role === 'consultant_externe' ? 'purple' : 'primary'">
          {{ item.role === 'consultant_externe' ? t('admin.talents.consultant') : t('admin.talents.talent') }}
        </v-chip>
      </template>

      <template #item.localisation="{ item }">
        <span class="text-medium-emphasis">{{ [item.ville, item.pays].filter(Boolean).join(', ') || '—' }}</span>
      </template>

      <template #item.source_provenance="{ item }">
        <span class="text-medium-emphasis">{{ item.source_provenance || '—' }}</span>
      </template>

      <template #item.statut_crm="{ item }">
        <v-select
          variant="outlined"
          density="compact"
          style="min-width:160px"
          :items="statutOptions"
          item-title="label"
          item-value="value"
          :model-value="item.statut_crm || ''"
          @update:model-value="v => updateStatutCrm(item, v)"
          hide-details
        />
      </template>

      <template #item.etat="{ item }">
        <v-chip size="small" :color="item.is_suspended ? 'warning' : item.is_banned ? 'error' : 'success'">
          {{ item.is_suspended ? t('admin.talents.suspended') : item.is_banned ? t('admin.talents.banned') : t('admin.talents.active') }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminTalentEdit', params: { id: item.id } })" :title="t('admin.talents.editProfile')" />
          <v-btn
            :icon="item.is_suspended ? 'mdi-check-circle' : 'mdi-pause-circle'"
            size="small"
            :color="item.is_suspended ? 'success' : 'warning'"
            variant="tonal"
            @click="toggleSuspend(item)"
            :title="item.is_suspended ? t('admin.talents.reactivate') : t('admin.talents.suspend')"
          />
          <v-btn
            :icon="item.is_banned ? 'mdi-lock-open' : 'mdi-lock'"
            size="small"
            :color="item.is_banned ? 'info' : 'error'"
            variant="tonal"
            @click="toggleBan(item)"
            :title="item.is_banned ? t('admin.talents.unban') : t('admin.talents.ban')"
          />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" :title="t('commonDashboard.actions.delete')" />
        </div>
      </template>
    </v-data-table-server>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import talentService from '../../services/talentService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const { t } = useI18n()
const router = useRouter()
const talents    = ref([])
const total      = ref(0)
const loading    = ref(false)
const page       = ref(1)
const perPage    = ref(25)
const searchInput = ref('')
const sortBy     = ref('created_at')
const sortOrder  = ref('desc')
const confirmRef = ref(null)

let searchTimer = null

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const sortOptions = [
  { value: 'created_at', label: t('admin.talents.sortByRegistrationDate') },
  { value: 'name', label: t('admin.talents.sortByAlphabetical') },
  { value: 'titre_poste', label: t('admin.talents.sortByJob') },
]

const sortOrderOptions = [
  { value: 'asc', label: t('admin.talents.ascending') },
  { value: 'desc', label: t('admin.talents.descending') },
]

const headers = [
  { title: t('admin.talents.name'), key: 'name', sortable: false },
  { title: t('admin.talents.email'), key: 'email', sortable: false },
  { title: t('admin.talents.job'), key: 'titre_poste', sortable: false },
  { title: t('admin.talents.role'), key: 'role', sortable: false },
  { title: t('admin.talents.location'), key: 'localisation', sortable: false },
  { title: t('admin.talents.source'), key: 'source_provenance', sortable: false },
  { title: t('admin.talents.crmStatus'), key: 'statut_crm', sortable: false },
  { title: t('admin.talents.state'), key: 'etat', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const statutOptions = [
  { value: '', label: '— Aucun —' },
  { value: 'a_traiter', label: 'A traiter' },
  { value: 'en_cours_qualif', label: 'En cours de qualif.' },
  { value: 'vivier', label: 'Vivier' },
  { value: 'top_profil', label: 'Top profil' },
  { value: 'converti_ressource', label: 'Converti en ressource' },
  { value: 'recrute_client', label: 'Recruté par client' },
  { value: 'ne_plus_contacter', label: 'Ne plus contacter' },
]

const loadPage = async () => {
  loading.value = true
  try {
    const res = await talentService.getAll(page.value, perPage.value, searchInput.value, sortBy.value, sortOrder.value)
    talents.value = res.data.data
    total.value   = res.data.total
  } catch {
    showSnack(t('admin.talents.errorLoading'), 'error')
  } finally {
    loading.value = false
  }
}

// Déclenché par v-data-table-server quand page/perPage change
const onOptions = ({ page: p, itemsPerPage: ipp }) => {
  page.value    = p
  perPage.value = ipp
  loadPage()
}

// Debounce recherche 400ms
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

const onSortChange = () => {
  page.value = 1
  loadPage()
}

const toggleSuspend = async (talent) => {
  try {
    const res = await talentService.toggleSuspend(talent.id)
    talent.is_suspended = res.data.is_suspended
    showSnack(talent.is_suspended ? t('admin.talents.talentSuspended') : t('admin.talents.talentReactivated'))
  } catch {
    showSnack(t('admin.talents.errorSuspend'), 'error')
  }
}

const toggleBan = async (talent) => {
  try {
    const res = await talentService.toggleBan(talent.id)
    talent.is_banned = res.data.is_banned
    showSnack(talent.is_banned ? t('admin.talents.talentBanned') : t('admin.talents.talentUnbanned'))
  } catch {
    showSnack(t('admin.talents.errorBan'), 'error')
  }
}

const updateStatutCrm = async (talent, statut) => {
  try {
    const res = await talentService.updateStatutCrm(talent.id, statut || null)
    talent.statut_crm = res.data.statut_crm
    talent.is_banned  = res.data.is_banned
    showSnack(t('admin.talents.crmStatusUpdated'))
  } catch {
    showSnack(t('admin.talents.errorStatusUpdate'), 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: t('admin.talents.confirmDelete') })
  if (!ok) return
  loading.value = true
  try {
    await talentService.delete(id)
    showSnack(t('admin.talents.talentDeleted'))
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || t('admin.talents.errorDelete'), 'error')
  } finally {
    loading.value = false
  }
}
</script>
