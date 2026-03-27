<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-calendar-star</v-icon>
      <v-toolbar-title>Gestion des Événements</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminEvenementCreate' })">Ajouter un événement</v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="evenements"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.image="{ item }">
        <v-avatar size="36" rounded="lg">
          <img :src="item.image_mise_en_avant_url || '/placeholder.png'" style="object-fit:cover;width:100%;height:100%" />
        </v-avatar>
      </template>

      <template #item.titre="{ item }">
        <div class="font-weight-bold">{{ item.titre }}</div>
        <div v-if="item.ville" class="text-caption text-medium-emphasis">{{ item.ville }}</div>
      </template>

      <template #item.dates="{ item }">
        <span class="text-medium-emphasis">{{ formatDate(item.date_debut) }} → {{ formatDate(item.date_fin) }}</span>
      </template>

      <template #item.is_featured="{ item }">
        <v-btn
          :icon="item.is_featured ? 'mdi-star' : 'mdi-star-outline'"
          :color="item.is_featured ? 'warning' : 'default'"
          variant="text"
          size="small"
          @click="toggleFeatured(item)"
        />
      </template>

      <template #item.entreprises="{ item }">
        <v-chip size="small">{{ item.entreprises?.length || 0 }}</v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminEvenementEdit', params: { id: item.id } })" />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" />
        </div>
      </template>
    </v-data-table>

    <v-pagination
      v-if="pagination.last_page > 1"
      v-model="pagination.current_page"
      :length="pagination.last_page"
      @update:model-value="loadPage"
      class="mt-2"
    />

    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import evenementService from '../../services/evenementService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const evenements = ref([])
const loading = ref(false)
const pagination = ref({ current_page: 1, last_page: 1 })
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Image', key: 'image', sortable: false, width: '60px' },
  { title: 'Titre / Ville', key: 'titre', sortable: true },
  { title: 'Dates', key: 'dates', sortable: false },
  { title: 'Mis en avant', key: 'is_featured', sortable: false },
  { title: 'Entreprises', key: 'entreprises', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const res = await evenementService.getAll(page)
    evenements.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const toggleFeatured = async (ev) => {
  try {
    await evenementService.toggleFeatured(ev.id)
    await loadPage(pagination.value.current_page)
  } catch {
    showSnack('Erreur lors de la mise à jour', 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cet événement ?' })
  if (!ok) return
  loading.value = true
  try {
    await evenementService.delete(id)
    showSnack('Événement supprimé avec succès')
    await loadPage(pagination.value.current_page)
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

onMounted(loadPage)
</script>
