<template>
  <div>
    <h2>Feedbacks post-entretien</h2>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr>
            <th>Talent</th>
            <th>Entreprise</th>
            <th>Événement</th>
            <th>Date entretien</th>
            <th>Note</th>
            <th>Commentaire</th>
            <th>Soumis le</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fb in items" :key="fb.id">
            <td>{{ fb.talent?.name }}</td>
            <td>{{ fb.entretien?.entreprise?.nom }}</td>
            <td>{{ fb.entretien?.evenement?.titre }}</td>
            <td>{{ fb.entretien?.date }}</td>
            <td><strong>{{ fb.note }} / 5</strong></td>
            <td>{{ fb.commentaire || '—' }}</td>
            <td>{{ formatDate(fb.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucun feedback soumis pour l'instant.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

const formatDate = (str) => str ? new Date(str).toLocaleDateString('fr-FR') : '—'

const load = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/feedbacks')
    items.value = res.data
  } catch {
    error.value = 'Erreur chargement des feedbacks'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
