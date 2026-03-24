<template>
  <div>
    <h2>Candidatures reçues</h2>

    <div>
      <label>Filtrer par offre :</label>
      <select v-model="filtreOffreId" @change="load">
        <option value="">Toutes les offres</option>
        <option v-for="o in offres" :key="o.id" :value="o.id">{{ o.titre }}</option>
      </select>
    </div>

    <div v-if="items.length > 0">
      <table>
        <thead>
          <tr><th>Talent</th><th>Offre</th><th>Statut</th><th>CV</th><th>Message</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.talent?.name }}</td>
            <td>{{ item.offre?.titre }}</td>
            <td>
              <select v-model="item.statut" @change="updateStatut(item)">
                <option value="en_attente">En attente</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
              </select>
            </td>
            <td>
              <a v-if="item.cv_url" :href="item.cv_url" target="_blank">Voir CV</a>
              <span v-else>-</span>
            </td>
            <td>{{ item.message || '-' }}</td>
            <td>{{ item.created_at?.substring(0, 10) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading"><p>Aucune candidature.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import candidatureService from '../../services/entreprise/candidatureService.js'
import offreService from '../../services/entreprise/offreService.js'

const items = ref([])
const offres = ref([])
const filtreOffreId = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const load = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await candidatureService.getAll(filtreOffreId.value || null)
    items.value = res.data
  } catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const updateStatut = async (item) => {
  error.value = ''; success.value = ''
  try {
    await candidatureService.updateStatut(item.id, item.statut)
    success.value = 'Statut mis à jour'
  } catch { error.value = 'Erreur mise à jour'; await load() }
}

onMounted(async () => {
  const res = await offreService.getAll()
  offres.value = res.data
  await load()
})
</script>
