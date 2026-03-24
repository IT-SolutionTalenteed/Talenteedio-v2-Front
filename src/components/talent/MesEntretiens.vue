<template>
  <div>
    <h2>Mes entretiens</h2>

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

const items = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const load = async () => {
  loading.value = true
  try { const res = await entretienService.mesEntretiens(); items.value = res.data }
  catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const annuler = async (item) => {
  if (!confirm('Annuler cet entretien ?')) return
  try {
    await entretienService.annuler(item.id)
    item.statut = 'annule'
    success.value = 'Entretien annulé'
  } catch { error.value = 'Erreur annulation' }
}

onMounted(load)
</script>
