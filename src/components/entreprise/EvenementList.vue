<template>
  <div>
    <h2>Événements</h2>

    <div v-if="showDemande">
      <h3>Demande de participation — {{ selectedEvenement?.titre }}</h3>
      <form @submit.prevent="soumettreDemande">
        <div>
          <label>Message (optionnel)</label>
          <textarea v-model="demandeMessage" rows="4" placeholder="Présentez votre entreprise..."></textarea>
        </div>
        <button type="submit" :disabled="loading">{{ loading ? 'Envoi...' : 'Envoyer la demande' }}</button>
        <button type="button" @click="showDemande = false">Annuler</button>
      </form>
    </div>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>Nom</th><th>Date début</th><th>Date fin</th><th>Mon statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.titre }}</td>
            <td>{{ item.date_debut }}</td>
            <td>{{ item.date_fin }}</td>
            <td>
              <span v-if="item.demande_statut === 'en_attente'">En attente</span>
              <span v-else-if="item.demande_statut === 'acceptee'">Acceptée ✓</span>
              <span v-else-if="item.demande_statut === 'refusee'">Refusée</span>
              <span v-else>-</span>
            </td>
            <td>
              <button
                v-if="!item.demande_statut || item.demande_statut === 'refusee'"
                @click="openDemande(item)"
              >
                Demander participation
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun événement disponible.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
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

const load = async () => {
  loading.value = true
  try {
    const res = await evenementService.getAll()
    items.value = res.data
  } catch { error.value = 'Erreur chargement' }
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
    showDemande.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
  } finally { loading.value = false }
}

onMounted(load)
</script>
