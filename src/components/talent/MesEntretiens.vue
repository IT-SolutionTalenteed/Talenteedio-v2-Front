<template>
  <div>
    <h2>Mes entretiens</h2>

    <!-- Formulaire feedback inline -->
    <div v-if="feedbackEntretien" style="border:1px solid #ccc; padding:12px; margin-bottom:12px;">
      <h4>Feedback — {{ feedbackEntretien.entreprise?.nom }}</h4>
      <div>
        <label>Note (1-5) : </label>
        <input type="number" v-model.number="feedbackForm.note" min="1" max="5" style="width:50px;" />
      </div>
      <div style="margin-top:6px;">
        <label>Commentaire : </label>
        <textarea v-model="feedbackForm.commentaire" rows="3" style="width:300px; display:block;"></textarea>
      </div>
      <div style="margin-top:6px;">
        <button @click="soumettreFeedback" :disabled="savingFeedback">
          {{ savingFeedback ? 'Envoi...' : 'Soumettre le feedback' }}
        </button>
        <button @click="feedbackEntretien = null" style="margin-left:6px;">Annuler</button>
      </div>
      <div v-if="feedbackError" style="color:red;">{{ feedbackError }}</div>
    </div>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>Entreprise</th><th>Événement</th><th>Date</th><th>Heure</th><th>Statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.entreprise?.nom }}</td>
            <td>{{ item.evenement?.titre }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.heure_debut }} – {{ item.heure_fin }}</td>
            <td>
              <span v-if="item.statut === 'en_attente'">En attente</span>
              <span v-else-if="item.statut === 'confirme'" style="color:green;">Confirmé ✓</span>
              <span v-else-if="item.statut === 'refuse'" style="color:red;">Refusé</span>
              <span v-else-if="item.statut === 'annule'" style="color:gray;">Annulé</span>
            </td>
            <td>
              <button
                v-if="item.statut === 'en_attente'"
                @click="annuler(item)"
              >Annuler</button>
              <button
                v-if="item.statut === 'confirme' && !item.feedback"
                @click="ouvrirFeedback(item)"
                style="margin-left:4px;"
              >Laisser un feedback</button>
              <span v-if="item.statut === 'confirme' && item.feedback" style="color:gray; font-style:italic;">
                Feedback envoyé ✓
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun entretien réservé.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
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
const feedbackForm = ref({ note: 5, commentaire: '' })
const savingFeedback = ref(false)
const feedbackError = ref('')

const load = async () => {
  loading.value = true
  try {
    const res = await entretienService.mesEntretiens()
    items.value = res.data
  } catch {
    error.value = 'Erreur chargement'
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
  } catch {
    error.value = 'Erreur annulation'
  }
}

const ouvrirFeedback = (item) => {
  feedbackEntretien.value = item
  feedbackForm.value = { note: 5, commentaire: '' }
  feedbackError.value = ''
  success.value = ''
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
    success.value = 'Feedback soumis avec succès !'
  } catch (err) {
    feedbackError.value = err.response?.data?.message || 'Erreur lors de la soumission'
  } finally {
    savingFeedback.value = false
  }
}

onMounted(load)
</script>
