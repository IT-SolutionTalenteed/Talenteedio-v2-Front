<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2" color="primary">mdi-crown-outline</v-icon>
      <v-toolbar-title class="text-body-1 font-weight-semibold">Gestion des Plans</v-toolbar-title>
      <template #append>
        <v-btn color="primary" prepend-icon="mdi-plus" size="small" @click="router.push({ name: 'AdminPlanCreate' })">
          Ajouter un plan
        </v-btn>
      </template>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.price="{ item }">
        <v-chip size="small" color="success" variant="tonal">
          {{ formatPrice(item.price) }}
        </v-chip>
      </template>

      <template #item.max_offres="{ item }">
        <span v-if="item.max_offres">{{ item.max_offres }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">Illimité</v-chip>
      </template>

      <template #item.max_articles="{ item }">
        <span v-if="item.max_articles">{{ item.max_articles }}</span>
        <v-chip v-else size="small" color="info" variant="tonal">Illimité</v-chip>
      </template>

      <template #item.featured_events="{ item }">
        <v-icon :color="item.featured_events ? 'success' : 'grey'" size="20">
          {{ item.featured_events ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
      </template>

      <template #item.priority_support="{ item }">
        <v-icon :color="item.priority_support ? 'success' : 'grey'" size="20">
          {{ item.priority_support ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
      </template>

      <template #item.analytics="{ item }">
        <v-icon :color="item.analytics ? 'success' : 'grey'" size="20">
          {{ item.analytics ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
      </template>

      <template #item.is_active="{ item }">
        <v-chip :color="item.is_active ? 'success' : 'error'" size="small" variant="tonal">
          {{ item.is_active ? 'Actif' : 'Inactif' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn 
          icon="mdi-pencil" 
          size="small" 
          color="primary" 
          variant="text" 
          @click="router.push({ name: 'AdminPlanEdit', params: { id: item.id } })" 
        />
        <v-btn 
          icon="mdi-delete" 
          size="small" 
          color="error" 
          variant="text" 
          @click="deleteItem(item.id)" 
        />
      </template>
    </v-data-table>
  </v-card>

  <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

  <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import planService from '../../services/planService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nom', key: 'name' },
  { title: 'Prix', key: 'price', width: '120px' },
  { title: 'Max Offres', key: 'max_offres', width: '120px' },
  { title: 'Max Articles', key: 'max_articles', width: '120px' },
  { title: 'Événements', key: 'featured_events', width: '120px' },
  { title: 'Support', key: 'priority_support', width: '100px' },
  { title: 'Analytics', key: 'analytics', width: '100px' },
  { title: 'Statut', key: 'is_active', width: '100px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', width: '120px' },
]

const items = ref([])
const loading = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const confirmRef = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg
  snackColor.value = color
  snackbar.value = true
}

const load = async () => {
  loading.value = true
  try {
    const res = await planService.getAll()
    items.value = res.data
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer ce plan ?' })
  if (!ok) return
  loading.value = true
  try {
    await planService.delete(id)
    showSnack('Plan supprimé avec succès')
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
