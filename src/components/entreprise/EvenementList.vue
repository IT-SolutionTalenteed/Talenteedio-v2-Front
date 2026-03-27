<template>
  <v-card rounded="xl" border elevation="0" class="pa-4">
    <v-card-title class="text-h5 mb-4">Événements</v-card-title>

    <v-snackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</v-snackbar>

    <!-- Dialog demande de participation -->
    <v-dialog v-model="showDemande" max-width="480" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pa-4">
          Demande de participation — {{ selectedEvenement?.titre }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="demandeMessage"
            label="Message (optionnel)"
            rows="4"
            placeholder="Présentez votre entreprise..."
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showDemande = false">Annuler</v-btn>
          <v-btn color="primary" variant="tonal" :disabled="loading" :loading="loading" @click="soumettreDemande">
            Envoyer la demande
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
      <template #item.demande_statut="{ item }">
        <v-chip
          v-if="item.demande_statut"
          size="small"
          :color="item.demande_statut === 'acceptee' ? 'success' : item.demande_statut === 'refusee' ? 'error' : 'warning'"
        >
          {{ item.demande_statut === 'acceptee' ? 'Acceptée' : item.demande_statut === 'refusee' ? 'Refusée' : 'En attente' }}
        </v-chip>
        <span v-else class="text-medium-emphasis">-</span>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="!item.demande_statut || item.demande_statut === 'refusee'"
          size="small"
          color="primary"
          variant="tonal"
          @click="openDemande(item)"
        >Demander participation</v-btn>
      </template>

      <template #no-data>
        <div class="text-center py-6 text-medium-emphasis">Aucun événement disponible.</div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import evenementService from '../../services/entreprise/evenementService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')
const showDemande = ref(false)
const selectedEvenement = ref(null)
const demandeMessage = ref('')

const snackbar = ref(false)
const snackColor = ref('success')
const snackMsg = ref('')
const showSnack = (msg, color = 'success') => {
  snackMsg.value = msg; snackColor.value = color; snackbar.value = true
}

const headers = [
  { title: 'Nom', key: 'titre' },
  { title: 'Date début', key: 'date_debut' },
  { title: 'Date fin', key: 'date_fin' },
  { title: 'Mon statut', key: 'demande_statut' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const load = async () => {
  loading.value = true
  try {
    const res = await evenementService.getAll()
    items.value = res.data
  } catch { error.value = 'Erreur chargement'; showSnack('Erreur chargement', 'error') }
  finally { loading.value = false }
}

const openDemande = (evenement) => {
  selectedEvenement.value = evenement
  demandeMessage.value = ''
  showDemande.value = true
}

const soumettreDemande = async () => {
  loading.value = true; error.value = ''; success.value = ''
  try {
    await evenementService.demandeParticipation(selectedEvenement.value.id, { message: demandeMessage.value })
    success.value = 'Demande envoyée — un email a été envoyé à l\'administrateur'
    showSnack('Demande envoyée — un email a été envoyé à l\'administrateur')
    showDemande.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
    showSnack(error.value, 'error')
  } finally { loading.value = false }
}

onMounted(load)
</script>
