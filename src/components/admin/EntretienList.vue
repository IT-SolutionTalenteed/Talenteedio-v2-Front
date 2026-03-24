<template>
  <div>
    <h2>Entretiens par stand</h2>

    <div>
      <label>Sélectionner un événement :</label>
      <select v-model="selectedEvenementId" @change="load">
        <option value="">-- Choisir un événement --</option>
        <option v-for="ev in evenements" :key="ev.id" :value="ev.id">
          {{ ev.titre }} ({{ ev.date_debut }})
        </option>
      </select>
    </div>

    <div v-if="stands.length > 0">
      <div v-for="stand in stands" :key="stand.entreprise.id" style="margin:16px 0; border:1px solid #ccc; padding:12px;">
        <h3>Stand : {{ stand.entreprise.nom }}</h3>
        <table>
          <thead>
            <tr><th>Talent</th><th>Date</th><th>Heure</th><th>Statut</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in stand.entretiens" :key="e.id">
              <td>{{ e.talent?.name }} ({{ e.talent?.email }})</td>
              <td>{{ e.date }}</td>
              <td>{{ e.heure_debut }} – {{ e.heure_fin }}</td>
              <td>
                <span v-if="e.statut === 'en_attente'">En attente</span>
                <span v-else-if="e.statut === 'confirme'" style="color:green;">Confirmé</span>
                <span v-else-if="e.statut === 'refuse'" style="color:red;">Refusé</span>
                <span v-else-if="e.statut === 'annule'" style="color:gray;">Annulé</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="selectedEvenementId && !loading"><p>Aucun entretien pour cet événement.</p></div>
    <div v-else-if="!selectedEvenementId"><p>Sélectionnez un événement.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const evenements = ref([])
const stands = ref([])
const selectedEvenementId = ref('')
const loading = ref(false)
const error = ref('')

const loadEvenements = async () => {
  try {
    const res = await api.get('/admin/entretiens-evenements')
    evenements.value = res.data
  } catch { error.value = 'Erreur chargement événements' }
}

const load = async () => {
  if (!selectedEvenementId.value) return
  loading.value = true; error.value = ''
  try {
    const res = await api.get('/admin/entretiens', { params: { evenement_id: selectedEvenementId.value } })
    stands.value = res.data
  } catch { error.value = 'Erreur chargement entretiens' }
  finally { loading.value = false }
}

onMounted(loadEvenements)
</script>
