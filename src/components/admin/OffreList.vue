<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-briefcase</v-icon>
      <v-toolbar-title>Gestion des Offres d'emploi</v-toolbar-title>
      <template #append>
        <span class="text-caption text-medium-emphasis mr-4">{{ total }} résultat{{ total > 1 ? 's' : '' }}</span>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminOffreCreate' })">Ajouter une offre</v-btn>
      </template>
    </v-toolbar>

    <!-- Barre de recherche et filtres -->
    <div class="pa-3 pb-0 d-flex gap-3 align-center flex-wrap">
      <v-text-field
        v-model="searchInput"
        prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher par titre, client, localisation…"
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

      <v-btn
        v-if="!showArchived"
        color="warning"
        prepend-icon="mdi-archive"
        variant="tonal"
        @click="archiveAllOffres"
      >
        Archiver tout
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
            Archivée
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
            title="Désarchiver"
          />
          <v-btn 
            v-else
            icon="mdi-archive-arrow-down" 
            size="small" 
            color="warning" 
            variant="tonal" 
            @click="archiveItem(item.id)"
            title="Archiver"
          />
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminOffreEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table-server>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import offreService from '../../services/offreService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const offres      = ref([])
const total       = ref(0)
const loading     = ref(false)
const page        = ref(1)
const perPage     = ref(25)
const searchInput = ref('')
const showArchived = ref(false)
const confirmRef  = ref(null)

let searchTimer = null

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const filterOptions = [
  { text: 'Offres actives', value: false },
  { text: 'Offres archivées', value: true }
]

const headers = [
  { title: 'ID', key: 'id', sortable: false, width: '60px' },
  { title: 'Titre / Salaire', key: 'titre', sortable: false },
  { title: 'Client', key: 'client', sortable: false },
  { title: 'Localisation', key: 'localisation', sortable: false },
  { title: 'Date limite', key: 'date_limite', sortable: false },
  { title: 'Contrats', key: 'job_contracts', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loadPage = async () => {
  loading.value = true
  try {
    const res = await offreService.getAll(page.value, perPage.value, searchInput.value, showArchived.value)
    offres.value = res.data.data
    total.value  = res.data.total
  } catch {
    showSnack('Erreur lors du chargement', 'error')
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
    message: 'Archiver cette offre ? Elle ne sera plus visible publiquement mais restera accessible dans l\'administration.' 
  })
  if (!ok) return
  loading.value = true
  try {
    await offreService.archive(id)
    showSnack('Offre archivée avec succès')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de l\'archivage', 'error')
  } finally {
    loading.value = false
  }
}

const unarchiveItem = async (id) => {
  const ok = await confirmRef.value.open({ 
    message: 'Désarchiver cette offre ? Elle redeviendra visible publiquement.' 
  })
  if (!ok) return
  loading.value = true
  try {
    await offreService.unarchive(id)
    showSnack('Offre désarchivée avec succès', 'success')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la désarchivage', 'error')
  } finally {
    loading.value = false
  }
}

const archiveAllOffres = async () => {
  const ok = await confirmRef.value.open({ 
    message: 'Archiver TOUTES les offres actives ? Elles ne seront plus visibles publiquement mais resteront accessibles dans l\'administration.' 
  })
  if (!ok) return
  loading.value = true
  try {
    const res = await offreService.archiveAll()
    showSnack(res.data.message || 'Toutes les offres ont été archivées', 'success')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de l\'archivage', 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cette offre ?' })
  if (!ok) return
  loading.value = true
  try {
    await offreService.delete(id)
    showSnack('Offre supprimée avec succès')
    await loadPage()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR')
</script>
