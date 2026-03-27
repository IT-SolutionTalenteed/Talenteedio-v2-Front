<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Mes entretiens</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Dialog feedback -->
    <v-dialog v-model="feedbackDialog" max-width="480" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          Feedback — {{ feedbackEntretien?.entreprise?.nom }}
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <div class="text-body-2 font-weight-medium mb-2">Note</div>
            <v-rating v-model="feedbackForm.note" :length="5" color="warning" hover />
          </div>
          <v-textarea
            v-model="feedbackForm.commentaire"
            label="Commentaire"
            rows="3"
            variant="outlined"
            density="comfortable"
          />
          <v-alert v-if="feedbackError" type="error" density="compact" class="mt-2">{{ feedbackError }}</v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="feedbackDialog = false; feedbackEntretien = null">Annuler</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="savingFeedback" :loading="savingFeedback" @click="soumettreFeedback">
            Soumettre le feedback
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hover
      density="comfortable"
    >
      <template #item.heure="{ item }">
        {{ item.heure_debut }} – {{ item.heure_fin }}
      </template>

      <template #item.statut="{ item }">
        <v-chip
          size="small"
          :color="item.statut === 'confirme' ? 'success' : item.statut === 'refuse' ? 'error' : item.statut === 'annule' ? 'default' : 'warning'"
        >
          {{ item.statut === 'confirme' ? 'Confirmé' : item.statut === 'refuse' ? 'Refusé' : item.statut === 'annule' ? 'Annulé' : 'En attente' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="item.statut === 'en_attente'"
          size="small"
          color="error"
          variant="tonal"
          class="mr-1"
          @click="annuler(item)"
        >Annuler</v-btn>
        <v-btn
          v-if="item.statut === 'confirme' && !item.feedback"
          size="small"
          color="primary"
          variant="tonal"
          @click="ouvrirFeedback(item)"
        >Laisser un feedback</v-btn>
        <span v-if="item.statut === 'confirme' && item.feedback" class="text-caption text-medium-emphasis font-italic">
          Feedback envoyé
        </span>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun entretien réservé.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import entretienService from '../../services/talent/entretienService.js'
import feedbackService from '../../services/talent/feedbackService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

// Feedback state
const feedbackEntretien = ref(null)
const feedbackDialog = ref(false)
const feedbackForm = ref({ note: 5, commentaire: '' })
const savingFeedback = ref(false)
const feedbackError = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Entreprise', key: 'entreprise.nom' },
  { title: 'Événement', key: 'evenement.titre' },
  { title: 'Date', key: 'date' },
  { title: 'Heure', key: 'heure', sortable: false },
  { title: 'Statut', key: 'statut' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await entretienService.mesEntretiens()
    items.value = res.data
  } catch {
    error.value = 'Erreur chargement'
    showSnack('Erreur chargement', 'error')
  } finally {
    loading.value = false
  }
}

const annuler = async (item) => {
  if (!confirm('Annuler cet entretien ?')) return
  try {
    await entretienService.annuler(item.id)
    item.statut = 'annule'
    success.value = 'Entretien annulé'
    showSnack('Entretien annulé')
  } catch {
    error.value = 'Erreur annulation'
    showSnack('Erreur annulation', 'error')
  }
}

const ouvrirFeedback = (item) => {
  feedbackEntretien.value = item
  feedbackForm.value = { note: 5, commentaire: '' }
  feedbackError.value = ''
  success.value = ''
  feedbackDialog.value = true
}

const soumettreFeedback = async () => {
  savingFeedback.value = true
  feedbackError.value = ''
  try {
    const res = await feedbackService.store(feedbackEntretien.value.id, feedbackForm.value)
    // Marquer l'entretien comme ayant un feedback
    const idx = items.value.findIndex(i => i.id === feedbackEntretien.value.id)
    if (idx !== -1) items.value[idx].feedback = res.data
    feedbackEntretien.value = null
    feedbackDialog.value = false
    success.value = 'Feedback soumis avec succès !'
    showSnack('Feedback soumis avec succès !')
  } catch (err) {
    feedbackError.value = err.response?.data?.message || 'Erreur lors de la soumission'
  } finally {
    savingFeedback.value = false
  }
}

onMounted(load)
</script>
