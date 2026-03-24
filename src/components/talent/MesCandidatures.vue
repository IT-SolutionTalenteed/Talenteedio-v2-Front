<template>
  <div>
    <h2>Mes candidatures</h2>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>Offre</th><th>Entreprise</th><th>Statut</th><th>CV</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.offre?.titre }}</td>
            <td>{{ item.offre?.entreprise?.nom || '-' }}</td>
            <td>
              <span v-if="item.statut === 'en_attente'">En attente</span>
              <span v-else-if="item.statut === 'acceptee'" style="color:green;">Acceptée ✓</span>
              <span v-else-if="item.statut === 'refusee'" style="color:red;">Refusée</span>
            </td>
            <td><a v-if="item.cv_url" :href="item.cv_url" target="_blank">Voir CV</a></td>
            <td>{{ item.created_at?.substring(0, 10) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Vous n'avez pas encore postulé à une offre.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/talent/offreService.js'

const items = ref([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const res = await offreService.mesCandidatures()
    items.value = res.data
  } catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
})
</script>
