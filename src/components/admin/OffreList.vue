<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-briefcase</v-icon>
      <v-toolbar-title>Gestion des Offres d'emploi</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminOffreCreate' })">Ajouter une offre</v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="offres"
      :loading="loading"
      :items-per-page="-1"
      hover
      density="comfortable"
    >
      <template #item.titre="{ item }">
        <div class="font-weight-bold">{{ item.titre }}</div>
        <div v-if="item.fourchette_salariale" class="text-caption text-medium-emphasis">{{ item.fourchette_salariale }}</div>
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
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminOffreEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table>

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import offreService from '../../services/offreService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const offres = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Titre / Salaire', key: 'titre', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Localisation', key: 'localisation', sortable: false },
  { title: 'Date limite', key: 'date_limite', sortable: true },
  { title: 'Contrats', key: 'job_contracts', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loadPage = async () => {
  loading.value = true
  try {
    const response = await offreService.getAll(1, 1000)
    offres.value = response.data.data ?? response.data
  } catch {
    showSnack('Erreur lors du chargement', 'error')
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

onMounted(loadPage)
</script>
