<template>
  <div>
    <h2>Entretiens sur mon stand</h2>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>Talent</th><th>Événement</th><th>Date</th><th>Heure</th><th>Statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.talent?.name }}</td>
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
              <template v-if="item.statut === 'en_attente'">
                <button @click="updateStatut(item, 'confirme')">Confirmer</button>
                <button @click="updateStatut(item, 'refuse')">Refuser</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun entretien sur votre stand.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const load = async () => {
  loading.value = true
  try { const res = await api.get('/entreprise/entretiens'); items.value = res.data }
  catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const updateStatut = async (item, statut) => {
  error.value = ''; success.value = ''
  try {
    const res = await api.patch(`/entreprise/entretiens/${item.id}/statut`, { statut })
    item.statut = res.data.statut
    success.value = statut === 'confirme' ? 'Entretien confirmé' : 'Entretien refusé'
  } catch { error.value = 'Erreur mise à jour' }
}

onMounted(load)
</script>
