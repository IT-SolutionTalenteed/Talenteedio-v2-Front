<template>
  <v-card rounded="xl" border elevation="0">
    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <v-toolbar color="transparent" border="b" density="compact" class="px-2">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      <v-toolbar-title>Gestion des Talents &amp; Consultants</v-toolbar-title>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="talents"
      :loading="loading"
      :items-per-page="perPage"
      hover
      density="comfortable"
      @update:items-per-page="onPerPageChange"
    >
      <template #item.name="{ item }">
        <div class="font-weight-bold">{{ item.name }}</div>
        <div v-if="item.titre_poste" class="text-caption text-medium-emphasis">{{ item.titre_poste }}</div>
      </template>

      <template #item.role="{ item }">
        <v-chip size="small" :color="item.role === 'consultant_externe' ? 'purple' : 'primary'">
          {{ item.role === 'consultant_externe' ? 'Consultant' : 'Talent' }}
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
          {{ item.is_suspended ? 'Suspendu' : item.is_banned ? 'Banni' : 'Actif' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon="mdi-pencil" size="small" color="primary" variant="tonal" @click="router.push({ name: 'AdminTalentEdit', params: { id: item.id } })" title="Modifier profil" />
          <v-btn
            :icon="item.is_suspended ? 'mdi-check-circle' : 'mdi-pause-circle'"
            size="small"
            :color="item.is_suspended ? 'success' : 'warning'"
            variant="tonal"
            @click="toggleSuspend(item)"
            :title="item.is_suspended ? 'Réactiver' : 'Suspendre'"
          />
          <v-btn
            :icon="item.is_banned ? 'mdi-lock-open' : 'mdi-lock'"
            size="small"
            :color="item.is_banned ? 'info' : 'error'"
            variant="tonal"
            @click="toggleBan(item)"
            :title="item.is_banned ? 'Débannir' : 'Bannir'"
          />
          <v-btn icon="mdi-delete" size="small" color="error" variant="tonal" @click="deleteItem(item.id)" title="Supprimer" />
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
import talentService from '../../services/talentService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const talents = ref([])
const loading = ref(false)
const pagination = ref({ current_page: 1, last_page: 1 })
const perPage = ref(20)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Nom / Titre', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rôle', key: 'role', sortable: false },
  { title: 'Localisation', key: 'localisation', sortable: false },
  { title: 'Provenance', key: 'source_provenance', sortable: false },
  { title: 'Statut CRM', key: 'statut_crm', sortable: false },
  { title: 'État', key: 'etat', sortable: false },
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

const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const res = await talentService.getAll(page, perPage.value)
    talents.value = res.data.data
    pagination.value = { current_page: res.data.current_page, last_page: res.data.last_page }
  } catch {
    showSnack('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const onPerPageChange = (val) => {
  perPage.value = val
  loadPage(1)
}

const toggleSuspend = async (talent) => {
  try {
    const res = await talentService.toggleSuspend(talent.id)
    talent.is_suspended = res.data.is_suspended
    showSnack(talent.is_suspended ? 'Talent suspendu' : 'Talent réactivé')
  } catch {
    showSnack('Erreur lors de la suspension', 'error')
  }
}

const toggleBan = async (talent) => {
  try {
    const res = await talentService.toggleBan(talent.id)
    talent.is_banned = res.data.is_banned
    showSnack(talent.is_banned ? 'Talent banni' : 'Talent débanni')
  } catch {
    showSnack('Erreur lors du bannissement', 'error')
  }
}

const updateStatutCrm = async (talent, statut) => {
  try {
    const res = await talentService.updateStatutCrm(talent.id, statut || null)
    talent.statut_crm = res.data.statut_crm
    talent.is_banned = res.data.is_banned
    showSnack('Statut CRM mis à jour')
  } catch {
    showSnack('Erreur lors de la mise à jour du statut', 'error')
  }
}

const deleteItem = async (id) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer définitivement ce talent ?' })
  if (!ok) return
  loading.value = true
  try {
    await talentService.delete(id)
    showSnack('Talent supprimé')
    await loadPage(pagination.value.current_page)
  } catch (err) {
    showSnack(err.response?.data?.message || 'Erreur lors de la suppression', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)
</script>
