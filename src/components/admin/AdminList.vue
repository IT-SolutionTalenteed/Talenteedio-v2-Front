<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-shield-account-outline</v-icon>
      <v-toolbar-title>Gestion des Administrateurs</v-toolbar-title>
      <template #append>
        <span class="text-caption text-medium-emphasis mr-4">{{ total }} résultat{{ total > 1 ? 's' : '' }}</span>
      </template>
    </v-toolbar>

    <!-- Barre de recherche -->
    <div class="pa-3 pb-0">
      <v-text-field
        v-model="searchInput"
        prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher par nom, email…"
        density="compact"
        variant="outlined"
        clearable
        hide-details
        style="max-width: 420px"
        @update:model-value="onSearchChange"
        @click:clear="onClear"
      />
    </div>

    <v-data-table-server
      :headers="headers"
      :items="admins"
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
        <div class="font-weight-bold">{{ item.name || '—' }}</div>
        <div v-if="item.email" class="text-caption text-medium-emphasis">{{ item.email }}</div>
      </template>

      <template #item.role="{ item }">
        <v-chip size="small" color="error">
          Administrateur
        </v-chip>
      </template>

      <template #item.created_at="{ item }">
        <span class="text-medium-emphasis">{{ formatDate(item.created_at) }}</span>
      </template>

      <template #item.etat="{ item }">
        <v-chip size="small" :color="item.is_suspended ? 'warning' : item.is_banned ? 'error' : 'success'">
          {{ item.is_suspended ? 'Suspendu' : item.is_banned ? 'Banni' : 'Actif' }}
        </v-chip>
      </template>
    </v-data-table-server>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const admins     = ref([])
const total      = ref(0)
const loading    = ref(false)
const page       = ref(1)
const perPage    = ref(25)
const searchInput = ref('')
const confirmRef = ref(null)

let searchTimer = null

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Nom / Email', key: 'name', sortable: false },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Date de création', key: 'created_at', sortable: false },
  { title: 'État', key: 'etat', sortable: false },
]

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return '—'
  }
}

const loadPage = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      per_page: perPage.value,
    }
    if (searchInput.value) {
      params.search = searchInput.value
    }
    
    const res = await api.get('/admin/admins', { params })
    admins.value = res.data.data || []
    total.value  = res.data.total || 0
  } catch (err) {
    showSnack('Erreur lors du chargement', 'error')
    console.error(err)
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
</script>
