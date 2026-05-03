<template>
  <v-card rounded="xl" border elevation="0">
    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon icon="mdi-domain" class="mr-2" />
      <v-toolbar-title>Gestion des Entreprises</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'AdminEntrepriseCreate' })">
        Ajouter une entreprise
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.logo_nom="{ item }">
        <div class="d-flex align-center gap-2">
          <v-avatar size="32">
            <img v-if="item.logo_url" :src="item.logo_url" style="width:100%;height:100%;object-fit:cover" />
            <span v-else>{{ item.nom?.charAt(0) }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-bold">{{ item.nom }}</div>
            <div v-if="item.ville" class="text-caption text-medium-emphasis">{{ item.ville }}</div>
          </div>
        </div>
      </template>
      <template #item.email="{ item }">
        {{ item.user?.email || '-' }}
      </template>
      <template #item.ville="{ item }">
        {{ item.ville || '-' }}
      </template>
      <template #item.activity_sector="{ item }">
        <v-chip v-if="item.activity_sector" size="small" color="info">
          {{ item.activity_sector.name }}
        </v-chip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>
      <template #item.plan="{ item }">
        <v-chip v-if="item.plan" size="small" color="primary" variant="tonal" prepend-icon="mdi-crown-outline">
          {{ item.plan.name }}
        </v-chip>
        <span v-else class="text-medium-emphasis">Aucun</span>
      </template>
      <template #item.status="{ item }">
        <v-chip
          size="small"
          :color="item.status === 'active' ? 'success' : 'warning'"
          variant="tonal"
          :prepend-icon="item.status === 'active' ? 'mdi-check-circle' : 'mdi-clock-outline'"
        >
          {{ item.status === 'active' ? 'Actif' : 'En attente' }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="router.push({ name: 'AdminEntrepriseEdit', params: { id: item.id } })" />
        <v-btn icon="mdi-trash-can" size="small" color="error" variant="text" @click="deleteItem(item.id)" />
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import entrepriseService from '../../services/entrepriseService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Logo / Nom', key: 'logo_nom', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Ville', key: 'ville' },
  { title: 'Secteur', key: 'activity_sector', sortable: false },
  { title: 'Plan', key: 'plan', sortable: false, width: '150px' },
  { title: 'Statut', key: 'status', sortable: false, width: '130px' },
  { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await entrepriseService.getAll()
    items.value = res.data
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer cette entreprise et son compte utilisateur ?' })
  if (!ok) return
  loading.value = true
  try {
    await entrepriseService.delete(id)
    showSnack('Entreprise supprimée avec succès')
    await load()
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
