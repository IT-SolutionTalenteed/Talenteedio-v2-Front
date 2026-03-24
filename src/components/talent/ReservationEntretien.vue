<template>
  <div>
    <h2>Réservation d'entretien</h2>
    <p><strong>Événement :</strong> {{ evenement?.titre }}</p>
    <p><strong>Entreprise :</strong> {{ entrepriseNom }}</p>

    <div v-if="!confirme">
      <div v-if="creneaux.length > 0">
        <div v-for="jour in creneaux" :key="jour.date">
          <h4>{{ jour.date }}</h4>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <button
              v-for="slot in jour.slots"
              :key="slot.heure_debut"
              :disabled="!slot.disponible"
              :style="slot.disponible ? 'cursor:pointer' : 'opacity:0.4; cursor:not-allowed'"
              @click="slot.disponible && selectionnerCreneau(jour.date, slot)"
            >
              {{ slot.heure_debut }} – {{ slot.heure_fin }}
              <span v-if="!slot.disponible"> (pris)</span>
            </button>
          </div>
        </div>

        <div v-if="selectedSlot" style="margin-top:12px; border:1px solid green; padding:10px;">
          <p>Créneau sélectionné : <strong>{{ selectedDate }} à {{ selectedSlot.heure_debut }}</strong></p>
          <button @click="confirmerReservation" :disabled="loading">
            {{ loading ? 'Réservation...' : 'Confirmer la réservation' }}
          </button>
          <button @click="selectedSlot = null">Annuler</button>
        </div>
      </div>
      <div v-else-if="!loading"><p>Aucun créneau disponible.</p></div>
    </div>

    <div v-if="confirme" style="color:green;">
      <p>Entretien réservé le {{ confirme.date }} à {{ confirme.heure_debut }} !</p>
      <p>Statut : En attente de confirmation de l'entreprise.</p>
    </div>

    <button @click="$emit('fermer')">← Retour</button>

    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import entretienService from '../../services/talent/entretienService.js'

const props = defineProps({
  evenement: Object,
  entrepriseId: Number,
  entrepriseNom: String,
})
defineEmits(['fermer'])

const creneaux = ref([])
const loading = ref(false)
const error = ref('')
const selectedDate = ref(null)
const selectedSlot = ref(null)
const confirme = ref(null)

const load = async () => {
  loading.value = true
  try {
    const res = await entretienService.getCreneaux(props.evenement.id, props.entrepriseId)
    creneaux.value = res.data
  } catch { error.value = 'Erreur chargement créneaux' }
  finally { loading.value = false }
}

const selectionnerCreneau = (date, slot) => {
  selectedDate.value = date
  selectedSlot.value = slot
  error.value = ''
}

const confirmerReservation = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await entretienService.reserver(props.evenement.id, {
      entreprise_id: props.entrepriseId,
      date: selectedDate.value,
      heure_debut: selectedSlot.value.heure_debut,
    })
    confirme.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la réservation'
  } finally { loading.value = false }
}

onMounted(load)
</script>
