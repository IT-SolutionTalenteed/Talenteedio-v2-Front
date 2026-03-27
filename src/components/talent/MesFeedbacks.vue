<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes feedbacks</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>
    <ConfirmDialog ref="confirmRef" />

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.note="{ item }">
        <v-rating
          :model-value="item.note"
          readonly
          density="compact"
          size="small"
          color="warning"
        />
      </template>

      <template #item.commentaire="{ item }">
        <span>{{ item.commentaire || '—' }}</span>
      </template>

      <template #item.entretien.date="{ item }">
        {{ item.entretien?.date }}
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" icon="mdi-pencil-outline" color="primary" class="mr-1" @click="router.push('/talent/feedbacks/' + item.id + '/edit')" />
        <v-btn size="small" variant="text" icon="mdi-delete-outline" color="error" @click="supprimer(item)" />
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun feedback soumis.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import feedbackService from '../../services/talent/feedbackService.js'
import ConfirmDialog from '../shared/ConfirmDialog.vue'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const confirmRef = ref(null)

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Entreprise', key: 'entretien.entreprise.nom' },
  { title: 'Événement', key: 'entretien.evenement.titre' },
  { title: 'Date entretien', key: 'entretien.date' },
  { title: 'Note', key: 'note', sortable: false },
  { title: 'Commentaire', key: 'commentaire', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await feedbackService.mesFeedbacks()
    items.value = res.data
  } catch {
    showSnack('Erreur lors du chargement des feedbacks', 'error')
  } finally {
    loading.value = false
  }
}

const supprimer = async (fb) => {
  const ok = await confirmRef.value.open({ message: 'Supprimer ce feedback ?' })
  if (!ok) return
  try {
    await feedbackService.destroy(fb.id)
    items.value = items.value.filter(f => f.id !== fb.id)
    showSnack('Feedback supprimé.')
  } catch {
    showSnack('Erreur lors de la suppression', 'error')
  }
}

onMounted(load)
</script>
